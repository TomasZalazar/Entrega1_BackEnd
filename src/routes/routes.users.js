import { Router } from "express";
import { dataUser } from '../data.js';
const routerUsers = Router()

routerUsers.get('/', async (req, res) => {
    const { limit } = req.query
    try {
        const usuario = await dataUser
        if (limit > 0) {
            const userlice = usuario.slice(0, parseInt(limit))
            res.status(200).send({ status: 200, payload: userlice })
        } else {
            res.status(200).send({ status: 200, payload: usuario })
        }

    } catch (err) {
        res.status(500).send({ status: 500, error: 'Error al obtener el usuario' })
    }

})
routerUsers.get('/uid', async (req, res) => {
    const { uid } = req.params
    try {
        const usuario = dataUser.find((usuario) => usuario.id === parseInt(uid))
        if (usuario) {
            res.status(200).send({ status: 200, payload: usuario })
        } else {
            res.status(404).send({ status: 404, error: 'Usuario no encontrado' })
        }
    } catch (err) {
        res.status(500).send({ status: 500, error: 'Error al obtener el usuario' })
    }
})

export default routerUsers