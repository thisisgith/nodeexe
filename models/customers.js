const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean,
        required: true
    },
    name : {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    phone: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    }
});

const Customer = mongoose.model('customer', customerSchema, 'customers');

function validate( body ) {
    const schema = Joi.object({
        isGold: Joi.boolean().required(),
        name: Joi.string().min(3).max(30).required(),
        phone: Joi.string().min(3).max(30).optional()
    });

    return schema.validate(body);
}

module.exports = {
    Customer,
    validate
}