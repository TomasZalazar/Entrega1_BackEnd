// dependecias
import express from 'express'
import { config } from './config.js';
import logger from 'morgan'
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
// routes
import productsRoutes from './routes/routesFS/routes.products.js';
import cartRoutesMDB from './routes/routesDB/routes.cart.db.js'
import viewsRoutes from './routes/routes.views.js'
// import usersRoutes from './routes/routes.users.js';
import initSocket from './config/socket/initSocket.js';
import productsRoutesMDB from './routes/routesDB/routes.products.db.js'
import usersRoutesMDB from './routes/routesDB/routes.users.db.js'
import chatRouterMDB from './routes/routesDB/routes.chat.db.js'
const app = express()

const expressInstance = app.listen(config.PORT, async () => {
    await mongoose.connect(config.MONGODB_URI)
    console.log(`Servidor escuchando en el puerto http://localhost:${config.PORT} enlazada en bbdd`)
    console.log(config.DIRNAME);


    const socketServer = initSocket(expressInstance);
    app.set('socketServer', socketServer);


    //configuracion del server
    app.use(logger('dev'))
    app.disable('x-powered-by')
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // motor plantilla config 
    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    // mongoose endpoints
    app.use('/api/db/products', productsRoutesMDB)
    app.use('/api/db/users', usersRoutesMDB) 
    app.use('/api/db/chat', chatRouterMDB);
    app.use('/api/db/cart', cartRoutesMDB)
    
    // views    
    app.use('/', viewsRoutes)


    // endpoints FS
    app.use('/api/products', productsRoutes)
    // app.use('/api/users', usersRoutes)
    app.use('/static', express.static(`${config.DIRNAME}/public`))

});



