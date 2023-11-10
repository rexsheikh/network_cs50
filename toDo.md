next...
1. change the posts view to accept a parameter that will load posts accordingly
    - add event listeners to the navbar links and load each set of views accordingly 
    - change the view to accept a parameter (string that is allPosts, profilePage,or following)
    - change the url
        - all posts (every single post)
        - profile page (all the user's posts)
        - following (all the posts from user's that the user is following)
    
2. build out profile pages 
    - anchor tags on user to take a user to either their page or another user's 
    - each page has follow or unfollow 
        - if it the user's profile page, these buttons do not appear
        - conditionally load 'follow' or 'unfollow' buttons 

3. likes and unlikes 
    - any user can like any post 
    - do this asynchronously


4. why is there a ? when submitting a new post?


-- conditionally show either follow or unfollow button when visiting another user's page
-- show whether following when looking at a different user's posts 
-- get count of following,followers and show on user's page
-- show mutual connections? (extra)

--buildPosts is doing alot right now...consider breaking out for different kinds
 --build edit buttons 
 --build follow/unfollow status 
 
--every post shows 
    - post content (user, content)
        - with link to profile page
    - like unlike buttons
    - like unlike count
    - whether following already

depending on requestor = poster
    - edit button 
    - follow status 


allPostsView 
    - header
        - header (allPosts)
        - newPost button 

profilePage view
    - header 
        -Always
            - follower, following count
        - if mine 
            - my posts
        - if somebody elses
            - (their name) posts
            - follow/unfollow buttons 