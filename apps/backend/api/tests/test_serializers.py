from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIRequestFactory
from decimal import Decimal
from datetime import date, timedelta

from ..models import User, Collection, Card, Order, OrderItem
from ..serializers import (
    UserSerializer, UserProfileSerializer, CollectionSerializer,
    CardSerializer, CardListSerializer, OrderSerializer, OrderCreateSerializer,
    OrderItemSerializer, LoginSerializer, DashboardKPISerializer
)

User = get_user_model()


class UserSerializerTest(TestCase):


    def setUp(self):
        self.factory = APIRequestFactory()
        self.valid_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpass123',
            'password_confirm': 'testpass123'
        }

    def test_valid_user_creation(self):

        serializer = UserSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        
        user = serializer.save()
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertTrue(user.check_password('testpass123'))

    def test_password_mismatch_validation(self):

        data = self.valid_data.copy()
        data['password_confirm'] = 'different'
        
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_password_not_in_output(self):

        user = User.objects.create_user(**{
            k: v for k, v in self.valid_data.items() 
            if k not in ['password', 'password_confirm']
        })
        
        serializer = UserSerializer(user)
        self.assertNotIn('password', serializer.data)
        self.assertNotIn('password_confirm', serializer.data)

    def test_email_uniqueness_validation(self):

        User.objects.create_user(**{
            k: v for k, v in self.valid_data.items() 
            if k not in ['password', 'password_confirm']
        })
        
        data = self.valid_data.copy()
        data['username'] = 'different'
        
        serializer = UserSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('email', serializer.errors)


class UserProfileSerializerTest(TestCase):


    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )

    def test_serialization(self):

        serializer = UserProfileSerializer(self.user)
        data = serializer.data
        
        self.assertEqual(data['email'], 'test@example.com')
        self.assertEqual(data['full_name'], 'Test User')
        self.assertNotIn('password', data)

    def test_partial_update(self):

        data = {'first_name': 'Updated'}
        serializer = UserProfileSerializer(self.user, data=data, partial=True)
        
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        self.assertEqual(updated_user.first_name, 'Updated')

    def test_read_only_fields(self):

        data = {
            'id': 999,
            'username': 'hacker',
            'date_joined': '2020-01-01T00:00:00Z'
        }
        serializer = UserProfileSerializer(self.user, data=data, partial=True)
        
        self.assertTrue(serializer.is_valid())
        updated_user = serializer.save()
        
        self.assertNotEqual(updated_user.id, 999)
        self.assertEqual(updated_user.username, 'testuser')


class CollectionSerializerTest(TestCase):


    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.factory = APIRequestFactory()
        self.request = self.factory.get('/')
        self.request.user = self.user

        self.valid_data = {
            'name': 'Test Collection',
            'description': 'A test collection',
            'status': 'pending',
            'expected_release_date': str(date.today() + timedelta(days=30))
        }

    def test_valid_collection_creation(self):

        serializer = CollectionSerializer(
            data=self.valid_data,
            context={'request': self.request}
        )
        self.assertTrue(serializer.is_valid())
        
        collection = serializer.save()
        self.assertEqual(collection.name, 'Test Collection')
        self.assertEqual(collection.created_by, self.user)

    def test_nested_user_serialization(self):

        collection = Collection.objects.create(
            name='Test Collection',
            created_by=self.user
        )
        
        serializer = CollectionSerializer(collection)
        data = serializer.data
        
        self.assertIn('created_by', data)
        self.assertEqual(data['created_by']['email'], 'test@example.com')

    def test_computed_fields(self):

        collection = Collection.objects.create(
            name='Test Collection',
            created_by=self.user,
            status='issued'
        )
        
        serializer = CollectionSerializer(collection)
        data = serializer.data
        
        self.assertIn('total_cards', data)
        self.assertIn('is_released', data)
        self.assertTrue(data['is_released'])


