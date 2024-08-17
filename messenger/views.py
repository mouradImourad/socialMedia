from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Message
from .serializers import MessageSerializer, ConversationSerializer
from django.contrib.auth import get_user_model





# messages/views.py




class SendMessageView(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(sender=self.request.user)




User = get_user_model()

class RetrieveConversationView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context




class DeleteMessageView(generics.DestroyAPIView):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        message = super().get_object()
        if message.sender != self.request.user and message.recipient != self.request.user:
            raise PermissionDenied("You do not have permission to delete this message.")
        return message