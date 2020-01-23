const {Product,validate} = require('../models/squ-products');
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/', auth, async(req, res) => {
    try {
        const products = await Product.findAll({
            attributes: ['id','title','price','imageUrl','description'],
        });

        res.send(products);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.get('/:id', auth,async (req,res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByPk(id,{
            attributes: ['id','title','price','imageUrl','description']
        });
        if(!product)
            return res.status(404).send("!!!Product not Available!!!");
        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.post('/', auth, async(req, res) => {
    const {error} = validate(req.body);
    if(error) 
        return res.status(400).send(error.details[0].message);
    
    try {
        const product = Product.build({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description
        })

        await product.save();

        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.put('/:id', auth, async(req, res) => {
    const id = req.params.id;
    const {error} = validate(req.body);
    if(error) 
        return res.status(400).send(error.details[0].message);
    
    try {
        const product = await Product.findByPk(id);
        if(!product)
            return res.status(404).send("!!!Product not Available!!!");

            product.set({
            title: req.body.title,
            price: req.body.price,
            imageUrl: req.body.imageUrl,
            description: req.body.description
        });

        await product.save();

        res.send(product);
    } catch (err) {
        res.status(500).send(err.message);
    }
});

router.delete('/:id', [auth, admin],async (req,res) => {
    const id = req.params.id;
    try {
        const product = await Product.findByPk(id);
        if(!product)
            return res.status(404).send("!!!Product not Available!!!");

        await product.destroy();
        res.send(product);
    } catch (err) {
        res.status(500).send(err);
    }
});


module.exports = router;