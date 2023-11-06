from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    pass


class Post(models.Model):
    id = models.IntegerField(primary_key=True)
    poster = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField(null=False)
    timestamp = models.DateTimeField(auto_now_add=True)

    def serialize(self):
        return {
            "id": self.id,
            "poster": self.poster,
            "content": self.content,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p")
        }


class Like(models.Model):
    id = models.IntegerField(primary_key=True)
    poster = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="poster")
    liker = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="liker")


class Follow(models.Model):
    id = models.IntegerField(primary_key=True)
    followee = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="followee")
    follower = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="follower")
