from django.test import TestCase
from django.urls import reverse
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from decimal import Decimal
from datetime import date, timedelta

from ..models import User, Collection, Card, Order, OrderItem

User = get_user_model()


class AuthenticationTestCase(APITestCase):
    """Test cases for JWT authentication endpoints."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )

    def test_login_success(self):
        """Test successful login with valid credentials."""
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)

    def test_login_invalid_credentials(self):
        """Test login with invalid credentials."""
        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):
        """Test token refresh functionality."""
        refresh = RefreshToken.for_user(self.user)
        
        url = reverse('token_refresh')
        data = {'refresh': str(refresh)}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_token_verify(self):
        """Test token verification."""
        refresh = RefreshToken.for_user(self.user)
        access_token = refresh.access_token
        
        url = reverse('token_verify')
        data = {'token': str(access_token)}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserRegistrationTestCase(APITestCase):
    """Test cases for user registration."""

    def test_user_registration_success(self):
        """Test successful user registration."""
        url = reverse('user-register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'newpass123',
            'password_confirm': 'newpass123'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['email'], 'newuser@example.com')
        
        # Verify user was created
        user = User.objects.get(email='newuser@example.com')
        self.assertEqual(user.username, 'newuser')

    def test_user_registration_password_mismatch(self):
        """Test registration with password mismatch."""
        url = reverse('user-register')
        data = {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'newpass123',
            'password_confirm': 'different'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_registration_duplicate_email(self):
        """Test registration with duplicate email."""
        User.objects.create_user(
            username='existing',
            email='test@example.com',
            password='pass123'
        )
        
        url = reverse('user-register')
        data = {
            'username': 'newuser',
            'email': 'test@example.com',
            'first_name': 'New',
            'last_name': 'User',
            'password': 'newpass123',
            'password_confirm': 'newpass123'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserProfileTestCase(APITestCase):
    """Test cases for user profile management."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.client.force_authenticate(user=self.user)

    def test_get_user_profile(self):
        """Test retrieving user profile."""
        url = reverse('user-profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertEqual(response.data['full_name'], 'Test User')

    def test_update_user_profile(self):
        """Test updating user profile."""
        url = reverse('user-profile')
        data = {
            'first_name': 'Updated',
            'phone_number': '+1234567890'
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
        
        # Verify in database
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')

    def test_profile_requires_authentication(self):
        """Test that profile endpoint requires authentication."""
        self.client.force_authenticate(user=None)
        url = reverse('user-profile')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CollectionViewSetTestCase(APITestCase):
    """Test cases for Collection ViewSet."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            first_name='Other',
            last_name='User',
            password='otherpass123'
        )
        self.collection = Collection.objects.create(
            name='Test Collection',
            description='A test collection',
            created_by=self.user
        )
        self.client.force_authenticate(user=self.user)

    def test_list_collections(self):
        """Test listing collections."""
        url = reverse('collection-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Collection')

    def test_create_collection(self):
        """Test creating a new collection."""
        url = reverse('collection-list')
        data = {
            'name': 'New Collection',
            'description': 'A new collection',
            'status': 'pending',
            'expected_release_date': str(date.today() + timedelta(days=30))
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Collection')
        self.assertEqual(response.data['created_by']['id'], self.user.id)

    def test_retrieve_collection(self):
        """Test retrieving a specific collection."""
        url = reverse('collection-detail', kwargs={'pk': self.collection.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Collection')

    def test_update_own_collection(self):
        """Test updating own collection."""
        url = reverse('collection-detail', kwargs={'pk': self.collection.pk})
        data = {'name': 'Updated Collection'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Collection')

    def test_cannot_update_others_collection(self):
        """Test that users cannot update others' collections."""
        self.client.force_authenticate(user=self.other_user)
        
        url = reverse('collection-detail', kwargs={'pk': self.collection.pk})
        data = {'name': 'Hacked Collection'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_collection_cards_endpoint(self):
        """Test the collection cards custom endpoint."""
        # Create some cards
        Card.objects.create(
            name='Card 1',
            collection=self.collection,
            base_price=Decimal('10.00')
        )
        Card.objects.create(
            name='Card 2',
            collection=self.collection,
            base_price=Decimal('15.00')
        )
        
        url = reverse('collection-cards', kwargs={'pk': self.collection.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_collections_require_authentication(self):
        """Test that collection endpoints require authentication."""
        self.client.force_authenticate(user=None)
        
        url = reverse('collection-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CardViewSetTestCase(APITestCase):
    """Test cases for Card ViewSet."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            first_name='Admin',
            last_name='User',
            password='adminpass123',
            is_staff=True
        )
        self.collection = Collection.objects.create(
            name='Test Collection',
            created_by=self.user
        )
        self.card = Card.objects.create(
            name='Test Card',
            collection=self.collection,
            base_price=Decimal('10.00'),
            stock_quantity=5
        )

    def test_list_cards_authenticated(self):
        """Test listing cards as authenticated user."""
        self.client.force_authenticate(user=self.user)
        
        url = reverse('card-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_card_as_admin(self):
        """Test creating a card as admin user."""
        self.client.force_authenticate(user=self.admin_user)
        
        url = reverse('card-list')
        data = {
            'name': 'New Card',
            'collection_id': self.collection.id,
            'category': 'rare',
            'rarity': 'foil',
            'base_price': '25.00',
            'stock_quantity': 10
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'New Card')

    def test_create_card_as_regular_user_forbidden(self):
        """Test that regular users cannot create cards."""
        self.client.force_authenticate(user=self.user)
        
        url = reverse('card-list')
        data = {
            'name': 'New Card',
            'collection_id': self.collection.id,
            'base_price': '25.00'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_low_stock_cards_endpoint(self):
        """Test the low stock cards custom endpoint."""
        self.client.force_authenticate(user=self.user)
        
        url = reverse('card-low-stock')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Our test card has 5 stock

    def test_cards_require_authentication(self):
        """Test that card endpoints require authentication."""
        url = reverse('card-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class OrderViewSetTestCase(APITestCase):
    """Test cases for Order ViewSet."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.other_user = User.objects.create_user(
            username='otheruser',
            email='other@example.com',
            first_name='Other',
            last_name='User',
            password='otherpass123'
        )
        self.collection = Collection.objects.create(
            name='Test Collection',
            created_by=self.user
        )
        self.card = Card.objects.create(
            name='Test Card',
            collection=self.collection,
            base_price=Decimal('10.00'),
            stock_quantity=50
        )
        self.order = Order.objects.create(
            user=self.user,
            order_value=Decimal('100.00')
        )
        self.client.force_authenticate(user=self.user)

    def test_list_own_orders(self):
        """Test listing own orders."""
        url = reverse('order-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['user']['id'], self.user.id)

    def test_cannot_see_others_orders(self):
        """Test that users cannot see others' orders."""
        # Create order for other user
        Order.objects.create(
            user=self.other_user,
            order_value=Decimal('50.00')
        )
        
        url = reverse('order-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)  # Only own order

    def test_create_order_with_items(self):
        """Test creating an order with items."""
        url = reverse('order-list')
        data = {
            'order_value': '20.00',
            'notes': 'Test order',
            'items': [
                {
                    'card_id': self.card.id,
                    'quantity': 2,
                    'unit_price': '10.00'
                }
            ]
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify order was created with items
        order = Order.objects.filter(user=self.user).latest('created_at')
        self.assertEqual(order.items.count(), 1)

    def test_complete_order(self):
        """Test completing an order."""
        url = reverse('order-complete', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'completed')
        
        # Verify in database
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'completed')

    def test_cancel_order(self):
        """Test cancelling an order."""
        url = reverse('order-cancel', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'cancelled')

    def test_cannot_complete_already_completed_order(self):
        """Test that completed orders cannot be completed again."""
        self.order.status = 'completed'
        self.order.save()
        
        url = reverse('order-complete', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_cancel_completed_order(self):
        """Test that completed orders cannot be cancelled."""
        self.order.status = 'completed'
        self.order.save()
        
        url = reverse('order-cancel', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_access_others_order(self):
        """Test that users cannot access others' orders."""
        other_order = Order.objects.create(
            user=self.other_user,
            order_value=Decimal('50.00')
        )
        
        url = reverse('order-detail', kwargs={'pk': other_order.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DashboardKPIsTestCase(APITestCase):
    """Test cases for Dashboard KPIs endpoint."""

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.collection = Collection.objects.create(
            name='Test Collection',
            created_by=self.user,
            status='issued'
        )
        self.card = Card.objects.create(
            name='Test Card',
            collection=self.collection,
            base_price=Decimal('10.00')
        )
        self.order = Order.objects.create(
            user=self.user,
            order_value=Decimal('100.00'),
            status='completed'
        )
        OrderItem.objects.create(
            order=self.order,
            card=self.card,
            quantity=2,
            unit_price=Decimal('10.00')
        )
        self.client.force_authenticate(user=self.user)

    def test_dashboard_kpis_success(self):
        """Test successful retrieval of dashboard KPIs."""
        url = reverse('dashboard-kpis')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Check that all expected fields are present
        expected_fields = [
            'total_orders', 'total_revenue', 'total_collections', 'total_cards',
            'pending_orders', 'completed_orders', 'cancelled_orders',
            'active_collections', 'issued_collections', 'total_users',
            'recent_orders', 'top_selling_cards'
        ]
        
        for field in expected_fields:
            self.assertIn(field, response.data)

    def test_dashboard_kpis_calculations(self):
        """Test that KPI calculations are correct."""
        url = reverse('dashboard-kpis')
        response = self.client.get(url)
        
        self.assertEqual(response.data['total_orders'], 1)
        self.assertEqual(str(response.data['total_revenue']), '100.00')
        self.assertEqual(response.data['total_collections'], 1)
        self.assertEqual(response.data['total_cards'], 1)
        self.assertEqual(response.data['completed_orders'], 1)
        self.assertEqual(response.data['issued_collections'], 1)

    def test_dashboard_requires_authentication(self):
        """Test that dashboard endpoint requires authentication."""
        self.client.force_authenticate(user=None)
        
        url = reverse('dashboard-kpis')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PermissionsTestCase(APITestCase):
    """Test cases for API permissions."""

    def setUp(self):
        self.regular_user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='pass123'
        )
        self.admin_user = User.objects.create_user(
            username='admin',
            email='admin@example.com',
            password='pass123',
            is_staff=True
        )

    def test_admin_can_access_user_list(self):
        """Test that admin users can access user list."""
        self.client.force_authenticate(user=self.admin_user)
        
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_regular_user_cannot_access_user_list(self):
        """Test that regular users cannot access user list."""
        self.client.force_authenticate(user=self.regular_user)
        
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_access_forbidden(self):
        """Test that unauthenticated users cannot access protected endpoints."""
        protected_urls = [
            reverse('user-list'),
            reverse('collection-list'),
            reverse('card-list'),
            reverse('order-list'),
            reverse('dashboard-kpis'),
        ]
        
        for url in protected_urls:
            response = self.client.get(url)
            self.assertIn(
                response.status_code,
                [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN]
            ) 