from django.urls import path
from .views import SendFriendRequestView

urlpatterns = [
    path('send-request/<uuid:user_id>/', SendFriendRequestView.as_view(), name='send-friend-request'),
]
