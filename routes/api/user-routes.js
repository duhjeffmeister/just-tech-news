const router = require('express').Router();
const { User, Post, Vote } = require('../../models');

// GET /api/users. When a GET request is made, we will select all users from the user table in
// the user table in the database and send it back as JSON. The User model inherits functionality
// from the Sequelize model class. .findAll() is one of the Model class's methods, which lets us
// query all of the users from the user table in the database and is the JavaScript equivalent
// of SELECT * FROM users; in SQL. Since Sequelize is a JavaScript Promise-based library, we get
// to use .then() with all of the model methods.
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({
        attributes: { exclude: ['password'] }
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    })
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    // .findOne() is letting us use the where option to indicate we want to find a user where its
    // id value equals whatever req.params.id is, similar to the SQL query
    // SELECT * FROM users WHERE id = 1. Since we're looking at one user, there's a possibility that
    // we could accidentally search for a user with a nonexistent id value. Therefore, if the .then()
    // method returns nothing from the query, we send a 404 status back to the client to indicate
    // everything's ok and they just asked for the wrong piece of data.
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },

        // Retrieves data regarding which posts a user has voted on. When we query users, we will
        // get back a list of posts that a user has actively created and a list of posts that a user
        // has voted on. 
        include: [
            {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
            },
            // Includes the vote data
            {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
            }
        ]
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// POST /api/users; creates a new user
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // To insert data, we use Sequelize's .create() method. Pass in key/value pairs where the keys
    // are what we defined in the User model and the values are what we get from req.body. In SQL,
    // this command would look like INSERT INTO users (username, email, password) VALUES ("Lernantino", "lernantino@gmail.com", "password1234");
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

// Searches for the instance of a user that contains the user's credentials. In this case, the user's
// email. We query the User table using the findOne() method for the email entered by the user and
// assigned it to req.body.email. If hte user with that email was not found, a message is sent back
// as a response to the client. However, if the email was found in the database, the next step will
// be to verify the user's identity by matching the password from the user and the hashed password
// in the database. This will be done in the Promise of the query.
router.post('/login', (req, res) => {
    
    // The .findOne() Sequelize method looks for a user with the specified email. The result of the
    // query is passed as dbUserData to the .then() part of the .findOne() method. If the query was 
    // successful (not empty), we can call .checkPassword(), which will be on the dbUserData object.
    // We'll need to pass the plaintext password, which is stored in req.body.password, into
    // .checkPassword() as the argument. The .compareSync() method, which is in .checkPassword(), can
    // then confirm or deny that the supplied password matches the hashed password stored on the object.
    // .checkPassword() will then return true on success or false on failure. That boolean value will
    // then be stored to the variable validPassword.

    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        res.json({ user: dbUserData, message: 'You are now logged in!' });
    });  
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // This .update() method combines the parameters for creating data and looking up data. We pass
    // in req.body to provide the new data we want to use in the update and req.params.id to indicate
    // where exactly we want that new data to be used. If we were to put it in SQL syntax it would look
    // like this: UPDATE users SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1;
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
        })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
            .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    // To delete dat, we use the .destroy() method and provide some tpe of identifier to indicate
    // where exactly we would like to delete data from the user database table.
    User.destroy({
        where: {
            id: req.params.id
        }
    })
    .then(dbUserData => {
        if (!dbUserData) {
            res.status(404).json({ message: 'No user found with this id' });
            return;
        }
        res.json(dbUserData);
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

module.exports = router;