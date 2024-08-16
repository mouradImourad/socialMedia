from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import FriendRequest, Friendship
from .serializers import FriendRequestSerializer, FriendshipSerializer
from rest_framework.response import Response

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



class AcceptRejectFriendRequestView(generics.UpdateAPIView):
    queryset = FriendRequest.objects.all()
    serializer_class = FriendRequestSerializer
    permission_classes = [IsAuthenticated]

    def update(self, request, *args, **kwargs):
        friend_request = self.get_object()
        if friend_request.to_user != request.user:
            return Response({"detail": "Not authorized to respond to this friend request."}, status=status.HTTP_403_FORBIDDEN)

        status_choice = request.data.get('status')
        if status_choice == 'accepted':
            Friendship.objects.create(user=friend_request.from_user, friend=friend_request.to_user)
            Friendship.objects.create(user=friend_request.to_user, friend=friend_request.from_user)
        friend_request.status = status_choice
        friend_request.save()
        return Response(FriendRequestSerializer(friend_request).data)



class ListFriendsView(generics.ListAPIView):
    serializer_class = FriendshipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        return Friendship.objects.filter(user_id=user_id)



class UnfriendView(generics.DestroyAPIView):
    queryset = Friendship.objects.all()
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        friendship = self.get_object()
        if friendship.user != request.user:
            return Response({"detail": "Not authorized to unfriend this user."}, status=status.HTTP_403_FORBIDDEN)
        friendship.delete()
        return Response({"detail": "Friendship removed."}, status=status.HTTP_204_NO_CONTENT)
