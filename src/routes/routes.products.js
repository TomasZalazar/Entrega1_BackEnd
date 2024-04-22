import { Router } from "express";
import ProductManager from '../desafio_2.js';
import { uploader } from "../uploader.js";
import crypto from "crypto"
const router = Router()
const MANAGER = new ProductManager('productos.json')

router.get('/', async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await MANAGER.getProducts();
        if (limit) {
            const productsSlice = products.slice(0, parseInt(limit))
            res.status(200).send({ status: 200, payload: productsSlice });
        } else {
            res.status(200).send({ status: 200, payload: products });
        }
    } catch (error) {
        res.status(500).send({ status: 500, error: 'Error al obtener los productos' });
    }
});
router.get('/:pid', async (req, res) => {
    const { pid } = req.params
    try {
        const product = await MANAGER.getProductById(pid)
        if (product) {

            res.status(200).json({ status: 200, payload: product })
        } else {
            res.status(404).json({ status: 404, error: 'Producto no encontrado' })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: 'Error al obtener los productos' });

    }
})
let idIncrement = 1
// Inicializamos un contador para los IDs de productos
router.post('/', uploader.array('thumbnails', 4), async (req, res) => {
    const { title, description, price, code, stock } = req.body;
    const thumbnails = req.files.map(file => file.filename);
    
    // Verificar si los campos obligatorios están presentes en el cuerpo de la solicitud
    if (!title || !description || !price || !code || !stock) {
        return res.status(400).json({ error: 'Faltan campos obligatorios en la solicitud' });
    }
    
    // Generar un ID aleatorio para el nuevo producto
    function generateRandomId() {
        return crypto.randomBytes(8).toString('hex');
    }

    // Crear un nuevo objeto de producto con los datos del cuerpo de la solicitud
    const newProduct = {
        id: generateRandomId(), // Asignamos el ID y luego incrementamos el contador
        title,
        description,
        price,
        code,
        stock,
        thumbnails
    };

    // Agregar el nuevo producto utilizando el método addProduct del ProductManager
    try {
        const addedProduct = await MANAGER.addProduct(newProduct);

        // Si el producto se agregó correctamente, enviar una respuesta con un mensaje de éxito
        return res.status(201).json({ status: 201, message: 'Producto agregado correctamente', product: addedProduct });
    } catch (error) {
        // Si hubo un error al agregar el producto, enviar una respuesta con un mensaje de error
        return res.status(500).json({ error: 'Error al agregar el producto', message: error.message });
    }
});
router.put('/', () => {

})
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        const deleteProduct = await MANAGER.deleteProduct(pid);
        if (deleteProduct) {

            res.status(200).send({ status: 200, payload: deleteProduct, message: `Producto con el ID ${pid} eliminado correctamente` });
        } else {
            res.status(404).send({ status: 404, error: `Producto con ID ${pid} no encontrado` });
        }
    } catch (err) {
        console.error("Error al eliminar el producto:", err);
        res.status(500).send({ status: 500, error: 'Error al eliminar el producto' });
    }
});
export default router