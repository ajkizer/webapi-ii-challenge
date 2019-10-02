const express = require("express");

const db = require("./db.js");

const router = express.Router();

//GET requests*********
router.get("/", async (req, res) => {
  try {
    const posts = await db.find();
    res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error finding posts"
    });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.findById(id);
    post.length > 0 //does the post exist? true yields 200, false yields 404
      ? res.status(200).json(post)
      : res.status(404).json({ message: "Post not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving data"
    });
  }
});

router.get("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await db.findCommentById(id);
    comment.length > 0
      ? res.status(200).json(comment)
      : res.status(404).json({ message: "Comment not found" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error retrieving data"
    });
  }
});

//POST requests*********
router.post("/", async (req, res) => {
  try {
    if (req.body.title && req.body.contents) {
      const post = await db.insert(req.body);
      res.status(201).json(post);
    } else {
      res.status(400).json({
        errorMessage: "Please provide title and contents for the post"
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error adding post"
    });
  }
});

router.post("/:id/comments", async (req, res) => {
  try {
    const { id } = req.params;
    const comment = req.body;
    const post = await db.findById(id);

    post.length < 1 //is the post nonexistant/has no content? true yields error 404, false goes to next check
      ? res.status(404).json({ message: "Post not found" })
      : !req.body.text //is the request lacking text? true yields error 400, false yields status 201
      ? res
          .status(400)
          .json({ errorMessage: "Please provide text for the comment" })
      : res.status(201).json(comment);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error adding comment"
    });
  }
});

//DELETE requests**********
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const removePost = await db.remove(id);
    removePost //does the post id exist?
      ? res.status(200).json({ message: "post deleted" })
      : res.status(404).json({ message: "Could not find post" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error deleting post"
    });
  }
});

//PUT requests*********
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const changes = req.body;
    let editPost;
    !changes.title || !changes.contents //is request lacking a title or content? false: 400, true: start update
      ? res.status(400).json({ message: "please enter a title and contents" })
      : (editPost = await db.update(id, changes));
    if (!editPost) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).json(changes);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Error editing post"
    });
  }
});
module.exports = router;
