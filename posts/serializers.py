from rest_framework import serializers
from .models import Post, Comment
from django.contrib.auth import get_user_model


User = get_user_model()

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    tags = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    shared_from_content = serializers.ReadOnlyField(source='shared_from.content')

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'image', 'video', 'created_at', 'updated_at', 'likes_count', 'comments_count', 'anonymous', 'shared_from', 'shared_from_content', 'tags']

    def get_likes_count(self, obj):         
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()
    
    # def create(self, validated_data):
    #     tags = validated_data.pop('tags', [])
    #     post = super().create(validated_data)
    #     post.tags.set(tags)  # Explicitly setting tags
    #     return post

    # def update(self, instance, validated_data):
    #     tags = validated_data.pop('tags', [])
    #     instance = super().update(instance, validated_data)
    #     instance.tags.set(tags)  # Explicitly updating tags
    #     return instance


class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Shows the username instead of user ID

    class Meta:
        model = Comment
        fields = ['id', 'post', 'user', 'content', 'created_at']
        read_only_fields = ['id', 'user', 'created_at', 'post']




#  notification serializer later 