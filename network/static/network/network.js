document.addEventListener('DOMContentLoaded',function(){
    console.log('DOM loading....');
    document.getElementById("compose-post-btn").addEventListener('click',function(){
        const content = document.getElementById("post-content").value;
        submitPost(content);
    })

    document.getElementById("nav-allposts").addEventListener('click',function(){
        getPosts('allPosts');    
    })

    document.getElementById("nav-profile-page").addEventListener('click',function(){
        // get posts for a user's profile page
        getPosts('profilePage');
    })

    //get allPosts by default
    getPosts('allPosts');
})

function hideAllPostsView(){
    document.getElementById("all-posts-view").style.display = 'none'
}

function getPosts(postList){
    fetch(`posts/${postList}`)
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        buildPosts(data,postList);
        hideEdit();
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
    console.log(profileId);
    fetch(`posts/profile/${parseInt(profileId)}`)
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        buildPosts(data,"profilePage");
        hideEdit();
    })
}

function follow(profileId){
    fetch(`posts/profile/${parseInt(profileId)}`, {
        method: 'POST',
        body: JSON.stringify({
            profileId:profileId
        })
      })
      .then(response => response.json())
      .then(result => {
        console.log(result);
        getPosts("allPosts");
      })

}

function buildPosts(data,postList){
    // get the all-posts-divs, clear any existing html, and build according to 
    // given postList
    const postView = document.getElementById('all-posts-view');
    postView.innerHTML = ''
    const headerDiv = document.createElement('div');
    if(postList === "allPosts"){
        headerDiv.innerHTML = `
        <h2>All Posts</h2>`
    }else if(postList === "profilePage"){
        if(data.myPage === true){
            headerDiv.innerHTML = `
            <h2>My Posts</h2>`
        }else{
            posterName = data.posts[0].posterName
            profileId = data.posts[0].posterId
            headerDiv.innerHTML = `
            <h2>${posterName}'s Posts</h2>
            <div>
                <button class="btn btn-success btn-sm follow">Follow</button>
                <button class="btn btn-danger btn-sm unfollow">Unfollow</button>
            </div>
            `
            headerDiv.querySelector(".follow").addEventListener('click',function(){
                follow(profileId);
            });
            headerDiv.querySelector(".unfollow").addEventListener('click',function(){
                //post an unfollow
            });
        }
    }
    postView.append(headerDiv);
    posts = data.posts
    posts.forEach(post =>{
        const postDiv = document.createElement('div')
        if (data.requestorId === post.posterId){
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

        }else{
            postDiv.innerHTML = `
            <div class="border border-primary p-3">
            <div class = "container-fluid post-view">
                <h4 class = "poster-profile">${post.posterName}</h4>
                <p class='content'>${post.content}</p>
                <p>${post.timestamp}</p>
            </div>
        </div>
            `;
        }

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

// I referenced https://stackoverflow.com/questions/43606056/proper-django-csrf-validation-using-fetch-post-request
// to see how to add a csrf token to the put request
function saveEdit(postId,newContent){
    fetch('/posts/allPosts',{
        method:'PUT',
        body:JSON.stringify({
            'postId':postId,
            'content':newContent
        }),
    })
}
