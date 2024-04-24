import fs from 'fs';
import crypto from 'crypto'

export default class CartManager {
    constructor(filePath) {
        this.filePath = filePath;
        this.cart = [];
    }

    async readCartFromFile() {
        try {
            const data = await fs.promises.readFile(this.filePath, 'utf-8');
            if (data.trim() !== '') {
                this.cart = JSON.parse(data);
            }
        } catch (error) {
            console.error("Error al leer el archivo:", error);
        }
    }

    async saveCartToFile() {
        try {
            const jsonData = JSON.stringify(this.cart, null, 2);
            await fs.promises.writeFile(this.filePath, jsonData, 'utf-8');
            console.log("Productos guardados correctamente en el archivo.");
        } catch (error) {
            console.log("Error al guardar el archivo:", error);
        }
    }

    async initialize() {
        try {
            await this.readCartFromFile();
        } catch (error) {
            console.error("Error al inicializar CartManager:", error);
        }
    }

    async getCartById(cid) {
        await this.readCartFromFile(); // Esperar a que se lea el archivo
        const cartItem = this.cart.find(item => item.cid === cid); // Filtrar el carrito por el ID
        return cartItem ? cartItem : null; // Devolver el carrito filtrado o null si no se encuentra el ID
    }

    async getCart() {
        await this.readCartFromFile();
        return this.cart;
    }
    generateRandomId() {
        return crypto.randomBytes(8).toString('hex');
    }
    async createCart(quantity) {
        await this.readCartFromFile();
        const newCart = {
            cid : this.generateRandomId(),
            quantity: quantity,
            products: []
        };
        this.cart.push(newCart);
        await this.saveCartToFile();
        return newCart;
    }
    async updateCart(id,updateCart) {
        try{
            const index = this.cart.findIndex(cart => cart.id === id )
            if(index !== -1){
                this.cart[index] = {...this.cart[index], ...updateCart}
                await this.saveCartToFile
                console.log("carrito actualizado correctamente")
                return true 
            }
            console.log("No se encontró ningún carrito con el ID proporcionado");
            return false;

        }catch(error){
            console.log('error al actualizar el producto', error)
            return false
        }
    } 
};


// const managerCart = new CartManager('cart.json');

// (async () => {
//     await managerCart.initialize();
//     console.log(await managerCart.getCart());
// })();
