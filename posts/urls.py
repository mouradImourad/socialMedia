from django.urls import path
from .views import CreatePostView, PostListView, PostDetailView, UserPostListView, PostUpdateView, PostDeleteView, PostLikeUnlikeView, CommentCreateView

urlpatterns = [
    path('create/', CreatePostView.as_view(), name='create-post'),
    path('', PostListView.as_view(), name='post-list'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('user/<uuid:user_id>/', UserPostListView.as_view(), name='user-post-list'),
    path('<int:pk>/edit/', PostUpdateView.as_view(), name='post-update'),
    path('<int:pk>/delete/', PostDeleteView.as_view(), name='post-delete'),
    path('<int:pk>/like/', PostLikeUnlikeView.as_view(), name='post-like-unlike'),
    path('<int:post_id>/comment/', CommentCreateView.as_view(), name='post-comment'),
]

