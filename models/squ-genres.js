const {DataTypes , Model} = require('sequelize');
const sequelize = require('../util/seq-database');
const Joi = require('@hapi/joi');

//Changed the model definition using class inorder to include custom method for token generation
class Genre extends Model {
    static classMethod() {
        return "this is class method-- ref doc :https://sequelize.org/master/manual/model-basics.html"
    }
    getIdandName() {
        console.log(this)
        return this.id + ' - '+ this.name;
    }
}

Genre.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: DataTypes.STRING,
}, {
    sequelize,
    tableName: 'genres'
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