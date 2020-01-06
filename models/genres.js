const Joi = require('@hapi/joi');

function validate(body) {
    const schema =  Joi.object({
        name: Joi.string().alphanum().min(3).max(30).required(),
    });

    return schema.validate(body)
}

module.exports = validate;