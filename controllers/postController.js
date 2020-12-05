const User = require("../models/user")
const {body, validationResult, check} = require("express-validator");

const Post = require("../models/post");

exports.createPost_get = function(req, res, next) {
    res.render("createPost_form", {title: "Create Post", values: null});
}

exports.createPost_post = [
    // validate & sanitize
    body("title", "Exceeded character limiit of 100").trim().isLength({max: 100}).escape(),
    body("postBody").trim().escape(),
    (req, res, next) => {
        const errs = validationResult(req);

        if (!errs.isEmpty()) {
            const values = {
                title: req.body.title,
                postBody: req.body.postBody
            };
            res.render("createPost_form", {title: "Create Post", values: values, errors: errs.array()});
        } else {
            const post = new Post({
                author: req.user._id,
                title: req.body.title,
                postBody: req.body.postBody,
            });

            User.findById(req.user._id, (err, user) => {
                if (err) return next(err);
                user.posts.push(post._id);
                user.save();
            });
            post.save(err => {
                if (err) return next(err);
                res.redirect(post.url);
            });
        }
    }
] 

exports.viewPost_get = function(req, res, next) {
    Post.findById(req.params.id).populate("author").exec((err, post) => {
        if (err) return next(err);
        res.render("post_view.pug", {title: post.title, post: post});
    });
};

exports.editPost_get = function(req, res, next) {
    Post.findById(req.params.id, (err, post) => {
        if (err) return next(err);
        res.render("createPost_form", {title: "Edit Post", values: post})
    });
};

exports.editPost_post = [
    // validate & sanitize
    body("title", "Exceeded character limiit of 100").trim().isLength({max: 100}).escape(),
    body("postBody").trim().escape(),
    (req, res, next) => {
        const errs = validationResult(req);

        if (!errs.isEmpty()) {
            const values = {
                title: req.body.title,
                postBody: req.body.postBody
            };
            res.render("createPost_form", {title: "Create Post", values: values, errors: errs.array()});
        } else {
            const newTitle = req.body.title;
            const newBody = req.body.postBody;
            Post.findByIdAndUpdate(req.params.id, {title: newTitle, postBody: newBody}, (err, updatedPost) => {
                if (err) return next(err);
                res.redirect("/clubhouse/post/"+req.params.id);
            })
        }
    }
]

exports.deletePost = function(req, res, next) {
    Post.deleteOne({ _id: req.params.id}, err => {
        if (err) return next(err);
    });
    res.redirect("/home");
}
