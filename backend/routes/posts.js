const express = require("express");

const router = express.Router();

// Models
const Post = require('../models/post');

router.post("", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  }); // Mongoose model allows us to do this
  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    }); // Send a res so we ensure this doesn't time out. 201 - new resource was created
  }); // Save post to DB
  // No next() here because we are sending a res
});

// app.put completely overrides the old content
// app.patch would update old content
// Remember: we can't override the old id
router.put("/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({_id: req.params.id}, post).then(result => {
    res.status(200).json({ message: "Update successful" });
  });
});

// Middleware - '/api' is optional
// Call next if you're not sending a response (res.send)
router.get("", (req, res, next) => {
  Post.find()
    .then(documents => { // documents is all of the posts
      // 200 for sucess. Don't need a return statement because it's the last statement here
      res.status(200).json({
        message: 'Posts fetched successfully!',
        posts: documents
      });
      // We don't want code here since it can execute at the same time as the code inside .then()
    });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    // if post exists...
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({message: "Post not found"});
    }
  });
});

// Delete
router.delete("/:id", (req, res, next) => {
  // Deletes for front end and back end
  Post.deleteOne({_id: req.params.id}).then(result => {
    console.log(result);
    res.status(200).json({ message: "Post deleted!" });
  });
});

module.exports = router;
