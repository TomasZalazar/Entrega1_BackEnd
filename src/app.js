
import express from 'express'
import  {config}  from './config.js';
import productsRoutes from './routes/routes.products.js';
import usersRoutes from './routes/routes.users.js';
import logger from 'morgan'
const app = express()
app.use(logger('dev'))

//configuracion del server
app.disable('x-powered-by')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'))

// endpoints
app.use('/api/products',productsRoutes)
app.use('/api/users',usersRoutes)
app.use('/static', express.static(`${config.DIRNAME}/public`))



app.listen(config.PORT , () => {console.log(`SERVIDOR ESCUCHANDO EL PUERTO http://localhost:${config.PORT}`)})