const express = require('express');
const routes = require('./routes');
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// turn on connection to db and server. The "sync" part means that this is Sequelize taking the models
// and connecting them to associated database tables. If it doesn't find a table, it'll create it
// for you. Utilizing {force: false} in the .sync() method would drop and recreate all of the database
// tables on startup if it were set to true. This is great for when we make changes to the Sequelize models
// as the database would need a way to understand that something has changed. 

// turn on connection to database and server. By making the value of the force property to be true,
// then the database connection must sync with the model definitions and associations. By forcing 
// the sync method to true, we will make the tables re-create if there are any association changes.
sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});