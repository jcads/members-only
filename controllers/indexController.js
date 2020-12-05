const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {body, validationResult, check} = require("express-validator");
const passport = require("passport");

exports.login_get = function(req, res, next) {
    res.render("login", {title: "Log In"});
};

exports.signUp = [
    body("firstName").trim().escape(), 
    body("lastName").trim().escape(), 
    body("username").trim().escape(), 
    check("confirmPassword", "Passwords not the same").custom((value, {req}) => value === req.body.password),

    (req, res, next) => {
        console.log(req.body);
        const errs = validationResult(req);
        if (!errs.isEmpty()) {
            console.log(errs)
           res.render("signup", {errors: errs.array()});
        } else {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                if (err) return next(err);
                else {
                    const user = new User({
                        firstName: req.body.firstName,
                        lastName: req.body.lastName,
                        username: req.body.username,
                        password: hashedPassword
                    });
                    user.save(err => {
                        if (err) return next(err)
                        res.redirect("/login");
                    });
                }
            });
        }
}];

exports.login_post = [
    passport.authenticate("local", {failureRedirect: "/login"}),
    (req, res) => {
        // TODO: show error message when entered admin code is wrong.
        const adminCode = "1234";
        if (req.body.adminCode === adminCode && !req.user.isAdmin) {
            User.findByIdAndUpdate(req.user._id, {isAdmin: true}, err => {
                if (err) return next(err);
            });
        }
        res.redirect("/home");
    },
];

exports.logout = function(req, res, next) {
    req.logout();
    res.redirect("/");
}

