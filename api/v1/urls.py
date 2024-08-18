# myproject/api/v1/urls.py
from django.urls import path, include

urlpatterns = [
    path('users/', include('users.urls')),
    path('posts/', include('posts.urls')),
    path('connections/', include('connections.urls')),
    path('messages/', include('messenger.urls')),
    path('search/', include('search.urls')),
]