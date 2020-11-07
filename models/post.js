const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    author: {type: "ObjectId", ref: "User", required: true},
    title: {type: String, required: true, maxlength: 100},
    postBody: String,
    datePosted: {type: Date, default: Date.now}
})

module.exports = mongoose.model("Post", PostSchema);
