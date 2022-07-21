const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

class Vote extends Model {}

// We can track the posts that users vote on. When a user votes on a post, we'll insert a new row
// of data to the table, which lists the primary key of the user and the primary keys of the post
// they voted on. We have created a through table, which is a table created for the sole purpose
// of connecting the data between two other tables with their primary keys.
Vote.init(
    {
        id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
        },
        user_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        post_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
            model: 'post',
            key: 'id'
            }
        }
    },
    {
        sequelize,
        timestamps: false,
        freezeTableName: true,
        underscored: true,
        modelName: 'vote'
    }
);

module.exports = Vote;