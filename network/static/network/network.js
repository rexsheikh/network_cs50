document.addEventListener('DOMContentLoaded',function(){
    getPosts();
})


function getPosts(){
    fetch('/posts')
    .then(response => response.json())
    .then(data =>{
        console.log(data);
        buildPosts(data);
        hideEdit();
    })
}

function buildPosts(data){
    const postView = document.getElementById('posts-view');
    posts = data.posts
    posts.forEach(post =>{
        const postDiv = document.createElement('div')
        postDiv.innerHTML = `
        <div class="border border-primary p-3 post-view">
            <div class = "container-fluid show-view">
                <h4>${post.posterName}</h4>
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

    editBtn.addEventListener('click',function(){
        const showView = postDiv.querySelector('.show-view');
        showEdit(showView,editView,postId);

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

function showContent(){
    const postDivs = document.querySelectorAll('.post-view');
    postDivs.forEach(div => {
        div.style.display = 'block';
    })
}

function showEdit(showView,editView,postId){
    const textContent = showView.querySelector('.content').textContent;
    showView.style.display = 'none';

    const textEdit = editView.querySelector('.edit-post-field');
    textEdit.value = textContent;

    editView.style.display = 'block';
    editView.querySelector('.save-edit').addEventListener('click',function(){
        // console.log(`postId: ${postId}  content: ${textContent}`);
        saveEdit(postId,textContent);
        hideEdit();
    })
    editView.querySelector('.discard-edit').addEventListener('click',function(){
        hideEdit();
        showContent();
    })
   
}

function saveEdit(postId,content){
    // console.log('saving');
    fetch('/posts'),{
        method:'PUT',
        body:JSON.stringify({
            'postId':postId,
            'content':content
        })
    }
}
