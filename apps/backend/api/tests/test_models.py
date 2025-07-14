from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
from decimal import Decimal
from datetime import date, timedelta
from django.utils import timezone

from ..models import User, Collection, Card, Order, OrderItem

User = get_user_model()


class UserModelTest(TestCase):


    def setUp(self):
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'first_name': 'Test',
            'last_name': 'User',
            'password': 'testpass123'
        }

    def test_create_user(self):

        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.email, 'test@example.com')
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.full_name, 'Test User')
        self.assertTrue(user.check_password('testpass123'))
        self.assertTrue(user.is_active)
        self.assertFalse(user.is_staff)

    def test_create_superuser(self):

        admin_data = self.user_data.copy()
        admin_data['email'] = 'admin@example.com'
        admin_data['username'] = 'admin'
        
        user = User.objects.create_superuser(**admin_data)
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)

    def test_user_str_representation(self):

        user = User.objects.create_user(**self.user_data)
        expected = f"Test User (test@example.com)"
        self.assertEqual(str(user), expected)

    def test_full_name_property(self):

        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.full_name, 'Test User')
        
        user.last_name = ''
        self.assertEqual(user.full_name, 'Test')

    def test_email_uniqueness(self):

        User.objects.create_user(**self.user_data)
        
        duplicate_data = self.user_data.copy()
        duplicate_data['username'] = 'different'
        
        with self.assertRaises(Exception):
            User.objects.create_user(**duplicate_data)


class CollectionModelTest(TestCase):


    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.collection_data = {
            'name': 'Test Collection',
            'description': 'A test collection',
            'status': 'pending',
            'expected_release_date': date.today() + timedelta(days=30),
            'created_by': self.user
        }

    def test_create_collection(self):

        collection = Collection.objects.create(**self.collection_data)
        self.assertEqual(collection.name, 'Test Collection')
        self.assertEqual(collection.status, 'pending')
        self.assertEqual(collection.created_by, self.user)
        self.assertFalse(collection.is_released)

    def test_collection_str_representation(self):

        collection = Collection.objects.create(**self.collection_data)
        self.assertEqual(str(collection), 'Test Collection')

    def test_total_cards_property(self):

        collection = Collection.objects.create(**self.collection_data)
        self.assertEqual(collection.total_cards, 0)
        
        Card.objects.create(
            name='Test Card 1',
            collection=collection,
            base_price=Decimal('10.00')
        )
        Card.objects.create(
            name='Test Card 2',
            collection=collection,
            base_price=Decimal('15.00')
        )
        
        self.assertEqual(collection.total_cards, 2)

    def test_is_released_property(self):

        collection = Collection.objects.create(**self.collection_data)
        self.assertFalse(collection.is_released)
        
        collection.status = 'issued'
        self.assertTrue(collection.is_released)

    def test_collection_status_choices(self):

        collection = Collection.objects.create(**self.collection_data)
        
        valid_statuses = ['pending', 'in_production', 'issued']
        for status in valid_statuses:
            collection.status = status
            collection.save()


class CardModelTest(TestCase):


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
        self.card_data = {
            'name': 'Test Card',
            'description': 'A test card',
            'collection': self.collection,
            'category': 'common',
            'rarity': 'normal',
            'base_price': Decimal('10.00'),
            'stock_quantity': 50
        }

    def test_create_card(self):

        card = Card.objects.create(**self.card_data)
        self.assertEqual(card.name, 'Test Card')
        self.assertEqual(card.collection, self.collection)
        self.assertEqual(card.base_price, Decimal('10.00'))
        self.assertTrue(card.is_in_stock)

    def test_card_str_representation(self):

        card = Card.objects.create(**self.card_data)
        expected = f"Test Card (Test Collection)"
        self.assertEqual(str(card), expected)

    def test_current_price_property(self):

        card = Card.objects.create(**self.card_data)
        
        self.assertEqual(card.current_price, Decimal('10.00'))
        
        card.market_price = Decimal('15.00')
        card.save()
        self.assertEqual(card.current_price, Decimal('15.00'))

    def test_is_in_stock_property(self):

        card = Card.objects.create(**self.card_data)
        self.assertTrue(card.is_in_stock)
        
        card.stock_quantity = 0
        self.assertFalse(card.is_in_stock)

    def test_card_unique_together_constraint(self):

        Card.objects.create(**self.card_data)
        
        duplicate_data = self.card_data.copy()
        duplicate_data['base_price'] = Decimal('20.00')
        
        with self.assertRaises(Exception):
            Card.objects.create(**duplicate_data)

    def test_base_price_validation(self):

        card_data = self.card_data.copy()
        card_data['base_price'] = Decimal('-5.00')
        
        card = Card(**card_data)
        with self.assertRaises(ValidationError):
            card.full_clean()


