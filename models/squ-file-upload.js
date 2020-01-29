const { DataTypes } = require('sequelize');
const sequelize = require('../util/seq-database');
const Joi = require('@hapi/joi');

const FileUpload = sequelize.define('fileUpload', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
    },
    name: DataTypes.STRING,
    filePath: DataTypes.STRING,
});

function validate(body) {
    const schema = Joi.object({
        name: Joi.string().required(),
    });

    return schema.validate(body);
}

module.exports = {
    validate, FileUpload
}