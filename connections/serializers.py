from rest_framework import serializers
from .models import FriendRequest, Friendship

class FriendRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FriendRequest
        fields = ['from_user', 'to_user', 'status', 'created_at']
        read_only_fields = ['from_user', 'to_user', 'status', 'created_at']  



class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['id', 'user', 'friend', 'created_at']

