import { config } from "../config.js";


 
 export const adminAuth = (req, res, next) => {
    if (!req.session.user || req.session.user.role !== 'admin')
        // Si no existe el objeto req.session.user o el role no es admin
        return res.status(401).send({ origin: config.SERVER, payload: 'Acceso no autorizado: se requiere autenticación y nivel de admin' });

    next();
}