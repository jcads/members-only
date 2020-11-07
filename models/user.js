const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stringDocumentDefault = {type: String, required: true, maxlength: 50};

const UserSchema = new Schema({
    firstName: stringDocumentDefault, 
    lastName: stringDocumentDefault, 
    username: stringDocumentDefault, 
    password: String,
    post: [{type: "ObjectId", ref: "Post"}],
    membershipStat: {
        type: String,
        enum: ["Member", "Not member"],
        default: "Not member"
    },
    isAdmin: Boolean
});

// virtual properties
UserSchema.virtual("fullname").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

// TODO
UserSchema.virtual("url").get(function() {
    return `${this.firstName} ${this.lastName}`;
});

module.exports = mongoose.model("User", UserSchema);

