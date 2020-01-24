const sequelize = require('../util/seq-database');
const Joi = require('@hapi/joi');
const { DataTypes } = require('sequelize');

const Product = sequelize.define('product', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true
    },
    title: DataTypes.STRING,
    price: {
        type: DataTypes.DOUBLE,
        allowNull: false,
    },
    imageUrl: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    tableName: 'products'
});

function validate(body) {
    const schema = Joi.object({
        title: Joi.string().min(3).max(20).required(),
        price: Joi.number().min(3).max(10).required(),
        imageUrl: Joi.string().min(3).max(20).required(),
        description: Joi.string().min(3).max(266).optional(),
    });

    return schema.validate(body);
}

module.exports = {
    Product,
    validate
}