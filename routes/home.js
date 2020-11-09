var express = require('express');
var router = express.Router();

const homeController = require("../controllers/homeController");

router.get("/join", homeController.join_get);

router.post("/join", homeController.join_post);

router.get("/", homeController.home_get);

module.exports = router;
