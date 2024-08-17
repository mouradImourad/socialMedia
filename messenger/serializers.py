# messages/serializers.py
from rest_framework import serializers
from .models import Message
from django.contrib.auth import get_user_model
from django.db import models



User = get_user_model()

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'sender', 'recipient', 'content', 'timestamp', 'is_read']
        read_only_fields = ['id', 'timestamp', 'is_read', 'sender']



class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'messages']

    def to_representation(self, instance):
        request = self.context.get('request')
        user = request.user

        # Retrieve messages between the logged-in user and the other user
        messages = Message.objects.filter(
            models.Q(sender=user, recipient=instance) |
            models.Q(sender=instance, recipient=user)
        ).order_by('timestamp')

        # Mark messages as read when the recipient retrieves them
        unread_messages = messages.filter(recipient=user, is_read=False)
        unread_messages.update(is_read=True)

        # Return the conversation details with the messages
        return {
            'id': instance.id,
            'username': instance.username,
            'messages': MessageSerializer(messages, many=True).data
        }
