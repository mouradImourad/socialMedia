# messages/models.py
from django.db import models
from django.conf import settings
from django.utils.translation import gettext as _



class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='sent_messages', on_delete=models.CASCADE, verbose_name=_('sender'))
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='received_messages', on_delete=models.CASCADE, verbose_name=_('recipient'))
    content = models.TextField(_('content'))
    timestamp = models.DateTimeField(_('timestamp'), auto_now_add=True)
    is_read = models.BooleanField(_('is read'), default=False)

    class Meta:
        verbose_name = _('message')  
        verbose_name_plural = _('messages')



    def __str__(self):
        return f"Message from {self.sender} to {self.recipient} at {self.timestamp}"



