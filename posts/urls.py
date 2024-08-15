from django.urls import path
from .views import CreatePostView, PostListView

urlpatterns = [
    path('create/', CreatePostView.as_view(), name='create-post'),
    path('', PostListView.as_view(), name='post-list'),
]

