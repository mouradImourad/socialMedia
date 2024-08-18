from django.db import models
from django.conf import settings
from django.utils.translation import gettext as _ 



class FriendRequest(models.Model):
    from_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_requests', on_delete=models.CASCADE, verbose_name=_('from user'))
    to_user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_requests', on_delete=models.CASCADE, verbose_name=_('to user'))
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    status = models.CharField(_('status'), max_length=20, choices=[ 
        ('pending', _('Pending')),  
        ('accepted', _('Accepted')),  
        ('rejected', _('Rejected')),  
    ], default='pending')

    def __str__(self):
        return f"{self.from_user} -> {self.to_user} ({self.status})"
    
    class Meta:
        verbose_name = _('friend request')  
        verbose_name_plural = _('friend requests')
    

class Friendship(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friends', on_delete=models.CASCADE, verbose_name=_('user'))
    friend = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='friends_with', on_delete=models.CASCADE, verbose_name=_('friend'))
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} is friends with {self.friend.username}"
    

    class Meta:
        verbose_name = _('friendship')  
        verbose_name_plural = _('friendships')