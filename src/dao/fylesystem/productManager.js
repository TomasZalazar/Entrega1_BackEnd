import fs from 'fs';


export default class ProductManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.products = [];

        this.initialize()
    }
    async readProductsFromFile() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            if (data.trim() !== '') {
                this.products = JSON.parse(data);
            }
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }
    }
    async saveProductsToFile() {
        try {
            const jsonData = JSON.stringify(this.products, null, 2);
            await fs.promises.writeFile(this.filePath, jsonData, { encoding: 'utf-8', flag: 'w' });
            console.log("Productos guardados correctamente en el archivo.");
        } catch (error) {
            console.log("Error al guardar el archivo:", error);
        }
    }
    async initialize() {
        try {
            await this.readProductsFromFile();

        } catch (error) {

            console.error("Error al inicializar ProductManager:", error);
        }
    }

    async deleteProduct(id) {
        ; // Convertir el ID a un número entero
        const index = this.products.findIndex(product => product.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            await this.saveProductsToFile();
            console.log("Producto eliminado correctamente");
            return true;
        }
        console.log("No se encontró ningún producto con el ID proporcionado");
        return false;
    }
    async updateProduct(id, updatedProduct) {
        try {
            const existingProduct = await this.getProductById(id);
            if (!existingProduct) {
                console.log("No se encontró ningún producto con el ID proporcionado");
                return false;
            }
            const index = this.products.findIndex(i => i.id === id);
            if (index !== -1) {
                this.products[index] = { ...this.products[index], ...updatedProduct };
                await this.saveProductsToFile(); // Espera a que se complete la escritura en el archivo
                console.log("Producto actualizado correctamente");
                return true;
            } else {
                console.log("No se encontró ningún producto con el ID proporcionado en la lista de productos");
                return false;
            }
        } catch (error) {
            console.error("Error al actualizar el producto:", error);
            return false;
        }
    }
    

    
    async addProduct(product) {
        try {
            const approved = product.title && product.description && product.price && product.code && product.stock;
            if (!approved) {
                throw new Error("Por favor completar todos los campos requeridos");
            }
            const validate = this.products.some((item) => item.code === product.code);

            if (validate) {
                console.log('Ya existe un producto con este código. No se agregará el producto.');
                return { success: false, message: 'Ya existe un producto con este código' };
            }

            // product.id = this.products.length + 1;
            this.products.push(product);
            console.log("Producto agregado correctamente");
            await this.saveProductsToFile();

            return { success: true, message: 'Producto agregado correctamente', product };
        } catch (error) {
            console.error("Error al agregar el producto:", error.message);
            throw error;
        }
    }
    async getProducts() {
        const products = await this.products
        return products
    }

    async getProductById(id) {
        const products = await this.getProducts();
        // console.log("Lista de productos:", products);
        const product = products.find((i) => i.id === id);
        // console.log("ID del producto buscado:", id); // Imprimir el ID del producto buscado
        return product ? product : (console.log("Producto no encontrado"), null);
    }
}

const manager = new ProductManager('productos.json');

const newProduct = {
    title: "Hidrolavadora Electrica Femmto HLT203 1400W Alta presion 1600 Psi",
    description: "Transforma tu rutina de limpieza con nuestra hidrolavadora multifuncional y versátil. Gracias a la tecnología AutoStop, no sólo es segura, sino también fácil de manejar. Es la herramienta perfecta para todo, desde autos hasta muebles de jardín.",
    price: 94999,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_925447-MLU75407070577_032024-O.webp",
    code: "P001",
    stock: 66
};
const newProduct2 = {
    title: "Hidrolavadora Electrica Femmto HLT203 1400W Alta presion 1600 Psi",
    description: "Transforma tu rutina de limpieza con nuestra hidrolavadora multifuncional y versátil. Gracias a la tecnología AutoStop, no sólo es segura, sino también fácil de manejar. Es la herramienta perfecta para todo, desde autos hasta muebles de jardín.",
    price: 94999,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_925447-MLU75407070577_032024-O.webp",
    code: "P002",
    stock: 200
};
const newProduct4 = {
    title: " HLT203 1400W Alta presion 1600 Psi",
    description: " hidrolavadora multifuncional y versátil. Gracias a la tecnología AutoStop, no sólo es segura, sino también fácil de manejar. Es la herramienta perfecta para todo, desde autos hasta muebles de jardín.",
    price: 9999,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_925447-MLU75407070577_032024-O.webp",
    code: "P004",
    stock: 100
};
const newProduct3 = {
    title: "123",
    description: "123",
    price: 94999,
    thumbnail: "https://http2.mlstatic.com/D_NQ_NP_925447-MLU75407070577_032024-O.webp",
    code: "P003",
    stock: 66
};

// manager.addProduct(newProduct) //agregar productos 
// manager.addProduct(newProduct2)
// manager.addProduct(newProduct3)
// manager.addProduct(newProduct4)

manager.initialize() // cuando se inicializa crea el .json
    .then(() => {
        // manager.addProduct(newProduct2)
        // console.log(manager.getProducts()) // traer todos los objetos dentro del JSON
        // console.log(manager.getProductById(2))  // traer todos los objetos dentro del JSON por el id indicado
        // manager.updateProduct(4,newProduct)
        // manager.deleteProduct(4)   
    })

