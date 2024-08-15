from rest_framework import serializers
from .models import Post


class PostSerializer(serializers.ModelSerializer):
    likes_count = serializers.SerializerMethodField()
    comments_count = serializers.SerializerMethodField()
    shared_from_content = serializers.ReadOnlyField(source='shared_from.content')

    class Meta:
        model = Post
        fields = ['id', 'user', 'content', 'image', 'video', 'created_at', 'updated_at', 'likes_count', 'comments_count', 'anonymous', 'shared_from', 'shared_from_content']

# i will need it later 

    def get_likes_count(self, obj):         
        return obj.likes.count()

# i will need it later 

    def get_comments_count(self, obj):
        return obj.comments.count()
    