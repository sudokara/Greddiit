Misc

- [ ] Do i need to change the route for unsave to only use postid?
- [x] change to single access token

# Backend

- [x] Ensure follower/following exists in db
- [x] change addFollower function to do followUser
- [x] Update second person follower/following list
- [x] send join request - limit to one per user per subgreddiit
- [x] Leave subgreddiit
- [x] update join request so that they cant send if they left
- [x] Delete subgreddiit
- [x] make post
- [x] comment on post
- [x] save post
- [x] unsave
- [x] upvote and downvote on post - where to store upvotes and downvotes?
- [x] remove refresh token cookie
- [x] check unique username and email
- [x] check if user exists when verifying jwt
- [x] and not when creating
- [ ] censor when returning

- [ ] reports
- [ ] what to do for blocked users?
- [ ] Delete posts and reports when deleting subgreddiit
- [ ] delete left_subgreddiit entry for users when deleting subgreddiit
- [ ] remove saved posts from deleted subgreddiits
- [ ] List of all subgreddiits (paginated?)
- [ ] List of all posts for subgreddiit (paginated?)
- [ ] List of all comments for a post (paginated?)
- [ ] Infinite scrolling

# Frontend

## Profile Page
- [x] Login
- [x] register
- [x] Disable editing username in frontend
- [ ] Verify password before editing?

## My Subgreddiits page:

- [ ] Create subgreddiit
- [ ] My subgreddiits
- [ ] Search, filter, sort
      delete subgreddiit: BsTrash
      go to subgreddiit: BsArrowUpRightSquare
      create subgreddiit: CgFolderAdd
      search: BiSearch
      Subgreddit card: https://daisyui.com/components/card/#card-with-image-overlay
      Limit description to first n (50?) characters

Random photo : https://source.unsplash.com/random

tags:

```html
<div class="flex justify-between ">
  <div class="pill bg-gray-400 rounded-full text-xs px-4 py-1 mr-2">
    #Express
  </div>
  <div class="pill bg-gray-400 rounded-full text-xs px-4 py-1 mr-2">
    #TailwindCSS
  </div>
</div>
```
or
```html
<div className="badge badge-accent badge-outline">accent</div>
```

## Subgreddiit page navbar:
Users: FiUsers
Join Requests: AiOutlineUsergroupAdd
Stats: ImStatsDots
Reports: GoReport


## Subgreddit page:
BiUpvote
BiDownvote

- [ ] Public profile

# Bonus
## Chat:

```
    socket.io: This is a popular real-time communication library for web applications. It provides a simple API for sending and receiving messages between the client and server in real-time.

    pusher: This is a cloud-based service for building real-time applications, including chat functionality. It provides an easy-to-use API and a variety of tools for integrating with React and other technologies.

    feathers.js: This is a real-time framework for building web applications, including chat functionality. It provides a simple and consistent API for real-time communication and integrates with MongoDB and other databases.

    Meteor: This is a full-stack JavaScript platform for building real-time web applications, including chat functionality. It provides a simple API for real-time communication and makes it easy to integrate with React.
```

## Keyboard shortcuts:
react-keyboard-event-handler
