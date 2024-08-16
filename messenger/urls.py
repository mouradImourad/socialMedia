# messages/urls.py
from django.urls import path
from .views import SendMessageView, RetrieveConversationView

urlpatterns = [
    path('send/', SendMessageView.as_view(), name='send-message'),
    path('conversation/<uuid:pk>/', RetrieveConversationView.as_view(), name='retrieve-conversation'),
]


