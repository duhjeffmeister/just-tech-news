const { Model, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/connection');

// create our User model
class User extends Model {
  // set up method to run on instance data (per user) to check password
  checkPassword(loginPw) {
    // Using this, we can access this user's properties, including the password, which was stored
    // as a hashed string.
    return bcrypt.compareSync(loginPw, this.password);
  }
}

// Define table columns and configuration. Once we create the User class, we use the .init() method
// to initialize the model's data and configuration, passing in two objects as arguments. The first 
// object will define the columns and data types for those columns. The second object it accepts
// configures certain options for the table. User model is set up to have 4 columns.
User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [4]
      }
    }
  },
  {
    // Hooks are functions that are called before or after calls in Sequelize.
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality. beforeCreate() executes the bcrypt
      // hash function on the plaintext password. In the function, we pass in the userData object
      // that contains the plaintext password in the password property. We also pass in a saltRound
      // value of 10. The resulting hashed password is then passed to the Promise object as a 
      // newUserData object with a hashed password property. The return statement then exits out
      // of the function, returning the hashed password in the newUserData function.
      // beforeCreate(userData) {
      //     return bcrypt.hash(userData.password, 10).then(newUserData => {
      //     return newUserData
      //     });
      // }

      // The keyword pair async/await works in tandem to make this async function look more like a 
      // regular synchronous function expression. the async keyword is used as a prefix to the
      // function that contains the asynchronous function. await can be used to prefix the async
      // function, which will then gracefully assign the value from the response to the newUserdata's
      // password property. the newUserData is then returned to the application with the hashed password.
      // Comparing this function to the above function we can see that the async/await version is 
      // much easier to read with only a single newUserData variable that is both input and output
      // after the password hashing modification.
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
        return newUserData;
      },
      
      // set up beforeUpdate lifecycle "hook" functionality
      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
        return updatedUserData;
      }
    },
    sequelize,
    timestamps: false,
    freezeTableName: true,
    underscored: true,
    modelName: 'user'
  }
);

module.exports = User;
