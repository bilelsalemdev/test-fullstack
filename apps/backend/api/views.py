from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import CreateAPIView
from django.contrib.auth import login
from django.db.models import Count, Sum, Q
from django.core.cache import cache
from django.utils import timezone
from datetime import timedelta
from drf_spectacular.utils import extend_schema, extend_schema_view

from .models import User, Collection, Card, Order, OrderItem
from .serializers import (
    UserSerializer, UserProfileSerializer, CollectionSerializer,
    CardSerializer, CardListSerializer, OrderSerializer, OrderCreateSerializer,
    LoginSerializer, DashboardKPISerializer
)
from .permissions import (
    IsOwnerOrReadOnly, IsAuthenticatedOrCreateOnly, IsAdminOrReadOnly,
    IsCollectionOwnerOrReadOnly, CanManageOrders
)


@extend_schema_view(
    list=extend_schema(description="List all users (admin only)"),
    create=extend_schema(description="Create a new user account"),
    retrieve=extend_schema(description="Get user details"),
    update=extend_schema(description="Update user information"),
    destroy=extend_schema(description="Delete user account"),
)
class UserViewSet(viewsets.ModelViewSet):
    """ViewSet for User model with custom permissions."""
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticatedOrCreateOnly]

    def get_serializer_class(self):
        if self.action in ['list', 'retrieve']:
            return UserProfileSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        elif self.action in ['list']:
            return [permissions.IsAdminUser()]
        return [permissions.IsAuthenticated()]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def me(self, request):
        """Get current user profile."""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(description="List all collections"),
    create=extend_schema(description="Create a new collection"),
    retrieve=extend_schema(description="Get collection details"),
    update=extend_schema(description="Update collection information"),
    destroy=extend_schema(description="Delete collection"),
)
class CollectionViewSet(viewsets.ModelViewSet):
    """ViewSet for Collection model."""
    queryset = Collection.objects.all()
    serializer_class = CollectionSerializer
    permission_classes = [permissions.IsAuthenticated, IsCollectionOwnerOrReadOnly]
    filterset_fields = ['status', 'created_by']
    search_fields = ['name', 'description']
    ordering_fields = ['created_at', 'expected_release_date', 'name']
    ordering = ['-created_at']

    @action(detail=True, methods=['get'])
    def cards(self, request, pk=None):
        """Get all cards in this collection."""
        collection = self.get_object()
        cards = Card.objects.filter(collection=collection)
        serializer = CardListSerializer(cards, many=True)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(description="List all cards"),
    create=extend_schema(description="Create a new card"),
    retrieve=extend_schema(description="Get card details"),
    update=extend_schema(description="Update card information"),
    destroy=extend_schema(description="Delete card"),
)
class CardViewSet(viewsets.ModelViewSet):
    """ViewSet for Card model."""
    queryset = Card.objects.all()
    permission_classes = [permissions.IsAuthenticated, IsAdminOrReadOnly]
    filterset_fields = ['category', 'rarity', 'collection', 'is_active']
    search_fields = ['name', 'description', 'collection__name']
    ordering_fields = ['created_at', 'name', 'base_price', 'stock_quantity']
    ordering = ['collection', 'name']

    def get_serializer_class(self):
        if self.action == 'list':
            return CardListSerializer
        return CardSerializer

    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """Get cards with low stock (less than 10)."""
        cards = Card.objects.filter(stock_quantity__lt=10, is_active=True)
        serializer = CardListSerializer(cards, many=True)
        return Response(serializer.data)


