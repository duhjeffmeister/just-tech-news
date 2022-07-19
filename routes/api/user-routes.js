const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users. When a GET request is made, we will select all users from the user table in
// the user table in the database and send it back as JSON. The User model inherits functionality
// from the Sequelize model class. .findAll() is one of the Model class's methods, which lets us
// query all of the users from the user table in the database and is the JavaScript equivalent
// of SELECT * FROM users; in SQL. Since Sequelize is a JavaScript Promise-based library, we get
// to use .then() with all of the model methods.
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll()
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
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

// POST /api/users
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

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}

    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // This .update() method combines the parameters for creating data and looking up data. We pass
    // in req.body to provide the new data we want to use in the update and req.params.id to indicate
    // where exactly we want that new data to be used. If we were to put it in SQL syntax it would look
    // like this: UPDATE users SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234" WHERE id = 1;
    User.update(req.body, {
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