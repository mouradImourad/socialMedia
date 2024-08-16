from django.urls import path
from .views import SendFriendRequestView, AcceptRejectFriendRequestView, ListFriendsView

urlpatterns = [
    path('send-request/<uuid:user_id>/', SendFriendRequestView.as_view(), name='send-friend-request'),
    path('respond-request/<int:pk>/', AcceptRejectFriendRequestView.as_view(), name='respond-friend-request'),
    path('list-friends/<uuid:user_id>/', ListFriendsView.as_view(), name='list-friends'),
]
 