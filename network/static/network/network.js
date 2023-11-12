document.addEventListener('DOMContentLoaded',function(){
    console.log('DOM loading....');
    document.getElementById("compose-post-btn").addEventListener('click',function(){
        const content = document.getElementById("post-content").value;
        submitPost(content);
    })

    document.getElementById("nav-allposts").addEventListener('click',function(){
        getPosts('allPosts')
    })

    document.getElementById("nav-profile-page").addEventListener('click',function(){
        // get posts for a user's profile page
        const userId = this.getAttribute('data-userid');
        getProfilePage(userId);   
    })

    document.getElementById('nav-following').addEventListener('click',function(){
        console.log('following');
        getPosts('following');
    })
    //get allPosts by default and show the new post btn
    getPosts('allPosts');
    
})


function getPosts(postList){
    fetch(`posts/${postList}`)
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        buildPosts(data,postList);
        hideEdit();
        if(postList === "allPosts"){
            showNewPostBtn();
        }else{
            hideNewPostBtn();
        }
    })
}

function submitPost(content){
    fetch('/posts/allPosts', {
        method: 'POST',
        body: JSON.stringify({
            content: content
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
          getPosts('allPosts');
      });
    };

function getProfilePage(profileId){
    fetch(`posts/profile/${parseInt(profileId)}`)
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        buildPosts(data,"profilePage");
        hideEdit();
        hideNewPostBtn();
    })
}

