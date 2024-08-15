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

    def __str__(self):
        if self.anonymous:
            return f'Anonymous - {self.content[:20]}'
        return f'{self.user.username} - {self.content[:20]}'