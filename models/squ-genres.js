const {DataTypes} = require('sequelize');
const sequelize = require('../util/seq-database');
const Joi = require('@hapi/joi');

const Genre = sequelize.define('genre', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: DataTypes.STRING,
});

function validate(body) {
    const schema =  Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
    });

    return schema.validate(body)
}

module.exports = {
    Genre,
    validate
};