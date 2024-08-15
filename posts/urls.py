from django.urls import path
from .views import CreatePostView, PostListView, PostDetailView

urlpatterns = [
    path('create/', CreatePostView.as_view(), name='create-post'),
    path('', PostListView.as_view(), name='post-list'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
]

