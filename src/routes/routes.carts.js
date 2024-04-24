import { Router } from "express";
import cartManager from '../cartManager.js'
import ProductManager from "../desafio_2.js";

/* carts.routes.js (3 endpoints): 
    - debe agregar un item al array products del carrito, con solo el id del producto y una propiedad quantity (por ahora en 1).
    - verificar si el id de producto ya está en el array products, en ese caso sumarle 1.
 */
const router = Router()
const PRODUCT_MANAGER = new ProductManager('productos.json')
const CART_MANAGER = new cartManager('cart.json')


router.get('/:cid', async (req, res) => {
    const { cid } = req.params;
    console.log("Obteniendo carrito con ID:", cid);
    try {
        const cartProducts = await CART_MANAGER.getCartById(cid);
        if (cartProducts) {
            console.log("Productos del carrito:", cartProducts);
            res.status(200).send({ status: 200, payload: cartProducts });
        } else {
            console.log("Carrito no encontrado.");
            res.status(404).send({ status: 404, error: 'Carrito no encontrado' });
        }
    } catch (error) {
        console.error("Error al obtener los productos del carrito:", error);
        res.status(500).send({ status: 500, error: 'Error al obtener los productos del carrito' });
    }
});
router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        const cart = await CART_MANAGER.getCart();
        if (limit) {
            const cartSlice = cart.slice(0, parseInt(limit))
            res.status(200).send({ status: 200, payload: cartSlice });
        } else {
            res.status(200).send({ status: 200, payload: cart });
        }
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los productos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const quantity = req.body.quantity; 
        if (!quantity) {
            return res.status(400).json({ status: 400, error: 'La cantidad es obligatoria' });
        }
        const addedCart = await CART_MANAGER.createCart(quantity);
        return res.status(201).json({ status: 201, message: 'Producto agregado correctamente', product: addedCart });
    } catch (error) {
        
        console.error("Error al crear el carrito:", error);
        res.status(500).json({ status: 500, error: 'Error al crear el carrito', message: error.message });
    }
});
router.post('/:cid/product/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const product = await PRODUCT_MANAGER.getProductById(pid);
        if (!product) {
            return res.status(404).json({ error: 'El producto no existe' });
        } 
        const cart = await CART_MANAGER.getCartById(cid);
        const existingProductIndex = cart.products.findIndex(item => String(item.cid) === pid);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity++;
        } else {
            cart.products.push({ pid: pid, quantity: 1 });
        }
        await CART_MANAGER.saveCartToFile();
        return res.status(201).json({ status: 201, message: 'Producto agregado al carrito correctamente' });
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        return res.status(500).json({ error: 'Error interno del servidor' });
    }
});

export default router