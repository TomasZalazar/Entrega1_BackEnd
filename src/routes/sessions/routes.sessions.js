import { Router } from 'express';
import UserModel from '../../dao/models/users.model.js';
import { config } from '../../config.js';
import { adminAuth } from '../../middleware/adminAuth.js';
import UserManager from '../../dao/usersManager.mdb.js';

const router = Router();
const userManager = new UserManager(UserModel);

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        
        
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).send({ error: 'Todos los campos son requeridos' });
        }
        
       
        const existingUser = await UserModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ origin: config.SERVER, error: 'El email ya está registrado' });
        }
        
        console.log(req.body);
        
      
        const newUser = {
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            role: role || 'user' 
        };

       
        const result = await userManager.add(newUser);
        
        
        if (result.status === 201) { 
            return res.redirect('/profile');
        }

       
        res.status(result.status).send(result);
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, error: err.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
       
        const user = await UserModel.findOne({ email: email });
        if (!user || user.password !== password) {
            return res.redirect('/register');
        }
        
        req.session.user = { 
            firstName: user.firstName, 
            lastName: user.lastName, 
            email: user.email, 
            role: user.role 
        };
        res.redirect('/realtimeproducts');
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
