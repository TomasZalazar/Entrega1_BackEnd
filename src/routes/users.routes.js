import { Router } from 'express';
import UserManager from '../dao/usersManager.mdb.js';
import userModel from '../dao/models/users.model.js';
import { config } from '../config.js';
import { adminAuth } from '../middleware/adminAuth.js';

const router = Router();
const userManager = new UserManager(userModel);

router.get('/aggregate/:role', adminAuth, async (req, res) => {
    try {
        if (req.params.role === 'admin' || req.params.role === 'premium' || req.params.role === 'user') {
            const match = { role: req.params.role };
            const sort = { totalGrade: -1 };
            const process = await userManager.getAggregated(match,  sort);

            res.status(200).send({ origin: config.SERVER, payload: process });
        } else {
            res.status(200).send({ origin: config.SERVER, payload: null, error: 'role: solo se acepta admin, premium o user' });
        }
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/paginate/:page/:limit', async (req, res) => {
    try {
        const filter = { role: 'admin' };
        const options = { page: req.params.page, limit: req.params.limit, sort: { lastName: 1 } };
        const process = await userManager.getPaginated(filter, options);

        res.status(200).send({ origin: config.SERVER, payload: process });
    } catch (err) {
        res.status(500).send({ origin: config.SERVER, payload: null, error: err.message });
    }
});

router.get('/', async (req, res) => {
    const result = await userManager.getAll();
    res.status(result.status).send(result.payload || { error: result.error });
});

router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await userManager.getById(id);
    res.status(result.status).send(result.payload || { error: result.error });
});

router.post('/create', async (req, res) => {
    try {
        const { firstName, lastName, email, password, role } = req.body;
        

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).send({ error: 'Todos los campos requeridos deben estar presentes.' });
        }

        const existingUser = await userModel.findOne({ email: email });
        if (existingUser) {
            return res.status(400).send({ error: 'El correo electrónico ya está registrado.' });
        }


        const newUser = new userModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password,
            role: role || 'user'
        });


        await newUser.save();


        res.redirect('/profile');
    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).send({ error: 'Error al registrar usuario.' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    const result = await userManager.update(id, updatedUser);
    res.status(result.status).send(result.payload || { error: result.error });
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const result = await userManager.delete(id);
    res.status(result.status).send(result.payload || { error: result.error });
});

export default router;