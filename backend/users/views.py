# user/views.py 
from rest_framework import generics, status
from rest_framework.response import Response
from .serializers import RegisterSerializer, EmailVerificationSerializer, LoginSerializer, SetNewPasswordSerializer, ResetPasswordEmailRequestSerializer, UserProfileSerializer, UserUpdateSerializer, ChangePasswordSerializer, DeactivateAccountSerializer, ConfirmReactivationSerializer, ReactivateAccountSerializer, ProfileVisitSerializer
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from rest_framework_simplejwt.token_blacklist.models import OutstandingToken, BlacklistedToken
from rest_framework import permissions, status
from rest_framework.views import APIView
from django.urls import reverse
from django.core.mail import send_mail
import jwt
from .models import User, ProfileVisit
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from django.utils.encoding import force_str, smart_bytes, DjangoUnicodeDecodeError
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_str, force_bytes, smart_str, smart_bytes, DjangoUnicodeDecodeError
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator



class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user).access_token
        current_site = 'localhost:8000'  # Change this to your frontend URL
        relative_link = reverse('email-verify')
        absurl = 'http://' + current_site + relative_link + "?token=" + str(token)
        email_body = f'Hi {user.username}, use the link below to verify your email \n{absurl}'

        print(f'Token: {token}') 
        
        send_mail(
            'Verify your email',
            email_body,
            'mm697533@gmail.com',
            [user.email],
            fail_silently=False,
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class VerifyEmail(generics.GenericAPIView):
    serializer_class = EmailVerificationSerializer
    permission_classes = [AllowAny]

    def get(self, request):
        token = request.GET.get('token')
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
            user = User.objects.get(id=payload['user_id'])
            if not user.is_verified:
                user.is_verified = True
                user.save()
            return Response({'email': 'Successfully activated'}, status=status.HTTP_200_OK)
        except jwt.ExpiredSignatureError:
            return Response({'error': 'Activation link expired'}, status=status.HTTP_400_BAD_REQUEST)
        except jwt.exceptions.DecodeError:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)
        


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data, status=status.HTTP_200_OK)
    


class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            refresh_token = request.data['refresh_token']
            token = RefreshToken(refresh_token)
            
            # Get the corresponding outstanding token
            outstanding_token = OutstandingToken.objects.get(token=token)

            # Blacklist the token
            BlacklistedToken.objects.create(token=outstanding_token)

            return Response({"detail": "Logout successful"}, status=status.HTTP_200_OK)
        except TokenError as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except OutstandingToken.DoesNotExist:
            return Response({"detail": "Token not found"}, status=status.HTTP_400_BAD_REQUEST)
        



class RequestPasswordResetEmail(generics.GenericAPIView):
    serializer_class = ResetPasswordEmailRequestSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        email = serializer.validated_data['email']
        
        user = User.objects.filter(email=email).first()
        if user:
            token = PasswordResetTokenGenerator().make_token(user)
            uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            current_site = 'localhost:8000'  # Change to your frontend URL
            relative_link = reverse('password-reset-confirm', kwargs={'uidb64': uidb64, 'token': token})
            absurl = 'http://' + current_site + relative_link
            email_body = f'Hi {user.username}, use the link below to reset your password \n{absurl}'
            send_mail(
                'Reset your password',
                email_body,
                settings.EMAIL_HOST_USER,
                [user.email],
                fail_silently=False,
            )
        
        return Response({'detail': 'Password reset email has been sent'}, status=status.HTTP_200_OK)


class PasswordTokenCheckAPI(generics.GenericAPIView):
    permission_classes = [AllowAny]

    def get(self, request, uidb64, token):
        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if PasswordResetTokenGenerator().check_token(user, token):
                return Response({'success': True, 'message': 'Credentials are valid', 'uidb64': uidb64, 'token': token}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response({'error': 'Token is not valid, please request a new one'}, status=status.HTTP_401_UNAUTHORIZED)

class SetNewPasswordAPIView(generics.GenericAPIView):
    serializer_class = SetNewPasswordSerializer
    permission_classes = [AllowAny]

    def patch(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password reset successful"}, status=status.HTTP_200_OK)
    


@method_decorator(cache_page(60 * 15), name='dispatch')
class UserProfileView(generics.RetrieveAPIView):
    permission_classes = [permissions.IsAuthenticated]
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user



class UserUpdateView(generics.UpdateAPIView):
    serializer_class = UserUpdateSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    



class ChangePasswordView(generics.UpdateAPIView):
    serializer_class = ChangePasswordSerializer
    model = User
    permission_classes = (IsAuthenticated,)

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        self.object = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response({'detail': 'Password updated successfully'}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


class DeactivateAccountView(generics.UpdateAPIView):
    serializer_class = DeactivateAccountSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self, queryset=None):
        return self.request.user

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'detail': 'Account deactivated successfully'}, status=status.HTTP_200_OK)
    



class ReactivateAccountView(generics.GenericAPIView):
    serializer_class = ReactivateAccountSerializer
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = User.objects.get(email=serializer.validated_data['email'])
        token = PasswordResetTokenGenerator().make_token(user)
        uidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        current_site = 'localhost:8000'  # Change this to your frontend URL
        relative_link = reverse('confirm-reactivation')
        absurl = f'http://{current_site}{relative_link}?uidb64={uidb64}&token={token}'
        email_body = f'Hi {user.username}, use the link below to reactivate your account \n{absurl}'
        send_mail(
            'Reactivate your account',
            email_body,
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
        return Response({'detail': 'Reactivation email has been sent'}, status=status.HTTP_200_OK)






class ConfirmReactivationView(generics.GenericAPIView):
    serializer_class = ConfirmReactivationSerializer
    permission_classes = [AllowAny]

    def get(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        uidb64 = serializer.validated_data['uidb64']
        token = serializer.validated_data['token']

        try:
            uid = force_str(urlsafe_base64_decode(uidb64))
            user = User.objects.get(pk=uid)

            if PasswordResetTokenGenerator().check_token(user, token):
                user.is_active = True
                user.save()
                return Response({"detail": "Account reactivated successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "The reactivation link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)

        except (TypeError, ValueError, OverflowError, User.DoesNotExist):
            return Response({"error": "The reactivation link is invalid or has expired."}, status=status.HTTP_400_BAD_REQUEST)




class DeleteAccountView(generics.DestroyAPIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, *args, **kwargs):
        user = request.user
        user.delete()
        return Response({"detail": "Account deleted successfully"}, status=status.HTTP_200_OK)




class TrackProfileVisitView(generics.CreateAPIView):
    serializer_class = ProfileVisitSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        profile_owner_id = self.kwargs['user_id']
        profile_owner = User.objects.get(id=profile_owner_id)
        
        # Check if the visitor is not visiting their own profile
        if request.user == profile_owner:
            return Response({"detail": "You cannot visit your own profile."}, status=status.HTTP_400_BAD_REQUEST)
        
        visit = ProfileVisit.objects.create(visitor=request.user, profile_owner=profile_owner)
        serializer = self.get_serializer(visit)
        return Response(serializer.data, status=status.HTTP_201_CREATED)