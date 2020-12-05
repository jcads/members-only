var express = require('express');
var router = express.Router();
const passport = require("passport");

const indexController = require("../controllers/indexController");

router.get('/', (req, res, next) => {
    res.render("login", {title: "Log In"});
});

router.get("/signup", (req, res, next) => {
    res.render("signup");
})

router.post("/signup", indexController.signUp);

router.get("/login", indexController.login_get);

router.post("/login", indexController.login_post);

router.post("/logout", indexController.logout);


module.exports = router;
