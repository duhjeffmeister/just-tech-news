// Imported the Model class and datatypes object from Sequelize. The Model class is what we create our
// own models from  using the extends keyword so User inherits all of the functionality the Model class
// has.
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// Create our User model
class User extends Model {}

// Define table columns and configuration. Once we create the User class, we use the .init() method 
// to initialize the model's data and configuration, passing in two objects as arguments. The first 
// object will define the columns and data types for those columns. The second object it accepts
// configures certain options for the table. User model is set up to have 4 columns.
User.init(
    {
        // define an id column
        id: {
            // use the special Sequelize DataTypes object provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivalent of SQL's `NOT NULL` option
            allowNull: false,
            // instruct that this is the Primary Key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        
        // define a username column
        username: {
            type: DataTypes.STRING,
            allowNull: false
        },
        
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
            // this means the password must be at least four characters long
            len: [4]
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'user'
    }
);

// The newly created model is exported.
module.exports = User;