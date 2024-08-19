from django.urls import path
from .views import UserSearchView, PostSearchView

urlpatterns = [
    path('users/', UserSearchView.as_view(), name='user-search'),
    path('posts/', PostSearchView.as_view(), name='post-search'),
]