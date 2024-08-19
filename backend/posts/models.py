from django.db import models
from django.conf import settings
from django.utils.translation import gettext as _
# Create your models here.


class Hashtag(models.Model):
    name = models.CharField(_('name'), max_length=100, unique=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    def __str__(self):
        return self.name


class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True)
    content = models.TextField(_('content'), blank=True, null=True)
    image = models.ImageField(_('image'), upload_to='posts/images/', blank=True, null=True)
    video = models.FileField(_('video'), upload_to='posts/videos/', blank=True, null=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    anonymous = models.BooleanField(_('anonymous'), default=False)
    shared_from = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL, related_name='shared_posts', verbose_name=_('shared from'))
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='liked_posts', blank=True, verbose_name=_('likes'))
    tags = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name='tagged_posts', blank=True, verbose_name=_('tags'))
    views = models.PositiveIntegerField(_('views'), default=0)
    hashtags = models.ManyToManyField(Hashtag, related_name='posts', blank=True, verbose_name=_('hashtags'))

    def __str__(self):
        if self.anonymous:
            return f'Anonymous - {self.content[:20]}'
        return f'{self.user.username} - {self.content[:20]}'
    
REACTION_CHOICES = (
    ('like', _('Like')),  
    ('love', _('Love')),  
    ('haha', _('Haha')),  
    ('wow', _('Wow')),  
    ('sad', _('Sad')),  
    ('angry', _('Angry')),  
)

class Reaction(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='reactions', on_delete=models.CASCADE)
    reaction_type = models.CharField(_('reaction type'), max_length=10, choices=REACTION_CHOICES)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post', 'reaction_type')
        verbose_name = _('reaction')  
        verbose_name_plural = _('reactions') 

    def __str__(self):
        return f'{self.user.username} reacted {self.reaction_type} to {self.post.id}'


class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField(_('content'))
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    def __str__(self):
        return f'{self.user.username} - {self.content[:20]}'
    


# add notification model later 


class Bookmark(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='bookmarks')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='bookmarked_by')
    bookmarked_at = models.DateTimeField(_('bookmarked at'), auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')
        verbose_name = _('bookmark') 
        verbose_name_plural = _('bookmarks')

    def __str__(self):
        return f'{self.user.username} bookmarked {self.post.id}'