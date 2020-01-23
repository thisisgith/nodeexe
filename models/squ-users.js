const sequelize = require('../util/seq-database');
const Joi = require('@hapi/joi');
const {DataTypes} = require('sequelize');

const User = sequelize.define('user', {
    id : {
        type : DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    name: DataTypes.STRING,
    email: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'users'
});

function validate(body) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(10).required(),
        email: Joi.string().email().required(),
    });

    return schema.validate(body);
}

module.exports = {
    User,
    validate
}