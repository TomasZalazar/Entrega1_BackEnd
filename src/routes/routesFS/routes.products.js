import { Router } from "express";
import ProductManager from '../../dao/fylesystem/productManager.js';
import { uploader } from "../../config/multer/uploader.js";
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


router.post('/', uploader.array('thumbnails', 4), async (req, res) => {
    const { title, description, price, code, stock } = req.body;
    if (!title || !description || !price || !code || !stock) {// Verificar si los campos obligatorios están presentes en el cuerpo de la solicitud
        return res.status(400).json({ error: 'Faltan campos obligatorios en la solicitud' });
    }
    const thumbnails = req.files ? req.files.map(file => file.filename) : [];
    function generateRandomId() {// Generar un ID aleatorio para el nuevo producto
        return crypto.randomBytes(8).toString('hex');
    }
    const newProduct = {  // Crear un nuevo objeto de producto con los datos del cuerpo de la solicitud
        id: generateRandomId(), // Asignamos el ID y luego incrementamos el contador
        title,
        description,
        price,
        code,
        stock,
        thumbnails
    };
    try {
        const addedProduct = await MANAGER.addProduct(newProduct);
        // Emitir un evento de nuevo producto a través de Socket.IO
        req.app.get('socketServer').emit('nuevoProducto',addedProduct);
        return res.status(201).json({ status: 201, message: 'Producto agregado correctamente', product: addedProduct });// Agregar el nuevo producto utilizando el método addProduct del ProductManager
    } catch (error) {
        return res.status(500).json({ error: 'Error al agregar el producto', message: error.message });
    }
});
router.put('/:pid', async (req, res) => {
    const { pid } = req.params;
    const { title, description, price } = req.body;
    if (!title || !description || !price) {
        return res.status(400).json({ error: 'Faltan campos obligatorios en la solicitud' });
    }
    try {
        const productUpdateResult = await MANAGER.updateProduct(pid, { title, description, price });
        if (productUpdateResult) {
            return res.status(200).json({ status: 200, message: 'Producto actualizado correctamente' });
        } else {
            return res.status(404).json({ error: 'No se encontró ningún producto con el ID proporcionado' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Error al actualizar el producto', message: error.message });
    }
});
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;
    try {
        const deleteProduct = await MANAGER.deleteProduct(pid);
        if (deleteProduct) {
            req.app.get('socketServer').emit('productoEliminado', { id: deleteProduct.id});
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
