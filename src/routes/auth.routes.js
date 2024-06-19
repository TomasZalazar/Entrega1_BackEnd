import { Router } from 'express';
import { config } from '../config.js';
import { adminAuth, verifyAuthorization } from '../middleware/adminAuth.js';
import { createHash, verifyRequiredBody, createToken, verifyToken } from '../utils.js';

import passport from 'passport';
import { passportCall } from '../auth/passport.strategies.js';

const router = Router();


router.get('/hash/:password', async (req, res) => {
    res.status(200).send({ origin: config.SERVER, payload: createHash(req.params.password) });
});



// // Ruta de registro
// router.post('/register', verifyRequiredBody(['firstName', 'lastName', 'email', 'password']), async (req, res) => {
//     try {
//         const { firstName, lastName, email, password } = req.body;
//         const foundUser = await UserModel.findOne({ email: email });

//         if (!foundUser) {
//             const process = await userManager.add({
//                 firstName,
//                 lastName,
//                 email,
//                 password: createHash(password),
//                 role: 'user'
//             });

//             if (process.status === 201) {
//                 return res.redirect('/profile');
//             }
//             res.status(200).send({ origin: config.SERVER, payload: process });
//         } else {
//             res.status(400).send({ origin: config.SERVER, payload: 'El email ya se encuentra registrado' });
//         }
//     } catch (err) {
//         res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
//     }
// });
router.post('/register', verifyRequiredBody(['firstName', 'lastName', 'email', 'password']),
    passport.authenticate('register', {
        successRedirect: '/realtimeproducts',
        failureRedirect: `/register?error=El%20usuario%20ya%20existe`
    })
);
// Ruta de login con Passport
router.post('/login', verifyRequiredBody(['email', 'password']),
    passport.authenticate('login', {
        successRedirect: '/realtimeproducts',
        failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}`
    }));
// Ruta de login con Passport
router.post('/pplogin', verifyRequiredBody(['email', 'password']),
    passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }),
    async (req, res) => {
        try {
            if (!req.user) {
                return res.status(401).send({ origin: config.SERVER, payload: 'Autenticación fallida' });
            }

            req.session.user = req.user;
            req.session.save(err => {
                if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

                res.redirect('/realtimeproducts');
            });
        } catch (err) {
            res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
        }
    });



router.get('/ghlogin',
    passport.authenticate('ghlogin', { scope: ['user'] }), async (req, res) => {
    });


router.get('/ghlogincallback',
    passport.authenticate('ghlogin',
        { failureRedirect: `/login?error=${encodeURI('Error al identificar con Github')}` }), async (req, res) => {
            try {
                req.session.user = req.user // req.user es inyectado AUTOMATICAMENTE por Passport al parsear el done()

                req.session.save(err => {
                    if (err) return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });

                    res.redirect('/realtimeproducts');
                });
            } catch (err) {
                res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
            }
        });


// Endpoint autenticación con Passport contra base de datos propia y jwt
router.post('/jwtlogin', verifyRequiredBody(['email', 'password']), passport.authenticate('login', { failureRedirect: `/login?error=${encodeURI('Usuario o clave no válidos')}` }), async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ origin: config.SERVER, payload: 'Autenticación fallida' });
        }

        // Crear el token
        const token = createToken(req.user, '1h');
        res.cookie(`${config.APP_NAME}_cookie`, token, { maxAge: 60 * 60 * 1000, httpOnly: true });

        // Guardar la sesión antes de redirigir
        req.session.user = req.user;
        req.session.save(err => {
            if (err) {
                return res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
            }

            res.redirect('/realtimeproducts'); // Redirigir después de guardar la sesión
        });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});
router.get('/private', verifyToken, verifyAuthorization('admin'), async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, error: err.message });
    }
});
router.get('/ppadmin', passportCall('jwtlogin'), verifyAuthorization('admin'), async (req, res) => {
    try {
        res.status(200).send({ origin: config.SERVER, payload: 'Bienvenido ADMIN!' });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
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
