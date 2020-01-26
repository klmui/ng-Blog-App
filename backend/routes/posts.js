const express = require("express");
const multer = require("multer");

const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images"); // error is null, second is path relative to server js
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-'); // any whitespace will be a dash
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext); // no error, add filename
  }
});

// Models
const Post = require('../models/post');

// Multer will try to find a single image in the req body
router.post("", multer({storage: storage}).single("image"), (req, res, next) => {
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
