from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password
from .models import User, Collection, Card, Order, OrderItem


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'phone_number', 'is_active', 'date_joined', 'password', 'password_confirm')
        extra_kwargs = {
            'password': {'write_only': True},
            'date_joined': {'read_only': True},
        }

    def validate(self, attrs):
        if attrs.get('password') != attrs.get('password_confirm'):
            raise serializers.ValidationError("Passwords don't match.")
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm', None)
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for user profile (without password fields)."""
    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 
                 'phone_number', 'full_name', 'date_joined')
        read_only_fields = ('id', 'username', 'date_joined')


class CollectionSerializer(serializers.ModelSerializer):
    """Serializer for Collection model."""
    created_by = UserProfileSerializer(read_only=True)
    total_cards = serializers.ReadOnlyField()
    is_released = serializers.ReadOnlyField()

    class Meta:
        model = Collection
        fields = ('id', 'name', 'description', 'status', 'expected_release_date',
                 'actual_release_date', 'created_by', 'total_cards', 'is_released',
                 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)


class CardSerializer(serializers.ModelSerializer):
    """Serializer for Card model."""
    collection = CollectionSerializer(read_only=True)
    collection_id = serializers.IntegerField(write_only=True)
    current_price = serializers.ReadOnlyField()
    is_in_stock = serializers.ReadOnlyField()

    class Meta:
        model = Card
        fields = ('id', 'name', 'description', 'collection', 'collection_id',
                 'category', 'rarity', 'base_price', 'market_price', 'current_price',
                 'stock_quantity', 'is_in_stock', 'is_active', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')


class CardListSerializer(serializers.ModelSerializer):
    """Simplified serializer for Card listing."""
    collection_name = serializers.CharField(source='collection.name', read_only=True)
    current_price = serializers.ReadOnlyField()

    class Meta:
        model = Card
        fields = ('id', 'name', 'collection_name', 'category', 'rarity', 
                 'current_price', 'stock_quantity', 'is_active')


class OrderItemSerializer(serializers.ModelSerializer):
    """Serializer for OrderItem model."""
    card = CardListSerializer(read_only=True)
    card_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'card', 'card_id', 'quantity', 'unit_price', 'total_price')
        read_only_fields = ('id', 'total_price')

    def validate_card_id(self, value):
        try:
            card = Card.objects.get(id=value, is_active=True)
            if not card.is_in_stock:
                raise serializers.ValidationError("Card is out of stock.")
            return value
        except Card.DoesNotExist:
            raise serializers.ValidationError("Card not found or inactive.")


class OrderSerializer(serializers.ModelSerializer):
    """Serializer for Order model."""
    user = UserProfileSerializer(read_only=True)
    items = OrderItemSerializer(many=True, read_only=True)
    total_items = serializers.ReadOnlyField()
    is_completed = serializers.ReadOnlyField()

    class Meta:
        model = Order
        fields = ('id', 'order_number', 'user', 'order_value', 'status',
                 'order_date', 'completed_date', 'notes', 'items', 'total_items',
                 'is_completed', 'created_at', 'updated_at')
        read_only_fields = ('id', 'order_number', 'order_date', 'created_at', 'updated_at')

    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)


class OrderCreateSerializer(serializers.ModelSerializer):
    """Serializer for creating orders with items."""
    items = OrderItemSerializer(many=True)

    class Meta:
        model = Order
        fields = ('order_value', 'notes', 'items')

    def create(self, validated_data):
        items_data = validated_data.pop('items')
        order = Order.objects.create(
            user=self.context['request'].user,
            **validated_data
        )
        
        for item_data in items_data:
            card = Card.objects.get(id=item_data['card_id'])
            OrderItem.objects.create(
                order=order,
                card=card,
                quantity=item_data['quantity'],
                unit_price=item_data.get('unit_price', card.current_price)
            )
        
        return order


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if email and password:
            user = authenticate(
                request=self.context.get('request'),
                username=email,
                password=password
            )
            if not user:
                raise serializers.ValidationError('Invalid email or password.')
            if not user.is_active:
                raise serializers.ValidationError('User account is disabled.')
            attrs['user'] = user
        else:
            raise serializers.ValidationError('Must include email and password.')

        return attrs


class DashboardKPISerializer(serializers.Serializer):
    """Serializer for dashboard KPI data."""
    total_orders = serializers.IntegerField()
    total_revenue = serializers.DecimalField(max_digits=12, decimal_places=2)
    total_collections = serializers.IntegerField()
    total_cards = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    completed_orders = serializers.IntegerField()
    cancelled_orders = serializers.IntegerField()
    active_collections = serializers.IntegerField()
    issued_collections = serializers.IntegerField()
    total_users = serializers.IntegerField()
    recent_orders = OrderSerializer(many=True)
    top_selling_cards = CardListSerializer(many=True) 