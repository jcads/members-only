const User = require("../models/user");
const Post = require("../models/post");
const {body, validationResult, check} = require("express-validator");

exports.join_get = function(req, res, next) {
    res.render("join_form", {title: "Join"});
}

exports.join_post = [
    body("secretCode").escape(),
    body("secretCode").custom((value, {req}) => {
      if (req.body.secretCode === "test") return true;
      throw new Error("Wrong code");
    }),

    (req, res, next) => {
        const errs = validationResult(req);
        if (errs.isEmpty()) {
            User.findByIdAndUpdate(req.user._id, {membershipStat: "Member"}, (err, updatedUser) => {
                if (err) return next(err);
                res.redirect("/home");
            });
        } else {
            res.render("join_form", {title: "Join", errors: errs.array()});
        }
}]; 

exports.home_get = function(req, res, next) {
    Post.find({}).populate("author").exec((err, posts) => {
        if (err) return next(err);
        res.render("home", {title: "Clubhouse | Home", posts: posts});
    });
};
