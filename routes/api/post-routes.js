const router = require('express').Router();
const { Post, User } = require('../../models');

// get all users. Captures the response from the database call. This is the query to the
// database with the Promise.
router.get('/', (req, res) => {
    // Retrieves all the posts in the database.
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
        include: [
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;