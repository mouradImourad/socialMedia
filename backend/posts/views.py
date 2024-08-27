from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post, Comment, Reaction, Bookmark, Hashtag
from .serializers import PostSerializer, CommentSerializer, ReactionSerializer, BookmarkSerializer, HashtagSerializer
from rest_framework.response import Response
from rest_framework import status
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
import bleach
from rest_framework.pagination import PageNumberPagination
from django.conf import settings
import pusher
from .services.pusher_service import trigger_event 
# Create your views here.


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10  # Default number of items per page
    page_size_query_param = 'page_size'
    max_page_size = 100


class CreatePostView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Retrieve the content from the serializer's validated data
        content = serializer.validated_data.get('content', '')

        # Define allowed tags and attributes for sanitization
        allowed_tags = ['b', 'i', 'u', 'a', 'p', 'strong', 'em', 'ul', 'li', 'ol', 'br']
        allowed_attrs = {
            'a': ['href', 'title'],
        }

        # Sanitize the content using bleach
        sanitized_content = bleach.clean(
            content,
            tags=allowed_tags,
            attributes=allowed_attrs
        )

        # Save the post with the sanitized content
        serializer.save(
            user=self.request.user if not serializer.validated_data.get('anonymous', False) else None,
            content=sanitized_content
        )


@method_decorator(cache_page(60 * 15), name='dispatch')
class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    pagination_class = StandardResultsSetPagination


@method_decorator(cache_page(60 * 15), name='dispatch')
class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.views += 1  
        instance.save()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)


@method_decorator(cache_page(60 * 15), name='dispatch')
class UserPostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(user_id=user_id).order_by('-created_at')
    


class PostUpdateView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_update(self, serializer):
        post = self.get_object()
        if post.user != self.request.user:
            raise PermissionDenied("You do not have permission to edit this post.")
        serializer.save()



class PostDeleteView(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_destroy(self, instance):
        if instance.user != self.request.user:
            raise PermissionDenied("You do not have permission to delete this post.")
        instance.delete()


pusher_client = pusher.Pusher(
  app_id='1855743',
  key='ec08aaeb0eb7ff36b414',
  secret='1a5b9dbe05f69502e1cb',
  cluster='us2',
  ssl=True
)


class PostLikeUnlikeView(generics.UpdateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        post = self.get_object()
        user = request.user

        if user in post.likes.all():
            post.likes.remove(user)
            message = 'Post unliked'
        else:
            post.likes.add(user)
            message = 'Post liked'
        # Trigger a Pusher event
        try:
            pusher_client.trigger('post-channel', 'post-liked', {
                'post_id': post.id,
                'user': user.username,
                'message': message
            })
        except Exception as e:
            
            print(f"Pusher error: {e}")
        

        return Response({'message': message}, status=status.HTTP_200_OK)
    



class CommentCreateView(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs.get('post_id')
        post = Post.objects.get(id=post_id)
        serializer.save(user=self.request.user, post=post)



class PostCommentsListView(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('created_at')
    


class SharePostView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        original_post_id = self.kwargs['pk']
        original_post = Post.objects.get(pk=original_post_id)

        # Create a new post that shares the content of the original post
        shared_post = Post.objects.create(
            user=request.user,
            content=original_post.content,
            image=original_post.image,
            video=original_post.video,
            anonymous=False,  # Shared posts typically aren't anonymous
            shared_from=original_post
        )
        shared_post.tags.set(original_post.tags.all())  # Optionally, carry over the tags

        serializer = self.get_serializer(shared_post)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    



class AddReactionView(generics.CreateAPIView):
    serializer_class = ReactionSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        post_id = self.kwargs['pk']
        reaction_type = request.data.get('reaction_type')

        # Check if the user has already reacted with this type to the post
        existing_reaction = Reaction.objects.filter(
            user=request.user,
            post_id=post_id,
            reaction_type=reaction_type
        ).first()

        if existing_reaction:
            return Response({'detail': 'You have already reacted with this type to this post.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new reaction
        reaction = Reaction.objects.create(
            user=request.user,
            post_id=post_id,
            reaction_type=reaction_type
        )
        serializer = self.get_serializer(reaction)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class RemoveReactionView(generics.DestroyAPIView):
    serializer_class = ReactionSerializer
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        post_id = self.kwargs['pk']
        reaction_type = request.data.get('reaction_type')

        # Find and delete the reaction
        reaction = Reaction.objects.filter(
            user=request.user,
            post_id=post_id,
            reaction_type=reaction_type
        ).first()

        if reaction:
            reaction.delete()
            return Response({'detail': 'Reaction removed.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'No such reaction found.'}, status=status.HTTP_404_NOT_FOUND)




class BookmarkPostView(generics.GenericAPIView):
    serializer_class = BookmarkSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        bookmark, created = Bookmark.objects.get_or_create(user=request.user, post=post)

        if created:
            return Response({'message': 'Post bookmarked.'}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message': 'Post is already bookmarked.'}, status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        post_id = self.kwargs['post_id']
        post = Post.objects.get(id=post_id)
        bookmark = Bookmark.objects.filter(user=request.user, post=post).first()

        if bookmark:
            bookmark.delete()
            return Response({'message': 'Bookmark removed.'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'message': 'Bookmark does not exist.'}, status=status.HTTP_400_BAD_REQUEST)
        


class HashtagListView(generics.ListCreateAPIView):
    queryset = Hashtag.objects.all()
    serializer_class = HashtagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class HashtagDetailView(generics.RetrieveAPIView):
    queryset = Hashtag.objects.all()
    serializer_class = HashtagSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

class HashtagPostsListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        hashtag_name = self.kwargs['name']
        hashtag = Hashtag.objects.get(name=hashtag_name)
        return hashtag.posts.all()



#  notification view later 