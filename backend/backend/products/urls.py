from django.urls import path
from .views import product_list
from . import views

urlpatterns = [
    path('products/', product_list, name='product-list'),
    #path('api/product/<str:product_id>/', views.product_detail, name='product_detail'),
    path('products/<str:category>/', views.product_by_category, name='product_by_category'),  # Kategoriye özel
    path('', views.product_list, name='product-list'),
    path('tum-urunler/', views.tum_urunleri_getir, name='tum-urunleri-getir'),
    path('<str:product_id>/', views.product_detail, name='product-detail'),
    path('kategori/<str:category>/', views.product_by_category, name='product-by-category'),
    path('recommend/viewed/', views.recommend_based_on_viewed, name='recommend-based-on-viewed'),
    #path('recommend/<str:email>/', views.recommend_products, name='recommend_products'),
    path('recommend/content/<str:email>/', views.content_based_recommendation, name='content_based_recommendation'),

]