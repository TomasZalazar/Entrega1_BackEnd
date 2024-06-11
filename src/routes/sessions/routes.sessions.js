import { Router } from 'express';
import UserModel from '../../dao/models/users.model.js';
import { config } from '../../config.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import UserManager from '../../dao/usersManager.mdb.js';
import { createHash, isValidPassword, verifyRequiredBody } from '../../utils.js';
import passport from 'passport';

const router = Router();
const userManager = new UserManager(UserModel);

router.get('/hash/:password', async (req, res) => {
    res.status(200).send({ origin: config.SERVER, payload: createHash(req.params.password) });
});



// Ruta de registro
router.post('/register', verifyRequiredBody(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const foundUser = await UserModel.findOne({ email: email });

        if (!foundUser) {
            const process = await userManager.add({
                firstName,
                lastName,
                email,
                password: createHash(password),
                role: 'user'
            });

            if (process.status === 201) {
                return res.redirect('/profile');
            }
            res.status(200).send({ origin: config.SERVER, payload: process });
        } else {
            res.status(400).send({ origin: config.SERVER, payload: 'El email ya se encuentra registrado' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

// Ruta de login
router.post('/login', verifyRequiredBody(['email', 'password']), async (req, res) => {
    try {
        const { email, password } = req.body;
        const foundUser = await UserModel.findOne({ email: email });

        if (foundUser && isValidPassword(password, foundUser.password)) {
            const { password, ...filteredFoundUser } = foundUser.toObject(); // Convertir a objeto plano
            req.session.user = filteredFoundUser;
            req.session.save(err => {
                if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

                res.redirect('/realtimeproducts');
            });
        } else {
            res.status(401).send({ origin: config.SERVER, payload: 'Datos de acceso no válidos' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

// Ruta de login con Passport
router.post('/pplogin', verifyRequiredBody(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ origin: config.SERVER, payload: 'Autenticación fallida' });
        }

        req.session.user = req.user;
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});


// Endpoint para autenticación aplicando Passport contra servicio externo (Github).
// Probar también otros servicios como Google, Facebook, Microsoft.
// Este endpoint va VACIO, es al cual apuntamos desde la plantilla
// y solo se encarga de redireccionar al servicio externo
router.get('/ghlogin', passport.authenticate('ghlogin', {scope: ['user']}), async (req, res) => {
});

// Endpoint al cual retorna Github luego de completar su proceso de autenticación.
// Aquí nos llegará un profile del usuario (si se autenticó correctamente), o se
// redireccionará al failureRedirect
router.get('/ghlogincallback', passport.authenticate('ghlogin', {failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}`}), async (req, res) => {
    try {
        req.session.user = req.user // req.user es inyectado AUTOMATICAMENTE por Passport al parsear el done()
        console.log(req.session.user)
        req.session.save(err => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        
            res.redirect('/profile');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
router.get('/private', adminAuth, async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, error: err.message });
    }
});

router.get('/logout', async (req, res) => {
    try {
        req.session.destroy((err) => {
            if (err) return res.status(500).send({ origin: config.SERVER, payload: 'Error al ejecutar logout', error: err });
            res.redirect('/login');
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

export default router;
