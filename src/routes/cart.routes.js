import { Router } from 'express';
import { config } from '../config.js';
import cartsModel from '../dao/models/carts.model.js';
import usersModel from '../dao/models/users.model.js';
import CartsManager from '../dao/cartManager.mdb.js';
const router = Router();
const cartManager = new CartsManager(cartsModel, usersModel);

router.get('/carts/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const cart = await cartsModel.findById(cartId).populate('_user_id').populate('products.product').lean();
        res.render('cart', { cart });
    } catch (error) {
        console.error("Error retrieving cart:", error);
        res.status(500).send('Internal server error');
    }
});


router.get('/', async (req, res) => {
    const process = await cartManager.getAll();
    res.status(process.status).send({ origin: process.origin, payload: process.payload });
});

router.get('/one/:cid', async (req, res) => {
    const cid = req.params.cid;
    const process = await cartManager.getById(cid);
    res.status(process.status).send({ origin: config.SERVER, payload: process.payload, error: process.error });
});

router.post('/', async (req, res) => {
    const { _user_id, products } = req.body;
    const process = await cartManager.createCart(_user_id, products);
    res.status(process.status).send({ origin: config.SERVER, payload: process.payload, error: process.error });
});

router.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { qty } = req.body;
    const process = await cartManager.addProductToCart(cid, pid, qty);
    res.status(process.status).send({ message: process.message, error: process.error });
});

router.delete('/:cid/products', async (req, res) => {
    const cartId = req.params.cid;
    const process = await cartManager.clearCartProducts(cartId);
    res.status(process.status).send({ origin: config.SERVER, payload: process.payload, error: process.error });
});

router.delete('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const process = await cartManager.removeProductFromCart(cid, pid);
    res.status(process.status).send({ origin: config.SERVER, payload: process.payload, error: process.error });
});

router.delete('/:id', async (req, res) => {
    const cartId = req.params.id;
    const process = await cartManager.deleteCart(cartId);
    res.status(process.status).send({ origin: config.SERVER, payload: process.payload, error: process.error });
});



export default router;
