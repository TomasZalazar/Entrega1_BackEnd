
import express from 'express'
import  {config}  from './config.js';
import handlebars from 'express-handlebars';
import productsRoutes from './routes/routes.products.js';
import cartRoutes from './routes/routes.carts.js'
import viewsRoutes from './routes/routes.views.js'
import usersRoutes from './routes/routes.users.js';
import logger from 'morgan'
const app = express()
app.use(logger('dev'))

//configuracion del server
app.disable('x-powered-by')
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// motor plantilla config 
app.engine('handlebars', handlebars.engine());
app.set('views',`${config.DIRNAME}/views`);
app.set('view engine', 'handlebars');



// endpoints
app.use('/api/products/views', viewsRoutes)
app.use('/api/products',productsRoutes)
app.use('/api/users',usersRoutes)
app.use('/api/cart',cartRoutes)
app.use('/static', express.static(`${config.DIRNAME}/public`))



app.listen(config.PORT , () => {console.log(`SERVIDOR ESCUCHANDO EL PUERTO http://localhost:${config.PORT}`)
})