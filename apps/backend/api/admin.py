from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Collection, Card, Order, OrderItem


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    """Custom admin for User model."""
    list_display = ('email', 'first_name', 'last_name', 'is_active', 'is_staff', 'date_joined')
    list_filter = ('is_active', 'is_staff', 'is_superuser', 'date_joined')
    search_fields = ('email', 'first_name', 'last_name', 'username')
    ordering = ('-date_joined',)
    
    fieldsets = (
        (None, {'fields': ('username', 'email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone_number')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )
    
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'email', 'first_name', 'last_name', 'password1', 'password2'),
        }),
    )


@admin.register(Collection)
class CollectionAdmin(admin.ModelAdmin):
    """Admin interface for Collection model."""
    list_display = ('name', 'status', 'expected_release_date', 'total_cards', 'created_by', 'created_at')
    list_filter = ('status', 'created_at', 'expected_release_date')
    search_fields = ('name', 'description')
    readonly_fields = ('created_at', 'updated_at', 'total_cards')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {'fields': ('name', 'description', 'status')}),
        ('Dates', {'fields': ('expected_release_date', 'actual_release_date')}),
        ('Metadata', {'fields': ('created_by', 'created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


class OrderItemInline(admin.TabularInline):
    """Inline admin for OrderItem model."""
    model = OrderItem
    extra = 0
    readonly_fields = ('total_price',)


@admin.register(Card)
class CardAdmin(admin.ModelAdmin):
    """Admin interface for Card model."""
    list_display = ('name', 'collection', 'category', 'rarity', 'current_price', 'stock_quantity', 'is_active')
    list_filter = ('category', 'rarity', 'is_active', 'collection__status', 'created_at')
    search_fields = ('name', 'description', 'collection__name')
    readonly_fields = ('created_at', 'updated_at', 'current_price', 'is_in_stock')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        (None, {'fields': ('name', 'description', 'collection')}),
        ('Classification', {'fields': ('category', 'rarity')}),
        ('Pricing & Stock', {'fields': ('base_price', 'market_price', 'stock_quantity', 'is_active')}),
        ('Metadata', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    """Admin interface for Order model."""
    list_display = ('order_number', 'user', 'order_value', 'status', 'total_items', 'order_date')
    list_filter = ('status', 'order_date', 'completed_date')
    search_fields = ('order_number', 'user__email', 'user__first_name', 'user__last_name')
    readonly_fields = ('order_number', 'order_date', 'created_at', 'updated_at', 'total_items')
    date_hierarchy = 'order_date'
    inlines = [OrderItemInline]
    
    fieldsets = (
        (None, {'fields': ('order_number', 'user', 'order_value', 'status')}),
        ('Dates', {'fields': ('order_date', 'completed_date')}),
        ('Additional Info', {'fields': ('notes',)}),
        ('Metadata', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )
