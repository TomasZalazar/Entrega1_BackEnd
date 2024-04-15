
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
      const productsSlice = products.slice(0, parseInt(limit))
      res.status(200).send({status:200,payload: productsSlice});
    } else {
      res.status(200).send({status:200 , payload: products});
    }
  } catch (error) {
    res.status(500).send({ status: 500, error: 'Error al obtener los productos' });
  }
});
app.get('/products/:id', async (req, res) => {
  const {id} = req.params
  try{
    const product = await MANAGER.getProductById(id)
    if(product){

      res.status(200).json({status:200 , payload: product})
    }else{
      res.status(404).json({status:404 , error: 'Producto no encontrado' })
    }
  }catch(err){
    res.status(500).send({status:500 , error: 'Error al obtener los productos' });
    
  }
})

app.listen(PORT , () => {
    console.log(`SERVIDOR ESCUCHANDO EL PUERTO http://localhost:8080`)
})




