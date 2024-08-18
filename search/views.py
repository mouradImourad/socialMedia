from django.shortcuts import render
from rest_framework import generics
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSearchSerializer, PostSearchSerializer
from posts.models import Post
from django.db.models import Q
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator


User = get_user_model()


@method_decorator(cache_page(60 * 15), name='dispatch')
class UserSearchView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSearchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get('q', None)
        if query:
            queryset = queryset.filter(username__icontains=query) | queryset.filter(email__icontains=query)
        return queryset


@method_decorator(cache_page(60 * 15), name='dispatch')
class PostSearchView(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSearchSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        query = self.request.query_params.get('q', None)
        if query:
            queryset = queryset.filter(
                Q(content__icontains=query) |
                Q(tags__name__icontains=query)
            ).distinct()
        return queryset