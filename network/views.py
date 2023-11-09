import json
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt

from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect
from django.http import JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django import forms
from .models import User, Post, Follow, Like


class PostForm(forms.Form):
    content = forms.CharField(widget=forms.Textarea(
        attrs={'class': 'form-control', 'rows': 3}), label=False)


def index(request):
    if request.user.is_authenticated:
        return render(request, "network/posts.html")
    else:
        return HttpResponseRedirect(reverse("login"))


@login_required
@csrf_exempt
def posts(request, postList):
    print("***posts view called***")
    if postList == "allPosts":
        if request.method == "GET":
            posts = Post.objects.order_by("-timestamp").all()
            requestorId = request.user.id
            data = {"requestorId": requestorId,
                    "posts": [post.serialize() for post in posts]
                    }
            return JsonResponse(data, safe=False)
        elif request.method == "PUT":
            data = json.loads(request.body)
            postId = data.get("postId")
            content = data.get("content")
            print(f'postId: {postId} content: {content}')
            post = Post.objects.get(id=postId)
            print(f'post object id: {post.id}')
            post.content = content
            post.save()
            return HttpResponse(status=204)
        elif request.method == "POST":
            data = json.loads(request.body)
            content = data.get("content")
            poster = User.objects.get(id=request.user.id)
            newPost = Post(poster=poster, content=content)
            newPost.save()
            return JsonResponse({"message": "Post captured successfully."}, status=201)
    # I think I can delete below if I have a separate view
    # postList is consumed in js to make the fetch
    elif postList == "profilePage":
        if request.method == "GET":
            posts = Post.objects.filter(poster=request.user.id)
            data = {
                "requestorId": request.user.id,
                "posts": [post.serialize() for post in posts]
            }
            return JsonResponse(data, safe=False)

    elif postList == "following":
        pass


def profilePosts(request, profileId):
    profileId = int(profileId)
    if request.method == "GET":
        if request.user.id == profileId:
            myPage = True
        else:
            myPage = False
        posts = Post.objects.filter(poster=profileId)
    data = {
        "myPage": myPage,
        "requestorId": request.user.id,
        "posts": [post.serialize() for post in posts]
    }
    return JsonResponse(data, safe=False)


def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
