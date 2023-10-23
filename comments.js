// Create web server
var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
var Comment = require("../models/Comment.js");
var Post = require("../models/Post.js");

// GET /comments
// Retrieve all comments
router.get("/", function (req, res, next) {
  Comment.find(function (err, comments) {
    if (err) return next(err);
    res.json(comments);
  });
});

// POST /comments
// Create new comment
router.post("/", function (req, res, next) {
  Comment.create(req.body, function (err, comment) {
    if (err) return next(err);
    Post.findByIdAndUpdate(
      comment.post,
      { $push: { comments: comment._id } },
      function (err, post) {
        if (err) return next(err);
        res.json(comment);
      },
    );
  });
});

// GET /comments/:id
// Retrieve a comment by id
router.get("/:id", function (req, res, next) {
  Comment.findById(req.params.id, function (err, comment) {
    if (err) return next(err);
    res.json(comment);
  });
});

// PUT /comments/:id
// Update a comment by id
router.put("/:id", function (req, res, next) {
  Comment.findByIdAndUpdate(req.params.id, req.body, function (err, comment) {
    if (err) return next(err);
    res.json(comment);
  });
});

// DELETE /comments/:id
// Delete a comment by id
router.delete("/:id", function (req, res, next) {
  Comment.findByIdAndRemove(req.params.id, req.body, function (err, comment) {
    if (err) return next(err);
    Post.findByIdAndUpdate(
      comment.post,
      { $pull: { comments: comment._id } },
      function (err, post) {
        if (err) return next(err);
        res.json(comment);
      },
    );
  });
});

module.exports = router;
