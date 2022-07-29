// import all models
const Post = require('./Post');
const User = require('./User');
const Vote = require('./Vote');
const Comment = require('./Comment');

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
  foreignKey: 'user_id'
});

// With the belongsToMany() methods in place, this allows the User and post model to query each 
// other's information in the context of a vote. If we wanted to see which users voted on a single
// post we can now do that. We instruct the application that the User and Post models will be
// connected, but in this case through the Vote mode. We state that we want the foreign key to
// be in Vote, which aligns with the fields we set up in the model. We also stipulate that the name
// of the Vote model should be displayed as voted_posts when queried on, making it a little more
// informative. Furthermore, the Vote table needs a row of data to be a unique pairing so that it
// knows which data to pull in when queried on. Because the user_id and post_id pairings must be
// unique, we're protected from the possibility of a single user voting on one post multiple times.
// That layer of protection is referred to as a foreign key constraint.
User.belongsToMany(Post, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'user_id'
});

Post.belongsToMany(User, {
  through: Vote,
  as: 'voted_posts',
  foreignKey: 'post_id'
});

// Even though we're connecting the Post and User models together through the Vote model, there
// actually is no direct relationship between Post and Vote or User and Vote. If we want to see
// the total number of votes on a post, we need to directly connect the Post and Vote models.
Vote.belongsTo(User, {
  foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Vote, {
  foreignKey: 'user_id'
});

Post.hasMany(Vote, {
  foreignKey: 'post_id'
});

Comment.belongsTo(User, {
  foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
  foreignKey: 'post_id'
});

User.hasMany(Comment, {
  foreignKey: 'user_id'
});

Post.hasMany(Comment, {
  foreignKey: 'post_id'
});

module.exports = { User, Post, Vote, Comment };
