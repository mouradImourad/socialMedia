from rest_framework import serializers
from .models import FriendRequest, Friendship
from django.contrib.auth import get_user_model

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['from_user', 'to_user', 'status', 'created_at']
        read_only_fields = ['from_user', 'to_user', 'status', 'created_at']  



class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['id', 'user', 'friend', 'created_at']

User = get_user_model()

class MutualFriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_picture']