function follow(profileId){
    const action = "follow"
    fetch(`posts/profile/${parseInt(profileId)}`, {
        method: 'POST',
        body: JSON.stringify({
            action:action,
            profileId:profileId
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        getPosts("allPosts");
      })
}
function unfollow(profileId){
    const action = "unfollow"
    fetch(`posts/profile/${parseInt(profileId)}`, {
        method: 'POST',
        body: JSON.stringify({
            action:action,
            profileId:profileId
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        getPosts("allPosts");
      })
}

function buildHeader(data,postList){
    const headerDiv = document.createElement('div');
    if(postList === "allPosts"){
        headerDiv.innerHTML = `
        <h2>All Posts</h2>`
    }else if(postList === "profilePage"){
        console.log(`my page boolean: ${data.myPage}`);
        if(data.myPage === true){
            headerDiv.innerHTML = `
            <h2>My Posts</h2>`
        }else{
            posterName = data.posts[0].posterName
            profileId = data.posts[0].posterId
            if(data.following === true){
                headerDiv.innerHTML = `
                <h2>${posterName}'s Posts</h2>
                <div>
                    <button class="btn btn-danger btn-sm unfollow">Unfollow</button>
                </div>
                `
                headerDiv.querySelector(".unfollow").addEventListener('click',function(){
                    unfollow(profileId);
                });

            }else if(data.following === false){
                headerDiv.innerHTML = `
                <h2>${posterName}'s Posts</h2>
                <div>
                    <button class="btn btn-success btn-sm follow">Follow</button>
                </div>
                `
                headerDiv.querySelector(".follow").addEventListener('click',function(){
                    follow(profileId);
                });
            }
        }
    }

    return headerDiv;
}

function buildPostWithEdit(post){
    const postDiv = document.createElement('div');
    postDiv.classList.add('p-3');
    postDiv.innerHTML = `
    <div class="border border-primary p-3">
        <div class = "container-fluid post-view">
            <h4 class = "poster-profile">${post.posterName}</h4>
            <p class='content'>${post.content}</p>
            <button class="btn btn-info btn-sm edit-post-btn">Edit Post</button>
        </div>
        <div class="container-fluid edit-view">
            <textarea class="edit-post-field"></textarea>
            <div>
                <button class="btn btn-success btn-sm save-edit">Save Changes</button>
                <button class="btn btn-danger btn-sm discard-edit">Discard Changes</button>
            </div>
        </div>
        <p>${post.timestamp}</p>
    </div>
`;

const editBtn = postDiv.querySelector('.edit-post-btn');
const editView = postDiv.querySelector('.edit-view');
const postId = post.id;

editBtn.addEventListener('click',function(e){
    e.preventDefault();
    const postView = postDiv.querySelector('.post-view');
    showEdit(postView,editView,postId);

});
return postDiv;
}

function buildPostNoEdit(post){
    const postDiv = document.createElement('div');
    postDiv.classList.add('p-3');
    postDiv.innerHTML = `
    <div class="border border-primary p-3">
    <div class = "container-fluid post-view">
        <h4 class = "poster-profile">${post.posterName}</h4>
        <p class='content'>${post.content}</p>
        <p>${post.timestamp}</p>
    </div>
</div>
    `;
    return postDiv;

}
function buildLikeBtn(){
    const likeBtn = document.createElement('button');
    likeBtn.classList.add('btn','btn-success','btn-sm','like');
    likeBtn.textContent = 'Like';
    return likeBtn;
}

function buildUnlikeBtn(){
    const unlikeBtn = document.createElement('button');
    unlikeBtn.classList.add('btn','btn-danger','btn-sm','unlike');
    unlikeBtn.textContent = 'Unlike';
    return unlikeBtn;
}

function alreadyLiked(userId,post){
    const likes = post['likes']
    var likedBool = false;
    likes.forEach(like =>{
        if(like['likerId'] === userId){
            likedBool = true;
        }
    })
    return likedBool;
}
function postLike(postId){
    const action = "like"
    fetch(`posts/likes/${parseInt(postId)}`, {
        method: 'POST',
        body: JSON.stringify({
            action:action,
            postId:postId
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        getPosts("allPosts");
      })
}
function postUnlike(postId){
    const action = "unlike"
    fetch(`posts/likes/${parseInt(postId)}`, {
        method: 'POST',
        body: JSON.stringify({
            action:action,
            postId:postId
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        getPosts("allPosts");
      })
}



function buildPosts(data,postList){
    // get the all-posts-divs, clear any existing html, and build header according to the postList
    const postView = document.getElementById('all-posts-view');
    postView.innerHTML = ''
    const header = buildHeader(data,postList);
    postView.append(header);

    // get all the posts. show edit button if the post belongs to the requestor
    // add event listeners for visiting another user's page 
    posts = data.posts
    posts.forEach(post =>{
        console.log(post['likes']);
        var postDiv = document.createElement('div')
        if (data.requestorId === post.posterId){
            postDiv = buildPostWithEdit(post);
        }else{
            postDiv = buildPostNoEdit(post);
        }
        if(alreadyLiked(data.requestorId,post) === true){
            const unlikeBtn = buildUnlikeBtn();
            postDiv.appendChild(unlikeBtn);
            postDiv.querySelector('.unlike').addEventListener('click',function(){
                postUnlike(post.id);
            });
        }else{
            const likeBtn = buildLikeBtn();
            postDiv.appendChild(likeBtn);
            postDiv.querySelector('.like').addEventListener('click',function(){
                postLike(post.id);
             });
        }
    // get likes count for all post divs
    const likesCount = post['likesCount'];
    const likesCountDiv = document.createElement('p');
    likesCountDiv.innerText = `Likes: ${likesCount}`;
    postDiv.appendChild(likesCountDiv);

    // set up links to other user's profiles
    const posterProfile = postDiv.querySelector('.poster-profile');
    posterProfile.addEventListener('click',function(){
        getProfilePage(post.posterId);
    })

    postView.append(postDiv);
    })
}

function hideEdit(){
    const editDivs = document.querySelectorAll('.edit-view');
    editDivs.forEach(div =>{
        div.style.display = 'none';
    })
}

function showContent(postView,content){
    postView.querySelector('.content').textContent = content;
    postView.style.display = 'block';
}

function showEdit(postView,editView,postId){
    const textContent = postView.querySelector('.content').textContent;
    postView.style.display = 'none';

    const textEdit = editView.querySelector('.edit-post-field');
    textEdit.value = textContent;
    editView.style.display = 'block';
    editView.querySelector('.save-edit').addEventListener('click',function(e){
        e.preventDefault();
        const newTextContent = editView.querySelector('.edit-post-field').value;
        console.log(`new text content: ${newTextContent}`);
        saveEdit(postId,newTextContent);
        hideEdit();
        showContent(postView,newTextContent);
    })
    editView.querySelector('.discard-edit').addEventListener('click',function(e){
        e.preventDefault();
        hideEdit();
        showContent(postView,textContent);
    })
   
}

function saveEdit(postId,newContent){
    fetch('/posts/allPosts',{
        method:'PUT',
        body:JSON.stringify({
            'postId':postId,
            'content':newContent
        }),
    })
}

function hideNewPostBtn(){
    document.querySelector('.compose-post-view').style.display= 'none';
}

function showNewPostBtn(){
    document.querySelector('.compose-post-view').style.display='block';
}