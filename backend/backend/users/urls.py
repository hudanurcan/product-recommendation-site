from django.urls import path
from .views import register, login, get_favorites
from . import views 

urlpatterns = [
    path('register/', register, name='register'),
    path('login/', login, name='login'),
    path('favorites/', views.add_remove_favorite, name='add_remove_favorite'),    
    path('favorites/<str:user_id>', get_favorites),
    ]
