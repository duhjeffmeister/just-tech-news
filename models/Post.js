const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Post model
class Post extends Model {}

// Create fields/columns for Post model. The first parameter of Post.init defines the Post
// schema. The id column is the primary key and it is set to auto increment. Next we define
// the title column as a String value. post_url is included which is also defined as a String.
// Sequelize has the ability to offer validation in the schema definition. Here we ensure
// that this url is a verified link by setting the isURL property to true. In the user_id
// column, it determines who posted the news article. Using the references property we
// establish the relationship between this post and the user by creating a reference to the
// User mode, specifically to the id column that is defined by the key property, which is
// the primary key. The user_id is conversely defined as the foreign key and will be the
// matching link. 
Post.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isURL: true
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },

    // In the second parameter, we configure the metadata, including the naming conventions.
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'post'
    }
);

// Exports the Post model to be accessible to other parts of the application.
module.exports = Post;