class OrderModelTest(TestCase):


    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='test@example.com',
            first_name='Test',
            last_name='User',
            password='testpass123'
        )
        self.order_data = {
            'user': self.user,
            'order_value': Decimal('100.00'),
            'status': 'processing'
        }

    def test_create_order(self):

        order = Order.objects.create(**self.order_data)
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.order_value, Decimal('100.00'))
        self.assertEqual(order.status, 'processing')
        self.assertIsNotNone(order.order_number)
        self.assertFalse(order.is_completed)

    def test_order_number_generation(self):

        order = Order.objects.create(**self.order_data)
        self.assertTrue(order.order_number.startswith('ORD-'))
        self.assertEqual(len(order.order_number), 12)

    def test_order_str_representation(self):

        order = Order.objects.create(**self.order_data)
        expected = f"Order {order.order_number} - Test User"
        self.assertEqual(str(order), expected)

    def test_is_completed_property(self):

        order = Order.objects.create(**self.order_data)
        self.assertFalse(order.is_completed)
        
        order.status = 'completed'
        self.assertTrue(order.is_completed)

    def test_total_items_property(self):

        order = Order.objects.create(**self.order_data)
        self.assertEqual(order.total_items, 0)
        
        collection = Collection.objects.create(name='Test Collection', created_by=self.user)
        card1 = Card.objects.create(
            name='Test Card 1',
            collection=collection,
            base_price=Decimal('10.00')
        )
        card2 = Card.objects.create(
            name='Test Card 2',
            collection=collection,
            base_price=Decimal('15.00')
        )
        
        OrderItem.objects.create(
            order=order,
            card=card1,
            quantity=2,
            unit_price=Decimal('10.00')
        )
        OrderItem.objects.create(
            order=order,
            card=card2,
            quantity=1,
            unit_price=Decimal('15.00')
        )
        
        self.assertEqual(order.total_items, 2)


class OrderItemModelTest(TestCase):


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
            base_price=Decimal('10.00')
        )
        self.order = Order.objects.create(
            user=self.user,
            order_value=Decimal('100.00')
        )
        self.order_item_data = {
            'order': self.order,
            'card': self.card,
            'quantity': 2,
            'unit_price': Decimal('10.00')
        }

    def test_create_order_item(self):

        order_item = OrderItem.objects.create(**self.order_item_data)
        self.assertEqual(order_item.order, self.order)
        self.assertEqual(order_item.card, self.card)
        self.assertEqual(order_item.quantity, 2)
        self.assertEqual(order_item.unit_price, Decimal('10.00'))
        self.assertEqual(order_item.total_price, Decimal('20.00'))

    def test_order_item_str_representation(self):

        order_item = OrderItem.objects.create(**self.order_item_data)
        expected = f"Test Card x2 in {self.order.order_number}"
        self.assertEqual(str(order_item), expected)

    def test_total_price_calculation(self):

        order_item = OrderItem.objects.create(**self.order_item_data)
        self.assertEqual(order_item.total_price, Decimal('20.00'))
        
        order_item.quantity = 5
        order_item.save()
        self.assertEqual(order_item.total_price, Decimal('50.00'))

    def test_unique_together_constraint(self):

        OrderItem.objects.create(**self.order_item_data)
        
        duplicate_data = self.order_item_data.copy()
        duplicate_data['quantity'] = 3
        
        with self.assertRaises(Exception):
            OrderItem.objects.create(**duplicate_data) 