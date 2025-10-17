from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Autenticación
    path('auth/register/', views.RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/user/', views.UserView.as_view(), name='user'),

    # Clientes
    path('clientes/', views.ClienteListCreateView.as_view(), name='clientes_list_create'),
    path('clientes/<int:pk>/', views.ClienteRetrieveUpdateDestroyView.as_view(), name='clientes_detail'),

    # Productos
    path('productos/', views.ProductoListCreateView.as_view(), name='productos_list_create'),
    path('productos/<int:pk>/', views.ProductoRetrieveUpdateDestroyView.as_view(), name='productos_detail'),

    # Ventas
    path('ventas/', views.VentaListCreateView.as_view(), name='ventas_list_create'),
    path('ventas/<int:pk>/', views.VentaRetrieveView.as_view(), name='venta_detail'),
    path('ventas/<int:pk>/boleta/', views.VentaPDFView.as_view(), name='venta_pdf'),
]
