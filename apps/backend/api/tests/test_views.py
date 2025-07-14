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


    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )

    def test_login_success(self):

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

        url = reverse('token_obtain_pair')
        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_token_refresh(self):

        refresh = RefreshToken.for_user(self.user)
        
        url = reverse('token_refresh')
        data = {'refresh': str(refresh)}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_token_verify(self):

        refresh = RefreshToken.for_user(self.user)
        access_token = refresh.access_token
        
        url = reverse('token_verify')
        data = {'token': str(access_token)}
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)


class UserRegistrationTestCase(APITestCase):


    def test_user_registration_success(self):

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
        
        user = User.objects.get(email='newuser@example.com')
        self.assertEqual(user.username, 'newuser')

    def test_user_registration_password_mismatch(self):

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

        url = reverse('user-profile')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['email'], 'test@example.com')
        self.assertEqual(response.data['full_name'], 'Test User')

    def test_update_user_profile(self):

        url = reverse('user-profile')
        data = {
            'first_name': 'Updated',
            'phone_number': '+1234567890'
        }
        
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], 'Updated')
        
        self.user.refresh_from_db()
        self.assertEqual(self.user.first_name, 'Updated')

    def test_profile_requires_authentication(self):

        self.client.force_authenticate(user=None)
        url = reverse('user-profile')
        
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CollectionViewSetTestCase(APITestCase):


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

        url = reverse('collection-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['name'], 'Test Collection')

    def test_create_collection(self):

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

        url = reverse('collection-detail', kwargs={'pk': self.collection.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Test Collection')

    def test_update_own_collection(self):

        url = reverse('collection-detail', kwargs={'pk': self.collection.pk})
        data = {'name': 'Updated Collection'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'Updated Collection')

    def test_cannot_update_others_collection(self):

        self.client.force_authenticate(user=self.other_user)
        
        url = reverse('collection-detail', kwargs={'pk': self.collection.pk})
        data = {'name': 'Hacked Collection'}
        
        response = self.client.patch(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_collection_cards_endpoint(self):

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

        self.client.force_authenticate(user=None)
        
        url = reverse('collection-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class CardViewSetTestCase(APITestCase):


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

        self.client.force_authenticate(user=self.user)
        
        url = reverse('card-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_card_as_admin(self):

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

        self.client.force_authenticate(user=self.user)
        
        url = reverse('card-low-stock')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_cards_require_authentication(self):

        url = reverse('card-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class OrderViewSetTestCase(APITestCase):


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

        url = reverse('order-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['user']['id'], self.user.id)

    def test_cannot_see_others_orders(self):

        Order.objects.create(
            user=self.other_user,
            order_value=Decimal('50.00')
        )
        
        url = reverse('order-list')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), 1)

    def test_create_order_with_items(self):

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
        
        order = Order.objects.filter(user=self.user).latest('created_at')
        self.assertEqual(order.items.count(), 1)

    def test_complete_order(self):

        url = reverse('order-complete', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'completed')
        
        self.order.refresh_from_db()
        self.assertEqual(self.order.status, 'completed')

    def test_cancel_order(self):

        url = reverse('order-cancel', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['status'], 'cancelled')

    def test_cannot_complete_already_completed_order(self):

        self.order.status = 'completed'
        self.order.save()
        
        url = reverse('order-complete', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_cancel_completed_order(self):

        self.order.status = 'completed'
        self.order.save()
        
        url = reverse('order-cancel', kwargs={'pk': self.order.pk})
        response = self.client.post(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_cannot_access_others_order(self):

        other_order = Order.objects.create(
            user=self.other_user,
            order_value=Decimal('50.00')
        )
        
        url = reverse('order-detail', kwargs={'pk': other_order.pk})
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DashboardKPIsTestCase(APITestCase):


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

        url = reverse('dashboard-kpis')
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        expected_fields = [
            'total_orders', 'total_revenue', 'total_collections', 'total_cards',
            'pending_orders', 'completed_orders', 'cancelled_orders',
            'active_collections', 'issued_collections', 'total_users',
            'recent_orders', 'top_selling_cards'
        ]
        
        for field in expected_fields:
            self.assertIn(field, response.data)

    def test_dashboard_kpis_calculations(self):

        url = reverse('dashboard-kpis')
        response = self.client.get(url)
        
        self.assertEqual(response.data['total_orders'], 1)
        self.assertEqual(str(response.data['total_revenue']), '100.00')
        self.assertEqual(response.data['total_collections'], 1)
        self.assertEqual(response.data['total_cards'], 1)
        self.assertEqual(response.data['completed_orders'], 1)
        self.assertEqual(response.data['issued_collections'], 1)

    def test_dashboard_requires_authentication(self):

        self.client.force_authenticate(user=None)
        
        url = reverse('dashboard-kpis')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class PermissionsTestCase(APITestCase):


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

        self.client.force_authenticate(user=self.admin_user)
        
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_regular_user_cannot_access_user_list(self):

        self.client.force_authenticate(user=self.regular_user)
        
        url = reverse('user-list')
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_unauthenticated_access_forbidden(self):

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