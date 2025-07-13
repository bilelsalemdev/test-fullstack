from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user


class IsAuthenticatedOrCreateOnly(permissions.BasePermission):
    """
    Custom permission to allow unauthenticated users to create accounts,
    but require authentication for other operations.
    """
    def has_permission(self, request, view):
        if request.method == 'POST' and view.action == 'create':
            return True
        return request.user and request.user.is_authenticated


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow admin users to edit,
    but allow read access to authenticated users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated
        return request.user and request.user.is_staff


class IsCollectionOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission for collections - only the creator can edit.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.created_by == request.user


class CanManageOrders(permissions.BasePermission):
    """
    Custom permission for order management.
    Users can only manage their own orders.
    """
    def has_object_permission(self, request, view, obj):
        # Users can view and manage their own orders
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return False 