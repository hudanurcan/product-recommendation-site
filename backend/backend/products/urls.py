from django.urls import path
from .views import product_list
from . import views

urlpatterns = [
    path('products/', product_list, name='product-list'),
    #path('api/product/<str:product_id>/', views.product_detail, name='product_detail'),
    path('products/<str:category>/', views.product_by_category, name='product_by_category'),  # Kategoriye özel

]