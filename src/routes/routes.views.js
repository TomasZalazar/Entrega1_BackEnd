import { Router } from "express";
import productModel from "../dao/models/products.model.js"; // Importa tu modelo de producto de Mongoose
const router = Router();

router.get('/home', async (req, res) => {
    const options = {
        page: parseInt(req.query.page) || 1,
        limit: parseInt(req.query.limit) || 5,
        lean: true 
    };
    
    const query = {};
    
    try {
        const products = await productModel.paginate(query, options);
        res.render('home', {
            products: products.docs,
            totalPages: products.totalPages,
            currentPage: options.page,
            showPrev: options.page > 1,
            showNext: options.page < products.totalPages,
            prevPage: options.page > 1 ? options.page - 1 : null,
            nextPage: options.page < products.totalPages ? options.page + 1 : null
        });
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