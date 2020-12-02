const Router = require("express").Router();

const postController = require("../controllers/postController");

Router.get("/post/create", postController.createPost_get);

Router.post("/post/create", postController.createPost_post);

Router.get("/post/:id", postController.viewPost_get);

Router.get("/post/:id/edit", postController.editPost_get);

Router.post("/post/:id/edit", postController.editPost_post);
//
Router.post("/post/:id/delete", postController.deletePost);

module.exports = Router;
