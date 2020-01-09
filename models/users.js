const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 10,
    },
    email: {
        type: String,
        unique: true,
        minlength: 5,
        maxlength: 50,
        required: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 255,
    },
    isAdmin: Boolean,
});

userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(_.pick(this, ['_id', 'name', 'email','isAdmin']), config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('user', userSchema, 'users');

function validate(body) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(10),
        email: Joi.string().required().max(50).min(5).email(),
        password: Joi.string().required().max(50).min(5),
        isAdmin: Joi.boolean(),
    });

    return schema.validate(body);
}

module.exports = {
    User,
    validate
};