@extend_schema_view(
    list=extend_schema(description="List user's orders"),
    create=extend_schema(description="Create a new order"),
    retrieve=extend_schema(description="Get order details"),
    update=extend_schema(description="Update order status"),
    destroy=extend_schema(description="Cancel order"),
)
class OrderViewSet(viewsets.ModelViewSet):
    """ViewSet for Order model."""
    queryset = Order.objects.all()
    permission_classes = [permissions.IsAuthenticated, CanManageOrders]
    filterset_fields = ['status', 'order_date']
    search_fields = ['order_number', 'user__email']
    ordering_fields = ['order_date', 'order_value']
    ordering = ['-order_date']

    def get_queryset(self):
        """Users can only see their own orders unless they're staff."""
        if self.request.user.is_staff:
            return Order.objects.all()
        return Order.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == 'create':
            return OrderCreateSerializer
        return OrderSerializer

    @action(detail=True, methods=['post'])
    def complete(self, request, pk=None):
        """Mark order as completed."""
        order = self.get_object()
        if order.status != 'processing':
            return Response(
                {'error': 'Only processing orders can be completed.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'completed'
        order.completed_date = timezone.now()
        order.save()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel an order."""
        order = self.get_object()
        if order.status == 'completed':
            return Response(
                {'error': 'Completed orders cannot be cancelled.'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        order.status = 'cancelled'
        order.save()
        
        serializer = OrderSerializer(order)
        return Response(serializer.data)


class DashboardKPIsView(APIView):
    """
    API view for dashboard KPIs with caching.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        description="Get dashboard KPIs including orders, revenue, collections, and cards statistics",
        responses={200: DashboardKPISerializer}
    )
    def get(self, request):
        """Get dashboard KPIs with Redis caching."""
        cache_key = 'dashboard_kpis'
        cached_data = cache.get(cache_key)
        
        if cached_data:
            return Response(cached_data)

        # Calculate KPIs
        thirty_days_ago = timezone.now() - timedelta(days=30)
        
        # Order statistics
        total_orders = Order.objects.count()
        total_revenue = Order.objects.filter(
            status='completed'
        ).aggregate(Sum('order_value'))['order_value__sum'] or 0
        
        pending_orders = Order.objects.filter(status='processing').count()
        completed_orders = Order.objects.filter(status='completed').count()
        cancelled_orders = Order.objects.filter(status='cancelled').count()
        
        # Collection statistics
        total_collections = Collection.objects.count()
        active_collections = Collection.objects.filter(
            status__in=['pending', 'in_production']
        ).count()
        issued_collections = Collection.objects.filter(status='issued').count()
        
        # Card statistics
        total_cards = Card.objects.count()
        
        # User statistics
        total_users = User.objects.filter(is_active=True).count()
        
        # Recent orders (last 10)
        recent_orders = Order.objects.select_related('user').order_by('-order_date')[:10]
        
        # Top selling cards (based on order items)
        top_selling_cards = Card.objects.annotate(
            total_sold=Sum('order_items__quantity')
        ).filter(
            total_sold__isnull=False
        ).order_by('-total_sold')[:10]
        
        kpi_data = {
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'total_collections': total_collections,
            'total_cards': total_cards,
            'pending_orders': pending_orders,
            'completed_orders': completed_orders,
            'cancelled_orders': cancelled_orders,
            'active_collections': active_collections,
            'issued_collections': issued_collections,
            'total_users': total_users,
            'recent_orders': OrderSerializer(recent_orders, many=True).data,
            'top_selling_cards': CardListSerializer(top_selling_cards, many=True).data,
        }
        
        # Cache for 5 minutes
        cache.set(cache_key, kpi_data, 300)
        
        return Response(kpi_data)


class UserRegistrationView(CreateAPIView):
    """
    API view for user registration.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    @extend_schema(
        description="Register a new user account",
        responses={201: UserProfileSerializer}
    )
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Return user profile data
        profile_serializer = UserProfileSerializer(user)
        return Response(
            profile_serializer.data,
            status=status.HTTP_201_CREATED
        )


class UserProfileView(APIView):
    """
    API view for user profile management.
    """
    permission_classes = [permissions.IsAuthenticated]

    @extend_schema(
        description="Get current user profile",
        responses={200: UserProfileSerializer}
    )
    def get(self, request):
        """Get current user profile."""
        serializer = UserProfileSerializer(request.user)
        return Response(serializer.data)

    @extend_schema(
        description="Update current user profile",
        request=UserProfileSerializer,
        responses={200: UserProfileSerializer}
    )
    def put(self, request):
        """Update current user profile."""
        serializer = UserProfileSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)
