import { Router } from 'express';
import UserManager from '../../dao/usersManager.mdb.js';
import UserModel from '../../dao/models/users.model.js';

const router = Router();
const userManager = new UserManager(UserModel);


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
    const { firstName, lastName, email, password, role } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).send({ error: 'Todos los campos requeridos deben estar presentes.' });
    }

    const newUser = {
        firstName,
        lastName,
        email,
        password,
        role: role || 'user'
    };

    const result = await userManager.add(newUser);
    res.status(result.status).send(result.payload || { error: result.error });
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