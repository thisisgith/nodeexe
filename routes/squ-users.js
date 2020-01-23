const { User, validate } = require('../models/squ-users');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const { QueryTypes } = require('sequelize');
const sequelize = require('../util/seq-database');

router.get('/', auth, async (req, res) => {
    try {
        const [users] = await sequelize.query(' SELECT `id`, `name`, `email` FROM `users`');
        res.send(users);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {
        const [user] = await sequelize.query(' SELECT `id`, `name`, `email` FROM `users` WHERE `id`=?',{
            replacements:[id]
        });

        if (user.length === 0)
            return res.status(404).send("!!!User not Available!!!");
        res.send(user[0]);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        const date = new Date();
        const [userId] = await sequelize.query(' INSERT into users (`name`,`email`,`createdAt`,`updatedAt`) values(?,?,?,?)',{
            replacements:[req.body.name,req.body.email,date,date]
        });

        //await user.save();

        res.send(`User created with id : ${userId}`);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', auth, async (req, res) => {
    const id = req.params.id;
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        const [user,l] = await sequelize.query('UPDATE `users` SET `name`= :name, `email`= :email, `updatedAt`= :updatedAt WHERE `id`= :id',{
            replacements:{
                name: req.body.name,
                email: req.body.email,
                updatedAt: new Date(),
                id: id
            }
        });
        if (user.affectedRows === 0)
            return res.status(404).send("!!!User not Available!!!");

        

        res.send("user details updated successfully");
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;
    try {
        const [user] = await sequelize.query('DELETE from `users` where id= ?',{
            replacements: [id]
        });
        if(user.affectedRows === 0){
            return res.status(404).send('User is not Available')
        }
        res.send("!!!User deleted successfully!!!");
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;