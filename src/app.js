
import express from 'express'
import ProductManager from './desafio_2.js';


const MANAGER = new ProductManager('productos.json')
const PORT = process.env.PORT ?? 8080
const app = express()

app.disable('x-powered-by')

app.get('/products', async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await MANAGER.getProducts();
    if (limit) {
      res.send(products.slice(0, parseInt(limit)));
    } else {
      res.send({status:201 , payload: products});
    }
  } catch (error) {
    res.status(500).send({ error: 'Error al obtener los productos' });
  }
});
app.get('/products/:id', async (req, res) => {
  const {id} = req.params
  try{
    const product = await MANAGER.getProductById(id)
    if(product){

      res.status(200).json({status:200 , payload: product})
    }else{
      res.status(404).json({ error: 'Producto no encontrado' })
    }
  }catch(err){
    res.status(500).send({ error: 'Error al obtener los productos' });
    
  }
})

app.listen(PORT , () => {
    console.log(`SERVIDOR ESCUCHANDO EL PUERTO http://localhost:8080`)
})




