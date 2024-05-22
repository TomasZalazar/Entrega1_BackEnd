import { Router } from "express";
import productModel from "../dao/models/products.model.js"; // Importa tu modelo de producto de Mongoose
const router = Router();

router.get('/home', async (req, res) => {
    try {
        const products = await productModel.find().lean(); // Consulta todos los productos de la base de datos
        console.log(products); // Verifica los datos antes de pasarlos a la plantilla
        res.render('home', { products }); // Renderiza la vista 'home' con los productos obtenidos de la base de datos
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await productModel.find().lean(); // Consulta todos los productos de la base de datos
        res.render('realTimeProducts', { products }); // Renderiza la vista 'realTimeProducts' con los productos obtenidos de la base de datos
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});

router.get('/chat', (req, res) => {
    res.render('chat', {});
});

export default router;