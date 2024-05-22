import { Router } from 'express';

import {config} from '../../config.js';
import cartsModel from '../../dao/models/carts.model.js';
import usersModel from '../../dao/models/users.model.js';
import productsModel from '../../dao/models/products.model.js';


const router = Router();

router.get('/', async (req, res) => {
    try {
        const process = await cartsModel.find().populate().lean();
        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id; 
        const process = await cartsModel.findById(id).populate({ path: 'products._id', model: productsModel }).lean();
        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const { _user_id, products } = req.body;

        // Verificar que el usuario existe
        const user = await usersModel.findById(_user_id);
        if (!user) {
            return res.status(400).send({ origin: config.SERVER, payload: null, error: 'User not found' });
        }

        // Verificar que los productos existen
        const productPromises = products.map(async (product) => {
            const prod = await productsModel.findById(product._id);
            if (!prod) {
                throw new Error(`Product not found: ${product._id}`);
            }
        });
        await Promise.all(productPromises);

        // Crear el carrito
        const newCart = await cartsModel.create({ _user_id, products });

        res.status(200).send({ origin: config.SERVER, payload: newCart });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const product = await productsModel.findById(pid);
        if (!product) {
            return res.status(404).json({ error: 'El producto no existe' });
        } 
        const cart = await cartsModel.findOne({ _id: cid });
        const existingProductIndex = cart.products.findIndex(item => String(item._id) === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].qty++;
        } else {
            cart.products.push({ _id: pid, qty: 1 });
        }
        await cart.save();
        return res.status(201).json({ status: 201, message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const update = req.body;
        const options = { new: true };
        const process = await cartsModel.findOneAndUpdate(filter, update, options);
        
        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const filter = { _id: req.params.id };
        const process = await cartsModel.findOneAndDelete(filter);

        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;
