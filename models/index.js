const User = require("./User");
const Post = require("./Post");

// Create associations. A user can make many posts; this association creates the reference for
// the id column in the User model to link to the corresponding foreign key pair, which is the
// user_id in the Post model.
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// In this statement, we're defining the relationship of the Post model to the User. The
// constraint we impose here is that a post can belong to one user, but not many users. We
// We declare the link to the foreign key, which is designated at user_id in the Post model.
Post.belongsTo(User, {
    foreignKey: 'user_id',
});

module.exports = { User, Post };