Misc
- [ ] Do i need to change the route for unsave to only use postid?

Backend
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
- [ ] reports
- [ ] what to do for blocked users?
- [ ] Delete posts and reports when deleting subgreddiit
- [ ] delete left_subgreddiit entry for users when deleting subgreddiit
- [ ] remove saved posts from deleted subgreddiits
- [ ] List of all subgreddiits (paginated?)
- [ ] List of all posts for subgreddiit (paginated?)
- [ ] List of all comments for a post (paginated?)
- [ ] Infinite scrolling


Frontend
- [ ] Disable editing username in frontend
- [ ] Verify password before editing profile

Bonus
Chat:
    socket.io: This is a popular real-time communication library for web applications. It provides a simple API for sending and receiving messages between the client and server in real-time.

    pusher: This is a cloud-based service for building real-time applications, including chat functionality. It provides an easy-to-use API and a variety of tools for integrating with React and other technologies.

    feathers.js: This is a real-time framework for building web applications, including chat functionality. It provides a simple and consistent API for real-time communication and integrates with MongoDB and other databases.

    Meteor: This is a full-stack JavaScript platform for building real-time web applications, including chat functionality. It provides a simple API for real-time communication and makes it easy to integrate with React.

Keyboard shortcuts:react-keyboard-event-handler