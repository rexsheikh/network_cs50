document.addEventListener('DOMContentLoaded',function(){
    console.log('DOM loading....');
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
        <div class="border border-primary p-3">
            <div class = "container-fluid post-view">
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

    editBtn.addEventListener('click',function(e){
        e.preventDefault();
        const postView = postDiv.querySelector('.post-view');
        showEdit(postView,editView,postId);

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
    console.log(`saving postId: ${postId} content: ${newContent}`);
    fetch('/posts',{
        method:'PUT',
        body:JSON.stringify({
            'postId':postId,
            'content':newContent
        })
    })
}
