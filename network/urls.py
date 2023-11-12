
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),

    # API Routes
    path("posts/<str:postList>", views.posts, name="posts"),
    path('posts/profile/<int:profileId>',
         views.profilePosts, name="profilePosts"),
    path('posts/likes/<int:postId>', views.likes, name="likes"),

]
