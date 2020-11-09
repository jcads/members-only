exports.join_get = function(req, res, next) {
    res.render("join_form", {title: "Join"});
}

exports.join_post = function(req, res, next) {
    console.log(req.body);
}

exports.home_get = function(req, res, next) {
    if (req.isAuthenticated()) {
       res.render("home");
    }
    else res.redirect("/login");
}; 
