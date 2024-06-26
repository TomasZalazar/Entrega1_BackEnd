import { Router } from 'express';
import ProductModel from '../dao/models/products.model.js';
import ProductManager from '../dao/productManager.mdb.js';
import { uploader } from '../middleware/uploader.js';
const router = Router();
const productManager = new ProductManager(ProductModel);



// http://localhost:4000/api/db/products/paginate?limit=2&page=2&query={"category":"Electronics"}&sort=1
router.get('/paginate', async (req, res) => {
    try {
        const { limit, page, query, sort } = req.query;
        const parsedQuery = query ? JSON.parse(query) : {};
        const result = await productManager.paginateProducts({ limit, page, query: parsedQuery, sort });
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        res.status(500).send({ error: "Error al obtener productos paginados" });
    }
});
router.get('/', async (req, res) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit) : 10;
        const result = await productManager.getAll(limit);
        res.status(result.status).send({ origin: result.origin, payload: result.payload }); 
    } catch (error) {
        res.status(500).send({ error: "Error al obtener productos" });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await productManager.getById(id);
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        res.status(500).send({ error: "Error al obtener producto" });
    }
});


router.post('/', uploader.array('thumbnails', 4), async (req, res) => {
    

    const { title, description, price, code, stock, category} = req.body;

    if (!title || !description || !price || !code || !stock || !category) {
        return res.status(400).json({ error: 'Todos los campos requeridos deben estar presentes.' });
    }
    const thumbnails = req.files ? req.files.map(file => file.filename) : [];
    try {
        const newProduct = {
            title,
            description,
            price,
            code,
            stock,
            category,
            thumbnails: thumbnails || []
        };
        const addedProduct = await ProductModel.create(newProduct);
        res.status(201).json(addedProduct);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const updProd = req.body;
        const result = await productManager.update(id, updProd);
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        res.status(500).send({ error: "Error al actualizar producto" });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await productManager.delete(id);
        res.status(result.status).send({ origin: result.origin, payload: result.payload });
    } catch (error) {
        res.status(500).send({ error: "Error al eliminar producto" });
    }
});

export default router;