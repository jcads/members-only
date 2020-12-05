const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
    author: {type: "ObjectId", ref: "User", required: true},
    title: {type: String, required: true, maxlength: 100},
    postBody: String,
    datePosted: {type: Date, default: Date.now}
})

PostSchema.virtual("url").get(function() {
    return `/clubhouse/post/${this.id}`;
});

PostSchema.virtual("date").get(function() {
    return this.datePosted.toLocaleDateString("en-gb", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
});

module.exports = mongoose.model("Post", PostSchema);
