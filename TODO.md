Now:
- [x] Modify sub schema to include image
- [x] store image in db
- [x] Send image to backend
- [x] Display image in sub card, else show random

Misc

- [x] change to single access token
- [ ] Dont allow spaces and special characters in sub title and username?
- [ ] fix typerror cant convert undefined to
- [ ] standardise image height
- [ ] input validation with regex on frontend and backend
- [x] fix buttons for users, join reqs, stats and reports
- [ ] fix home button staying active when seeing mod pages
- [ ] shift to [responsive card](rsbvbzryjrtovrqqfy@tcwlm.com)

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
- [ ] restrict [x]users, [x]join reqs, stats, reports to mod
- [ ] censor when returning post

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

- [x] Create subgreddiit
- [x] Display My subgreddiits
- [x] Search
- [ ] filter
- [ ] sort
      add buttons: - [x] delete subgreddiit: BsTrash - [x] go to subgreddiit: BsArrowUpRightSquare - [x] create subgreddiit: CgFolderAdd - [x] search: BiSearch - [x] Subgreddit card: https://daisyui.com/components/card/#card-with-image-overlay - [x] Limit description to first 30 characters

      - [x] why doesnt modal stay open after creating
      - [ ] loading for delete
      - [x] create subg

Random photo : https://source.unsplash.com/random

## All Subgreddiits:

- [ ] make proper dialog box for join request not sent
- [ ] why isnt loading for join req/ leave working

tags:

```html
<div className="badge badge-accent badge-outline">accent</div>
```

## Subgreddiit page navbar:

- [x] Users: FiUsers
- [x] Join Requests: AiOutlineUsergroupAdd
- [x] Stats: ImStatsDots
- [x] Reports: GoReport

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


## Regex

Tags: lower case, single word, comma separated, no spaces, letters and numbers only

```js
const pattern = /^[a-z0-9]+(,[a-z0-9]+)*$/;
```
