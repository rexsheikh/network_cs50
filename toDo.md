next...
1. fix new post form 
2. add event listeners for the buttons 


// function buildPosts(posts){
//     const postView = document.getElementById('posts-view');
//     posts.forEach(post =>{
//         const postDiv = document.createElement('div')
//         postDiv.innerHTML = `
//         <div class="border border-primary p-3">
//             <h4>${post.posterName}</h4>
//             <p class='content'>${post.content}</p>
//             <div class="container-fluid edit-post">
//                 <textarea class="edit-post-field"></textarea>
//                 <div>
//                     <button class="btn btn-success btn-sm save-edit">Save Changes</button>
//                     <button class="btn btn-danger btn-sm discard-edit">Discard Changes</button>
//                 </div>
//             </div>
//             <button class="btn btn-info btn-sm edit-post-btn">Edit Post</button>
//             <p>${post.timestamp}</p>
//         </div>
//     `;
//     postView.append(postDiv);
//     })
// }



// function getAllPosts(){

//     fetch(`/posts`)
//     .then(response => response.json())
//     .then(posts => {
//         console.log(posts);
//         // get all the posts edit field and initially set display to none
//         const editPostDivs = document.querySelectorAll('.edit-post');
//         // for each div, hide initially
//         // add an event listener to its button that when clicked hides the edit button (using 'this')
//         // populates the field with the old text and...
//         editPostDivs.forEach(div => {
//             div.style.display = 'none';
//             div.parentElement.querySelector('.edit-post-btn').addEventListener('click',function(){
//                 // get content, hide, hide button
//                 const textContentEl = this.parentElement.querySelector('.content');
//                 const textContent = textContentEl.textContent;
//                 textContentEl.style.display = 'none';
//                 this.style.display = 'none';
    
//                 // get edit field, populate with post text, and show
//                 const editField = this.parentElement.querySelector(".edit-post-field");
//                 editField.textContent=textContent;
//                 div.style.display = 'block';
    
//                 //get save/discard changes, add event listeners
//                 this.parentElement.querySelector(".save-edit").addEventListener('click',function(){
//                     //put function here 
//                 })
    
//                 this.parentElement.querySelector(".discard-edit").addEventListener('click',function(){
//                     //restore old text here
//                 })
//             })
//         })
//     })
// }