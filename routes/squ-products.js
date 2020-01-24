const { Product, validate } = require('../models/squ-products');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async (req, res) => {
    try {
        // This way we can get only products with are related to the user
        // const products = await req.squUser.getProducts({
        //     attributes: ['id','title','price','imageUrl','description','userId'],
        // });

        //Normal Way
        const products = await Product.findAll({
            attributes: ['id', 'title', 'price', 'imageUrl', 'description'],
        });

        res.send(products);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', auth, async (req, res) => {
    const id = req.params.id;
    try {

        // This way we can get only products with are related to the user
        // const product = await req.squUser.getProducts({
        //     where :{
        //         id: id
        //     },
        //     attributes: ['id','title','price','imageUrl','description','userId'],
        // });

        // Normal Way
        const product = await Product.findByPk(id,{
            attributes: ['id','title','price','imageUrl','description']
        });
        if (!product)
            return res.status(404).send("!!!Product not Available!!!");
        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    try {
        // Normal Way
        // const product = Product.build({
        //     title: req.body.title,
        //     price: req.body.price,
        //     imageUrl: req.body.imageUrl,
        //     description: req.body.description,
        //     userId: req.squUser.id // --- one way to add the association to the product
        // })

        // await product.save();

        // To add using association method which are created by sequelize we use below method
        const product = await req.squUser.createProduct({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
        });

        res.send(product);
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
        // To update using association method which are created by sequelize we use below method
        // const product = await req.squUser.getProducts({
        //     where :{
        //         id: id
        //     },
        //     attributes: ['id','title','price','imageUrl','description','userId'],
        // });
        // product[0].set();
        // product[0].save();

        // Normal Way
        const product = await Product.findByPk(id);
        if (!product)
            return res.status(404).send("!!!Product not Available!!!");

        product.set({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description,
            // userId: req.user.id --- one way to change the association to the product
        });

        await product.save();

        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', [auth, admin], async (req, res) => {
    const id = req.params.id;
    try {
        // To delete using association method which are created by sequelize we use below method
        // const product = await req.squUser.getProducts({
        //     where :{
        //         id: id
        //     },
        //     attributes: ['id','title','price','imageUrl','description','userId'],
        // });
        // product[0].destroy();

        // Normal Way
        const product = await Product.findByPk(id);
        if (!product)
            return res.status(404).send("!!!Product not Available!!!");

        await product.destroy();
        res.send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;