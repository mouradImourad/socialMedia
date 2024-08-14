from rest_framework import serializers
from .models import User
from django.core.mail import send_mail
from django.conf import settings
from django.urls import reverse
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
import jwt
from rest_framework_simplejwt.exceptions import TokenError 


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
    

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'email', 'username', 'is_verified', 'profile_picture', 'created_at', 'updated_at')

class EmailVerificationSerializer(serializers.Serializer):
    token = serializers.CharField(max_length=555)

    class Meta:
        fields = ['token']






