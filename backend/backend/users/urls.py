from django.urls import path
from .views import register, login, get_favorites
from . import views 

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('favorites/', views.add_remove_favorite, name='add_remove_favorite'),    
    path('favorites/<str:user_id>', get_favorites),
    path('viewed/add/', views.add_viewed_product, name='add_viewed_product'),
    path('<str:email>/favorites/', views.get_user_favorites, name='get_user_favorites'),
    path('<str:email>/viewed/', views.get_user_viewed_products, name='get_user_viewed_products'),
    ]
