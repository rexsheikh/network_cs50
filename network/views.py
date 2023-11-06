from django.contrib.auth import authenticate, login, logout
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
    # # a new post was submitted from index
    # if request.method == "POST":
    #     postForm = PostForm(request.POST)
    #     if postForm.is_valid():
    #         poster = User.objects.get(id=request.user.id)
    #         content = postForm.cleaned_data["content"]
    #         newPost = Post(poster=poster, content=content)
    #         newPost.save()
    # elif request.method == "PUT":
    #     pass

    if request.method == "GET":
        posts = Post.objects.order_by("-timestamp").all()
        return JsonResponse([post.serialize() for post in posts], safe=False)

    # if request.user.is_authenticated:
    #     allPosts = Post.objects.all()
    #     return render(request, "network/index.html", {
    #         "allPosts": allPosts,
    #         "PostForm": PostForm()
    #     })
    # else:
    #     return HttpResponseRedirect(reverse("login"))


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
