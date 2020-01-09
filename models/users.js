const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const usersSchema = new mongoose.Schema({
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
    }
});

const User = mongoose.model('user',usersSchema,'users');

function validate(body) {
    const schema = Joi.object({
        name: Joi.string().required().min(3).max(10),
        email: Joi.string().required().max(50).min(5).email(),
        password: Joi.string().required().max(50).min(5),
    });

    return schema.validate(body);
}

module.exports = {
    User,
    validate
};