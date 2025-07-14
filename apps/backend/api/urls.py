from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'collections', views.CollectionViewSet)
router.register(r'cards', views.CardViewSet)
router.register(r'orders', views.OrderViewSet)

urlpatterns = [
    path('', include(router.urls)),
    
    path('dashboard/kpis/', views.DashboardKPIsView.as_view(), name='dashboard-kpis'),
    path('auth/register/', views.UserRegistrationView.as_view(), name='user-register'),
    path('auth/profile/', views.UserProfileView.as_view(), name='user-profile'),
] 