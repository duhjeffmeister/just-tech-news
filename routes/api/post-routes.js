const router = require('express').Router();
const sequelize = require('../../config/connection');
const { Post, User, Vote } = require('../../models');



// get all users. Captures the response from the database call. This is the query to the
// database with the Promise.
router.get('/', (req, res) => {
    console.log('======================');
    // Retrieves all the posts in the database.
    Post.findAll({
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            // Includes the total vote count for a post.
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
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

router.get('/:id', (req, res) => {
    // Retrieves one post in the database.
    Post.findOne({
        // where sets the value of the id using req.params.id. We're requesting the same attributes
        // including the username which requires a reference to the User model using the include
        // property.
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
            model: User,
            attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        res.json(dbPostData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Creates a post. We are assigning the values of the title, post_url, and user_id to the properties in the req.body
// object that was in the request from the user.
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
    //
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// PUT /api/posts/upvote. Needs to be before the router.put route with /:id otherwise Express.js will
// think the word "upvote" is a valid parameter for /:id. The upvote request involves two queries: first,
// using the Vote model to create a vote, then querying on that post to get an updated vote count. To 
// create a vote, we need to pass in both the user's id and the post's id with req.body. 
router.put('/upvote', (req, res) => {
    // To create a vote we need to pass in both the user's id and the post's id with req.body.
    Vote.create({
        user_id: req.body.user_id,
        post_id: req.body.post_id
    })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => res.json(err));
});

// Update a post's Title. Because this updates an existing entry, the first thing is to retrieve the
// post instance by id, then alter the value of the title on this instance of a post.
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbPostData => {
            if (!dbPostData) {
                res.status(404).json({ message: 'No post found with this id' });
                return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
        })
        .then(dbPostData => {
            if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
            }
            res.json(dbPostData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;