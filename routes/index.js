var express = require('express');
var router = express.Router();
const passport = require("passport");

const indexController = require("../controllers/indexController");

router.get('/', indexController.index);

router.get("/signup", (req, res, next) => {
    res.render("signup");
})

router.post("/signup", indexController.signUp);

router.get("/login", (req, res, next) => {
    res.render("login", {title: "Log In"});
})

router.post(
    "/login", 
    passport.authenticate("local", {
        successRedirect: "/clubhouse/home",
        failureRedirect: "/clubhouse/login"
    })
);

router.get("/home", indexController.home_get);

router.post("/logout", indexController.logout);

module.exports = router;
