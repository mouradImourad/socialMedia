from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Message
from .serializers import MessageSerializer, ConversationSerializer
from django.contrib.auth import get_user_model
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from django.db import models




# messages/views.py




class SendMessageView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)



class MessagePagination(PageNumberPagination):
    page_size = 10  # Number of messages per page
    page_size_query_param = 'page_size'
    max_page_size = 100

    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'messages': data
        })


User = get_user_model()

class RetrieveConversationView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    permission_classes = [IsAuthenticated]
    pagination_class = MessagePagination

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context

    def retrieve(self, request, *args, **kwargs):
        user = request.user
        instance = self.get_object()

        messages = Message.objects.filter(
            models.Q(sender=user, recipient=instance) |
            models.Q(sender=instance, recipient=user)
        ).order_by('timestamp')

        # Mark unread messages as read
        unread_messages = messages.filter(recipient=user, is_read=False)
        unread_messages.update(is_read=True)

        # Apply pagination to messages
        paginator = MessagePagination()
        paginated_messages = paginator.paginate_queryset(messages, request)

        return paginator.get_paginated_response(MessageSerializer(paginated_messages, many=True).data)

    
    



class DeleteMessageView(generics.DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        message = super().get_object()
        if message.sender != self.request.user and message.recipient != self.request.user:
            raise PermissionDenied("You do not have permission to delete this message.")
        return message