document.addEventListener('DOMContentLoaded',function(){
    getAllPosts();
})


function getAllPosts(){
    // get all the posts edit field and initially set display to none
    const editPostDivs = document.querySelectorAll('.edit-post');
    // for each div, hide initially
    // add an event listener to its button that when clicked hides the edit button (using 'this')
    // populates the field with the old text and...
    editPostDivs.forEach(div => {
        div.style.display = 'none';
        div.parentElement.querySelector('.edit-post-btn').addEventListener('click',function(){
            // get content, hide, hide button
            const textContentEl = this.parentElement.querySelector('.content');
            const textContent = textContentEl.textContent;
            textContentEl.style.display = 'none';
            this.style.display = 'none';

            // get edit field, populate with post text, and show
            const editField = this.parentElement.querySelector(".edit-post-field");
            editField.textContent=textContent;
            div.style.display = 'block';

            //get save/discard changes, add event listeners
            this.parentElement.querySelector(".save-edit").addEventListener('click',function(){
                //put function here 
            })

            this.parentElement.querySelector(".discard-edit").addEventListener('click',function(){
                //restore old text here
            })
        })
    })
}
