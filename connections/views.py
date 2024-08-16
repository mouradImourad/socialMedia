from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FriendRequest
from .serializers import FriendRequestSerializer

# Create your views here.

User = get_user_model()


class SendFriendRequestView(generics.CreateAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        to_user = User.objects.get(id=self.kwargs['user_id'])
        from_user = self.request.user
        if FriendRequest.objects.filter(from_user=from_user, to_user=to_user, status='pending').exists():
            raise serializers.ValidationError("Friend request already sent.")
        serializer.save(from_user=from_user, to_user=to_user)

