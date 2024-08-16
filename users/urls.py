# users/urls.py
from django.urls import path
from .views import RegisterView, VerifyEmail, LoginView, LogoutView, RequestPasswordResetEmail, PasswordTokenCheckAPI, SetNewPasswordAPIView, UserProfileView, UserUpdateView, ChangePasswordView, DeactivateAccountView, ReactivateAccountView, ConfirmReactivationView, DeleteAccountView, TrackProfileVisitView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('email-verify/', VerifyEmail.as_view(), name="email-verify"),
    path('login/', LoginView.as_view(), name="login"),
    path('logout/', LogoutView.as_view(), name="logout"),
    path('request-reset-email/', RequestPasswordResetEmail.as_view(), name="request-reset-email"),
    path('password-reset-confirm/<uidb64>/<token>/', PasswordTokenCheckAPI.as_view(), name='password-reset-confirm'),
    path('password-reset-complete/', SetNewPasswordAPIView.as_view(), name='password-reset-complete'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update/', UserUpdateView.as_view(), name='profile-update'),
    path('password/change/', ChangePasswordView.as_view(), name='password-change'),
    path('account-deactivate/', DeactivateAccountView.as_view(), name='account-deactivate'),
    path('account-reactivate/', ReactivateAccountView.as_view(), name='reactivate-account'),
    path('confirm-reactivation/', ConfirmReactivationView.as_view(), name='confirm-reactivation'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete-account'),
    path('profile/<uuid:user_id>/visit/', TrackProfileVisitView.as_view(), name='track-profile-visit'),

]
