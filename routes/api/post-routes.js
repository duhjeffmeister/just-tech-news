const router = require('express').Router();
const { Post, User } = require('../../models');

// get all users. Captures the response from the database call. This is the query to the
// database with the Promise.
router.get('/', (req, res) => {
    // Retrieves all the posts in the database.
    Post.findAll({
        attributes: ['id', 'post_url', 'title', 'created_at'],
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
        attributes: ['id', 'post_url', 'title', 'created_at'],
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