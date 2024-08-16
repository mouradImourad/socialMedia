from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from .models import Post, Comment, Reaction
from .serializers import PostSerializer, CommentSerializer, ReactionSerializer
from rest_framework.response import Response
from rest_framework import status

# Create your views here.


class CreatePostView(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user if not serializer.validated_data.get('anonymous', False) else None)



class PostListView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer



class PostDetailView(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer



class UserPostListView(generics.ListAPIView):
    serializer_class = PostSerializer

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Post.objects.filter(user_id=user_id)
    


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


#  notification view later 