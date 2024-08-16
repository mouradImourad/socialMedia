from django.db import models
from django.conf import settings

# Create your models here.

class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to='posts/images/', blank=True, null=True)
    video = models.FileField(upload_to='posts/videos/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    anonymous = models.BooleanField(default=False)
    shared_from = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True)
    tags = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tagged_posts', blank=True)
    shared_from = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='shared_posts')

    def __str__(self):
        if self.anonymous:
            return f'Anonymous - {self.content[:20]}'
        return f'{self.user.username} - {self.content[:20]}'
    
REACTION_CHOICES = (
    ('like', 'Like'),
    ('love', 'Love'),
    ('haha', 'Haha'),
    ('wow', 'Wow'),
    ('sad', 'Sad'),
    ('angry', 'Angry'),
)

class Reaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='reactions', on_delete=models.CASCADE)
    reaction_type = models.CharField(max_length=10, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post', 'reaction_type')  

    def __str__(self):
        return f'{self.user.username} reacted {self.reaction_type} to {self.post.id}'


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.content[:20]}'
    


# add notification model later 


