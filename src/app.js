// dependecias
import express from 'express'
import { config } from './config.js';
import logger from 'morgan'
import handlebars from 'express-handlebars';
import mongoose from 'mongoose';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
// routes
import cartRoutes from './routes/cart.routes.js'
import viewsRoutes from './routes/views.routes.js'
import initSocket from './socket/initSocket.js';
import productsRoutes from './routes/products.routes.js'
import usersRoutes from './routes/users.routes.js'
import chatRouter from './routes/chat.routes.js'
import cookiesRoutes from './routes/cookies.routes.js'
import authRoutes from './routes/auth.routes.js'
import initAuthStrategies from './auth/passport.strategies.js';
import sessionRoutes from './routes/session.routes.js';
// import usersRoutes from './routes/routes.users.js';
// import productsRoutes from './routes/routesFS/routes.products.js';
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
    app.use(cookieParser(config.SECRET));

    //sessions
    app.use(session({
        // store: new fileStorage({ path: './sessions', ttl: 100, retries: 0 }),
        store: MongoStore.create({ mongoUrl: config.MONGODB_URI, ttl: 600 }),
        secret: config.SECRET,
        resave: false,
        saveUninitialized: true
    }));
    // inicializar Passport y sesiones de Passport
    initAuthStrategies();
    app.use(passport.initialize())
    app.use(passport.session())
    // motor plantilla config 
    app.engine('handlebars', handlebars.engine());
    app.set('views', `${config.DIRNAME}/views`);
    app.set('view engine', 'handlebars');

    // mongoose endpoints
    app.use('/api/db/products', productsRoutes)
    app.use('/api/db/users', usersRoutes)
    app.use('/api/db/chat', chatRouter);
    app.use('/api/db/cart', cartRoutes)
    app.use('/api/cookies', cookiesRoutes)
    app.use('/api/auth', authRoutes)
    app.use('/api/session', sessionRoutes)
    // views    
    app.use('/', viewsRoutes)


    // endpoints FS
    // app.use('/api/products', productsRoutes)
    // app.use('/api/users', usersRoutes)
    app.use('/static', express.static(`${config.DIRNAME}/public`))

});



