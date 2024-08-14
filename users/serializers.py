# user/serializers.py 
from rest_framework import serializers
from .models import User
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import jwt
from rest_framework_simplejwt.exceptions import TokenError 
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.utils.encoding import force_str, force_bytes, smart_str, smart_bytes, DjangoUnicodeDecodeError
from rest_framework.exceptions import AuthenticationFailed
from django.contrib.auth.password_validation import validate_password






class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'password', 'profile_picture')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            username=validated_data['username'],
            password=validated_data['password'],
            profile_picture=validated_data.get('profile_picture')
        )
        token = RefreshToken.for_user(user).access_token
        current_site = 'localhost:8000'  # Change this to my frontend URL when i deploy it 
        relative_link = reverse('email-verify')
        absurl = 'http://' + current_site + relative_link + "?token=" + str(token)
        email_body = f'Hi {user.username}, use the link below to verify your email \n{absurl}'
        send_mail(
            'Verify your email',
            email_body,
            settings.EMAIL_HOST_USER,
            [user.email],
            fail_silently=False,
        )
        return user
    


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')
        user = authenticate(email=email, password=password)
        if user and user.is_verified:
            refresh = RefreshToken.for_user(user)
            return {
                'email': user.email,
                'access': str(refresh.access_token),
                'refresh': str(refresh)
            }
        raise serializers.ValidationError('Invalid credentials or unverified account')



class ResetPasswordEmailRequestSerializer(serializers.Serializer):
    email = serializers.EmailField(min_length=2)

    class Meta:
        fields = ['email']

    def validate(self, attrs):
        email = attrs.get('email')
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
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
        return super().validate(attrs)

class SetNewPasswordSerializer(serializers.Serializer):
    password = serializers.CharField(min_length=6, max_length=68, write_only=True)
    token = serializers.CharField(min_length=1, write_only=True)
    uidb64 = serializers.CharField(min_length=1, write_only=True)

    class Meta:
        fields = ['password', 'token', 'uidb64']

    def validate(self, attrs):
        try:
            password = attrs.get('password')
            token = attrs.get('token')
            uidb64 = attrs.get('uidb64')
            id = force_str(urlsafe_base64_decode(uidb64))
            print(f'Decoded ID: {id}')
            user = User.objects.get(id=id)
            print(f'User: {user.email}')

            if not PasswordResetTokenGenerator().check_token(user, token):
                print('Invalid token')
                raise AuthenticationFailed('The reset link is invalid', 401)

            user.set_password(password)
            user.save()
            return {
                'user': user
            }
        except Exception as e:
            print(f'Error: {e}')
            raise AuthenticationFailed('The reset link is invalid', 401)
        
    def create(self, validated_data):
        return validated_data
        


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'profile_picture', 'created_at', 'updated_at')



class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('email', 'username', 'profile_picture')

    def validate_email(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(email=value).exists():
            raise serializers.ValidationError("This email is already in use.")
        return value

    def validate_username(self, value):
        user = self.context['request'].user
        if User.objects.exclude(pk=user.pk).filter(username=value).exists():
            raise serializers.ValidationError("This username is already in use.")
        return value
    


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)

    def validate_new_password(self, value):
        validate_password(value)
        return value

    def validate(self, attrs):
        user = self.context['request'].user
        if not user.check_password(attrs.get('old_password')):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return attrs

    def save(self, **kwargs):
        user = self.context['request'].user
        user.set_password(self.validated_data['new_password'])
        user.save()
        return user
    


class DeactivateAccountSerializer(serializers.Serializer):
    confirmation = serializers.BooleanField(required=True)

    def validate_confirmation(self, value):
        if not value:
            raise serializers.ValidationError("You must confirm deactivation.")
        return value

    def save(self, **kwargs):
        user = self.context['request'].user
        user.is_active = False
        user.save()
        return user
    


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'is_verified', 'profile_picture', 'created_at', 'updated_at')

        

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=555)

    class Meta:
        fields = ['token']






