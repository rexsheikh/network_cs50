next...

1. create a div with the posts-view then ... 
function displayPosts(posts) {
    const postList = document.getElementById('post-list');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.innerHTML = `
            <div class="border border-primary p-3">
                <h4>${post.poster}</h4>
                <p class='content'>${post.content}</p>
                <div class="container-fluid edit-post">
                    <textarea class="edit-post-field"></textarea>
                    <div>
                        <button class="btn btn-success btn-sm save-edit">Save Changes</button>
                        <button class="btn btn-danger btn-sm discard-edit">Discard Changes</button>
                    </div>
                </div>
                <button class="btn btn-info btn-sm edit-post-btn">Edit Post</button>
                <p>${post.timestamp}</p>
            </div>
        `;
        postList.appendChild(postElement);
    });
}

function getAllPosts(){
    fetch(`/`)
    .then(response => response.json())
    .then(posts => {
        displayPosts(posts);
    })
}

document.addEventListener('DOMContentLoaded', function(){
    getAllPosts();
});




etc. 
old index: 
<h1>All Posts</h1>
<div class="container-fluid border border-primary p-3">
    <h2>New Post</h2>
    <form method="post">
        {% csrf_token %}
        {{PostForm}}
        <input type="submit" class="btn btn-info" value="Post">
    </form>
</div>
{% for a in allPosts %}
<div class="border border-primary p-3">
    <h4>{{a.poster}}</h4>
    <p class='content'>{{a.content}}</p>
    <div class="container-fluid edit-post">
        <textarea class="edit-post-field"></textarea>
        <div>
            <button class="btn btn-success btn-sm save-edit">Save Changes</button>
            <button class="btn btn-danger btn-sm discard-edit">Discard Changes</button>
        </div>
    </div>
    <button class="btn btn-info btn-sm edit-post-btn">Edit Post</button>
    <p>{{a.timestamp}}</p>
</div>
{% endfor %}