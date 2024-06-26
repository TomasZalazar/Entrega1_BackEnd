// session.routes.js
import express from 'express';
import passport from 'passport';
import { verifyToken } from '../utils.js'; // Asegúrate de que la ruta a utils.js sea correcta

const router = express.Router();

// Ruta para obtener el usuario actual basado en el token JWT de la cookie
router.get('/current', verifyToken, async (req, res) => {
    try {
        res.json({ user: req.user }); // Devuelve el usuario actual extraído del token JWT
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;