from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'collections', views.CollectionViewSet)
router.register(r'cards', views.CardViewSet)
router.register(r'orders', views.OrderViewSet)

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('', include(router.urls)),
    
    # Custom endpoints
    path('dashboard/kpis/', views.DashboardKPIsView.as_view(), name='dashboard-kpis'),
    path('auth/register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('auth/profile/', views.UserProfileView.as_view(), name='user-profile'),
] 