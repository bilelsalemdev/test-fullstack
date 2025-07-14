from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta, date
from decimal import Decimal
import random

from api.models import Collection, Card, Order, OrderItem

User = get_user_model()


class Command(BaseCommand):
    help = 'Seed database with sample data for dashboard and orders'

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing data before seeding',
        )

    def handle(self, *args, **options):
        if options['clear']:
            self.stdout.write('Clearing existing data...')
            OrderItem.objects.all().delete()
            Order.objects.all().delete()
            Card.objects.all().delete()
            Collection.objects.all().delete()
            User.objects.filter(is_superuser=False).delete()

        self.stdout.write('Starting database seeding...')
        
        # Create sample users
        self.create_users()
        
        # Create sample collections
        self.create_collections()
        
        # Create sample cards
        self.create_cards()
        
        # Create sample orders
        self.create_orders()
        
        self.stdout.write(
            self.style.SUCCESS('Successfully seeded database with sample data!')
        )

    def create_users(self):
        """Create sample users."""
        self.stdout.write('Creating sample users...')
        
        # Create admin user if doesn't exist
        if not User.objects.filter(is_superuser=True).exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                first_name='Admin',
                last_name='User'
            )
            self.stdout.write('  - Created admin user')

        # Create sample regular users
        sample_users = [
            {'username': 'john_doe', 'email': 'john@example.com', 'first_name': 'John', 'last_name': 'Doe', 'phone_number': '+1234567890'},
            {'username': 'jane_smith', 'email': 'jane@example.com', 'first_name': 'Jane', 'last_name': 'Smith', 'phone_number': '+1234567891'},
            {'username': 'mike_wilson', 'email': 'mike@example.com', 'first_name': 'Mike', 'last_name': 'Wilson', 'phone_number': '+1234567892'},
            {'username': 'sarah_johnson', 'email': 'sarah@example.com', 'first_name': 'Sarah', 'last_name': 'Johnson', 'phone_number': '+1234567893'},
            {'username': 'alex_brown', 'email': 'alex@example.com', 'first_name': 'Alex', 'last_name': 'Brown', 'phone_number': '+1234567894'},
            {'username': 'emily_davis', 'email': 'emily@example.com', 'first_name': 'Emily', 'last_name': 'Davis', 'phone_number': '+1234567895'},
            {'username': 'chris_miller', 'email': 'chris@example.com', 'first_name': 'Chris', 'last_name': 'Miller', 'phone_number': '+1234567896'},
            {'username': 'lisa_garcia', 'email': 'lisa@example.com', 'first_name': 'Lisa', 'last_name': 'Garcia', 'phone_number': '+1234567897'},
        ]

        for user_data in sample_users:
            if not User.objects.filter(email=user_data['email']).exists():
                User.objects.create_user(
                    password='password123',
                    **user_data
                )
                self.stdout.write(f"  - Created user: {user_data['first_name']} {user_data['last_name']}")

    def create_collections(self):
        """Create sample collections matching the Orders table data."""
        self.stdout.write('Creating sample collections...')
        
        admin_user = User.objects.filter(is_superuser=True).first()
        
        collections_data = [
            {
                'name': 'Team Falcons #1',
                'description': 'First collection featuring Team Falcons esports team',
                'status': 'in_production',
                'expected_release_date': date(2024, 2, 15),
                'category': 'Esport'
            },
            {
                'name': 'Falcons 5',
                'description': 'Fifth edition of Falcons gaming collection',
                'status': 'pending',
                'expected_release_date': date(2024, 3, 10),
                'category': 'Gaming'
            },
            {
                'name': '0xabc123...789',
                'description': 'Crypto-themed NFT collection',
                'status': 'pending',
                'expected_release_date': date(2024, 2, 28),
                'category': 'Esport'
            },
            {
                'name': '0xdef456...012',
                'description': 'Gaming blockchain collection',
                'status': 'in_production',
                'expected_release_date': date(2024, 3, 15),
                'category': 'Gaming'
            },
            {
                'name': '0xghi789...345',
                'description': 'Gaming digital assets',
                'status': 'pending',
                'expected_release_date': date(2024, 4, 1),
                'category': 'Gaming'
            },
            {
                'name': '0xjkl012...678',
                'description': 'Gaming collectibles series',
                'status': 'issued',
                'expected_release_date': date(2024, 1, 20),
                'actual_release_date': date(2024, 1, 22),
                'category': 'Gaming'
            },
            {
                'name': '0xmno345...901',
                'description': 'Esports tournament collection',
                'status': 'in_production',
                'expected_release_date': date(2024, 3, 5),
                'category': 'Esport'
            },
            {
                'name': '0xpqr678...234',
                'description': 'Esports champions series',
                'status': 'in_production',
                'expected_release_date': date(2024, 2, 25),
                'category': 'Esport'
            },
            {
                'name': '0xstu901...567',
                'description': 'Esports legends collection',
                'status': 'issued',
                'expected_release_date': date(2024, 1, 15),
                'actual_release_date': date(2024, 1, 18),
                'category': 'Esport'
            },
            {
                'name': '0xvwx234...890',
                'description': 'Gaming universe collection',
                'status': 'in_production',
                'expected_release_date': date(2024, 3, 20),
                'category': 'Gaming'
            },
        ]

        for i, collection_data in enumerate(collections_data, 1):
            collection = Collection.objects.create(
                name=collection_data['name'],
                description=collection_data['description'],
                status=collection_data['status'],
                expected_release_date=collection_data['expected_release_date'],
                actual_release_date=collection_data.get('actual_release_date'),
                created_by=admin_user
            )
            self.stdout.write(f"  - Created collection: {collection.name}")

    def create_cards(self):
        """Create sample cards for each collection."""
        self.stdout.write('Creating sample cards...')
        
        collections = Collection.objects.all()
        card_names = [
            'Lightning Strike', 'Fire Dragon', 'Ice Wizard', 'Shadow Warrior', 'Golden Phoenix',
            'Storm Giant', 'Crystal Mage', 'Dark Knight', 'Wind Archer', 'Earth Guardian',
            'Thunder Lord', 'Frost Queen', 'Flame Soldier', 'Water Sprite', 'Rock Titan',
            'Sky Rider', 'Ocean Master', 'Mountain King', 'Forest Ranger', 'Desert Nomad'
        ]
        
        categories = ['common', 'uncommon', 'rare', 'epic', 'legendary']
        rarities = ['normal', 'foil', 'holographic', 'special']
        
        card_counts = [5, 3, 7, 8, 12, 1, 11, 7, 8, 3]  # Number of cards per collection
        
        for i, collection in enumerate(collections):
            num_cards = card_counts[i] if i < len(card_counts) else random.randint(3, 12)
            
            for j in range(num_cards):
                card_name = f"{random.choice(card_names)} #{j+1}"
                category = random.choice(categories)
                rarity = random.choice(rarities)
                
                # Price based on category and rarity
                base_price = {
                    'common': random.uniform(5, 15),
                    'uncommon': random.uniform(15, 35),
                    'rare': random.uniform(35, 75),
                    'epic': random.uniform(75, 150),
                    'legendary': random.uniform(150, 500)
                }[category]
                
                if rarity in ['foil', 'holographic', 'special']:
                    base_price *= random.uniform(1.5, 3.0)
                
                Card.objects.create(
                    name=card_name,
                    description=f"A {category} {rarity} card from {collection.name}",
                    collection=collection,
                    category=category,
                    rarity=rarity,
                    base_price=Decimal(str(round(base_price, 2))),
                    market_price=Decimal(str(round(base_price * random.uniform(0.8, 1.5), 2))),
                    stock_quantity=random.randint(10, 100),
                    is_active=True
                )
            
            self.stdout.write(f"  - Created {num_cards} cards for {collection.name}")

    def create_orders(self):
        """Create sample orders to generate dashboard data."""
        self.stdout.write('Creating sample orders...')
        
        users = list(User.objects.filter(is_superuser=False))
        cards = list(Card.objects.all())
        
        if not users or not cards:
            self.stdout.write(self.style.WARNING('No users or cards found. Skipping order creation.'))
            return
        
        # Create orders over the last 90 days
        order_statuses = ['processing', 'completed', 'cancelled']
        status_weights = [0.2, 0.7, 0.1]  # More completed orders
        
        for i in range(50):  # Create 50 orders
            # Random date in the last 90 days
            days_ago = random.randint(0, 90)
            order_date = timezone.now() - timedelta(days=days_ago)
            
            user = random.choice(users)
            status_choice = random.choices(order_statuses, weights=status_weights)[0]
            
            order = Order.objects.create(
                user=user,
                status=status_choice,
                order_date=order_date,
                completed_date=order_date + timedelta(days=random.randint(1, 7)) if status_choice == 'completed' else None,
                notes=f"Sample order #{i+1}",
                order_value=Decimal('0.00')  # Temporary value, will be updated after adding items
            )
            
            # Add 1-5 items to each order
            num_items = random.randint(1, 5)
            total_value = 0
            
            selected_cards = random.sample(cards, min(num_items, len(cards)))
            
            for card in selected_cards:
                quantity = random.randint(1, 3)
                unit_price = card.current_price
                
                OrderItem.objects.create(
                    order=order,
                    card=card,
                    quantity=quantity,
                    unit_price=unit_price,
                )
                
                total_value += quantity * unit_price
            
            # Update order value
            order.order_value = total_value
            order.save()
            
            if (i + 1) % 10 == 0:
                self.stdout.write(f"  - Created {i + 1} orders...")
        
        self.stdout.write(f"  - Created {Order.objects.count()} total orders") 