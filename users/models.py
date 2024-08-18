# users/models.py
import uuid
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from django.db import models
from django.utils.translation import gettext as _



class UserManager(BaseUserManager):
    def create_user(self, email, username, password=None, profile_picture=None):
        if not email:
            raise ValueError(_('Users must have an email address'))
        user = self.model(email=self.normalize_email(email), username=username)
        user.set_password(password)
        if profile_picture:
            user.profile_picture = profile_picture
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username, password=None):
        user = self.create_user(email, username, password)
        user.is_admin = True
        user.is_staff = True
        user.is_superuser = True
        user.save(using=self._db)
        return user

class User(AbstractBaseUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    username = models.CharField(_('username'), max_length=30, unique=True)
    is_verified = models.BooleanField(_('verified'), default=False)
    is_active = models.BooleanField(_('active'), default=True)  
    profile_picture = models.ImageField(_('profile picture'), upload_to='profile_pictures/', null=True, blank=True)
    created_at = models.DateTimeField(_('created at'), auto_now_add=True)
    updated_at = models.DateTimeField(_('updated at'), auto_now=True)
    is_staff = models.BooleanField(_('staff status'), default=False)
    is_superuser = models.BooleanField(_('superuser status'), default=False) 


    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email


    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True
    



class ProfileVisit(models.Model):
    visitor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visits_made')
    profile_owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='visits_received')
    visited_at = models.DateTimeField(_('visited at'), auto_now_add=True)

    def __str__(self):
        return f'{self.visitor.username} visited {self.profile_owner.username} on {self.visited_at}'