class CardSerializerTest(TestCase):


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
            created_by=self.user
        )
        self.valid_data = {
            'name': 'Test Card',
            'description': 'A test card',
            'collection_id': self.collection.id,
            'category': 'common',
            'rarity': 'normal',
            'base_price': '10.00',
            'stock_quantity': 50
        }

    def test_valid_card_creation(self):

        serializer = CardSerializer(data=self.valid_data)
        self.assertTrue(serializer.is_valid())
        
        card = serializer.save()
        self.assertEqual(card.name, 'Test Card')
        self.assertEqual(card.collection, self.collection)

    def test_nested_collection_serialization(self):

        card = Card.objects.create(
            name='Test Card',
            collection=self.collection,
            base_price=Decimal('10.00')
        )
        
        serializer = CardSerializer(card)
        data = serializer.data
        
        self.assertIn('collection', data)
        self.assertEqual(data['collection']['name'], 'Test Collection')
        self.assertNotIn('collection_id', data)

    def test_computed_fields(self):

        card = Card.objects.create(
            name='Test Card',
            collection=self.collection,
            base_price=Decimal('10.00'),
            market_price=Decimal('15.00'),
            stock_quantity=5
        )
        
        serializer = CardSerializer(card)
        data = serializer.data
        
        self.assertEqual(str(data['current_price']), '15.00')
        self.assertTrue(data['is_in_stock'])


class OrderSerializerTest(TestCase):


    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.factory = APIRequestFactory()
        self.request = self.factory.get('/')
        self.request.user = self.user

    def test_order_serialization(self):

        order = Order.objects.create(
            user=self.user,
            order_value=Decimal('100.00'),
            status='completed'
        )
        
        serializer = OrderSerializer(order)
        data = serializer.data
        
        self.assertIn('user', data)
        self.assertEqual(data['user']['email'], 'test@example.com')
        self.assertIn('order_number', data)
        self.assertTrue(data['is_completed'])

    def test_order_creation_sets_user(self):

        data = {
            'order_value': '100.00',
            'notes': 'Test order'
        }
        
        serializer = OrderSerializer(
            data=data,
            context={'request': self.request}
        )
        self.assertTrue(serializer.is_valid())
        
        order = serializer.save()
        self.assertEqual(order.user, self.user)


class OrderCreateSerializerTest(TestCase):


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
            created_by=self.user
        )
        self.card = Card.objects.create(
            name='Test Card',
            collection=self.collection,
            base_price=Decimal('10.00'),
            stock_quantity=50
        )
        self.factory = APIRequestFactory()
        self.request = self.factory.post('/')
        self.request.user = self.user

    def test_order_creation_with_items(self):

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
        
        serializer = OrderCreateSerializer(
            data=data,
            context={'request': self.request}
        )
        self.assertTrue(serializer.is_valid())
        
        order = serializer.save()
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.items.count(), 1)
        
        item = order.items.first()
        self.assertEqual(item.card, self.card)
        self.assertEqual(item.quantity, 2)


class OrderItemSerializerTest(TestCase):


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
            created_by=self.user
        )
        self.card = Card.objects.create(
            name='Test Card',
            collection=self.collection,
            base_price=Decimal('10.00'),
            stock_quantity=50
        )

    def test_valid_order_item_creation(self):

        data = {
            'card_id': self.card.id,
            'quantity': 2,
            'unit_price': '10.00'
        }
        
        serializer = OrderItemSerializer(data=data)
        self.assertTrue(serializer.is_valid())

    def test_out_of_stock_validation(self):

        self.card.stock_quantity = 0
        self.card.save()
        
        data = {
            'card_id': self.card.id,
            'quantity': 1,
            'unit_price': '10.00'
        }
        
        serializer = OrderItemSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('card_id', serializer.errors)

    def test_inactive_card_validation(self):

        self.card.is_active = False
        self.card.save()
        
        data = {
            'card_id': self.card.id,
            'quantity': 1,
            'unit_price': '10.00'
        }
        
        serializer = OrderItemSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('card_id', serializer.errors)


class LoginSerializerTest(TestCase):


    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )

    def test_valid_login(self):

        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
        serializer = LoginSerializer(data=data)
        self.assertTrue(serializer.is_valid())
        self.assertEqual(serializer.validated_data['user'], self.user)

    def test_invalid_email(self):

        data = {
            'email': 'wrong@example.com',
            'password': 'testpass123'
        }
        
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_invalid_password(self):

        data = {
            'email': 'test@example.com',
            'password': 'wrongpassword'
        }
        
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_inactive_user(self):

        self.user.is_active = False
        self.user.save()
        
        data = {
            'email': 'test@example.com',
            'password': 'testpass123'
        }
        
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('non_field_errors', serializer.errors)

    def test_missing_credentials(self):

        data = {'email': 'test@example.com'}
        
        serializer = LoginSerializer(data=data)
        self.assertFalse(serializer.is_valid())
        self.assertIn('password', serializer.errors) 