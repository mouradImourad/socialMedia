from rest_framework import serializers
from .models import Post, Comment, Reaction
from django.contrib.auth import get_user_model


User = get_user_model()

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    tags = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), many=True, required=False)
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    shared_from_content = serializers.ReadOnlyField(source='shared_from.content')
    views = serializers.IntegerField(read_only=True)
    shares_count = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'image', 'video', 'created_at', 'updated_at', 'likes_count', 'comments_count', 'anonymous', 'shared_from', 'shared_from_content', 'tags', 'shares_count', 'views']

    def get_likes_count(self, obj):         
        return obj.likes.count()

    def get_comments_count(self, obj):
        return obj.comments.count()
    
    def get_shares_count(self, obj):
        return obj.shared_posts.count()
    
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



class ReactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reaction
        fields = ['id', 'user', 'post', 'reaction_type', 'created_at']
        read_only_fields = ['id', 'user', 'created_at']

#  notification serializer later 