const User = require("../models/user");
const bcrypt = require("bcryptjs");
const {body, validationResult, check} = require("express-validator");
const passport = require("passport");

exports.index = function(req, res, next) {
    res.redirect("/clubhouse/signup");
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
                        res.redirect("/clubhouse/login");
                    });
                }
            });
        }
}];

exports.home_get = function(req, res, next) {
    if (req.isAuthenticated()) {
       res.render("home");
    }
    else res.redirect("/clubhouse/login");
}; 

exports.logout = function(req, res, next) {
    req.logout();
    res.redirect("/clubhouse");
}
