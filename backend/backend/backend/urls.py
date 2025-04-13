"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from products import views
from products.views import elbise_products
from users.views import get_favorites

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('products.urls')),  # Products app'in URL'leri
    path('api/product/<str:product_id>/', views.product_detail, name='product_detail'),  # Burada <str:product_id> ID'yi alıyor
    #path('api/users/', include('users.urls')), # ?
    path('api/users/', include('users.urls')),  # Users uygulaması
    path('api/kadin/elbise/', elbise_products, name="elbise-products"),
    path('api/users/favorites/<str:user_id>/', get_favorites, name='get_favorites'),
    
]

