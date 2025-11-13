from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import HttpResponse
import requests
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


from .models import Cliente, Producto, Venta, DetalleVenta
from .serializers import (
    UserSerializer, RegisterSerializer,
    ClienteSerializer, ProductoSerializer,
    VentaSerializer, DetalleVentaSerializer
)

from reportlab.pdfgen import canvas
from io import BytesIO

# ==============================
# 🔐 AUTENTICACIÓN
# ==============================

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
# ==============================
# 🔑 LOGIN PERSONALIZADO (JWT)
# ==============================

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Agregar datos personalizados al token si quieres
        token['username'] = user.username
        return token


class LoginView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer



# ==============================
# 🧍 CLIENTES CRUD
# ==============================

class ClienteListCreateView(generics.ListCreateAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]


class ClienteRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    permission_classes = [IsAuthenticated]


import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET'])
@permission_classes([AllowAny])
def consultar_dni(request):
    dni = request.GET.get('numero')
    if not dni:
        return Response({'error': 'DNI es requerido'}, status=status.HTTP_400_BAD_REQUEST)

    url = 'https://api.decolecta.com/v1/reniec/dni'
    headers = {
        'Accept': 'application/json',
        'Authorization': 'Bearer sk_11545.eFA0xfGr0ibPrFWZ602Fq7dsARUb4pfR'
    }

    try:
        response = requests.get(url, params={'numero': dni}, headers=headers)
        if response.status_code == 401:
            return Response({'error': 'Token inválido o expirado'}, status=401)
        response.raise_for_status()
        return Response(response.json())
    except requests.RequestException as e:
        return Response(
            {'error': f'Error consultando RENIEC: {str(e)}'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )



# ==============================
# 📦 PRODUCTOS CRUD
# ==============================

class ProductoListCreateView(generics.ListCreateAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]


class ProductoRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Producto.objects.all()
    serializer_class = ProductoSerializer
    permission_classes = [IsAuthenticated]


# ==============================
# 💸 VENTAS Y DETALLES
# ==============================

class VentaListCreateView(generics.ListCreateAPIView):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(usuario=self.request.user)


class VentaRetrieveView(generics.RetrieveAPIView):
    queryset = Venta.objects.all()
    serializer_class = VentaSerializer
    permission_classes = [IsAuthenticated]


# ==============================
# 🧾 GENERAR PDF DE BOLETA
# ==============================

class VentaPDFView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            venta = Venta.objects.get(pk=pk)
        except Venta.DoesNotExist:
            return Response({"error": "Venta no encontrada"}, status=404)

        buffer = BytesIO()
        p = canvas.Canvas(buffer)

        # Cabecera
        p.setFont("Helvetica-Bold", 16)
        p.drawString(200, 800, "BOLETA DE VENTA")

        p.setFont("Helvetica", 12)
        p.drawString(50, 770, f"Cliente: {venta.cliente.nombre if venta.cliente else '---'}")
        p.drawString(50, 750, f"Fecha: {venta.fecha.strftime('%d/%m/%Y %H:%M')}")

        y = 720
        p.drawString(50, y, "Producto")
        p.drawString(250, y, "Cant.")
        p.drawString(300, y, "P.Unit.")
        p.drawString(400, y, "Subtotal")

        y -= 20
        for detalle in venta.detalles.all():
            p.drawString(50, y, detalle.producto.nombre)
            p.drawString(250, y, str(detalle.cantidad))
            p.drawString(300, y, f"S/ {detalle.precio_unitario}")
            p.drawString(400, y, f"S/ {detalle.subtotal}")
            y -= 20

        p.drawString(300, y - 10, "TOTAL:")
        p.drawString(400, y - 10, f"S/ {venta.total}")

        p.showPage()
        p.save()

        buffer.seek(0)
        return HttpResponse(buffer, content_type='application/pdf')
