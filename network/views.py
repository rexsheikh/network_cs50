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

# helper function to append likes to corresponding posts


def likesToPosts(likes, posts):
    # get likes and posts, and map post_id to likes
    likesDict = {}
    for like in likes:
        postId = like["post_id"]
        if postId not in likesDict:
            likesDict[postId] = []
            likesDict[postId].append({
                'id': like['id'],
                'posterId': like['poster_id'],
                'likerId': like['liker_id'],
            })
    # loop through posts. Try to get the array of like objects from
    # the likes dict. Otherwise, append an empy array.
    for post in posts:
        post['likes'] = likesDict.get(post['id'], [])

    return posts


@login_required
@csrf_exempt
def posts(request, postList):
    if postList == "allPosts":
        if request.method == "GET":
            posts = [post.serialize()
                     for post in Post.objects.order_by("-timestamp").all()]
            likes = [like.serialize() for like in Like.objects.all()]
            postsWithLikes = likesToPosts(likes, posts)
            requestorId = request.user.id
            data = {"requestorId": requestorId,
                    "posts": postsWithLikes
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


@csrf_exempt
def profilePosts(request, profileId):
    profileId = int(profileId)
    if request.method == "GET":
        if request.user.id == profileId:
            myPage = True
            following = False
        else:
            # I referenced https://stackoverflow.com/questions/3090302/how-do-i-get-the-object-if-it-exists-or-none-if-it-does-not-exist-in-django
            # to see how to use the first method to return None to follow status instead of writing a try/except
            myPage = False
            followee = User.objects.get(id=profileId)
            follower = User.objects.get(id=request.user.id)
            followStatus = Follow.objects.filter(
                followee=followee, follower=follower).first()
            if followStatus != None:
                following = True
            else:
                following = False

        posts = Post.objects.filter(poster=profileId)
        data = {
            "myPage": myPage,
            "following": following,
            "requestorId": request.user.id,
            "posts": [post.serialize() for post in posts]
        }
        return JsonResponse(data, safe=False)
    elif request.method == "POST":
        data = json.loads(request.body)
        action = data.get("action")
        followee = User.objects.get(id=profileId)
        follower = User.objects.get(id=request.user.id)
        if action == "follow":
            newFollow = Follow(followee=followee, follower=follower)
            newFollow.save()
            return JsonResponse({"message": "Follow captured successfully."}, status=201)
        elif action == "unfollow":
            follow = Follow.objects.get(followee=followee, follower=follower)
            follow.delete()
            return JsonResponse({"message": "Unfollow captured successfully."}, status=201)


@csrf_exempt
def likes(request, postId):
    if request.method == "POST":
        data = json.loads(request.body)
        action = data.get("action")
        post = Post.objects.get(id=postId)
        poster = User.objects.get(id=post.poster.id)
        liker = User.objects.get(id=request.user.id)
        if action == "like":
            # maybe check if already liked here?
            newLike = Like(post=post, poster=poster, liker=liker)
            newLike.save()
            return JsonResponse({"message": "Like captured successfully."}, status=201)
        elif action == "unlike":
            like = Like.objects.filter(
                post=postId, poster=poster, liker=liker).first()
            if like != None:
                like.delete()
            return JsonResponse({"message": "Unlike captured successfully."}, status=201)
        else:
            return JsonResponse({"message": "No Like Exists."}, status=201)


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
