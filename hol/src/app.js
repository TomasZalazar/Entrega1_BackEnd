import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const data = [
    {
        firstName: 'Carlos',
        lastName: 'Perren',
        age: 49,
        active: true
    },
    {
        firstName: 'Pepe',
        lastName: 'Pompin',
        age: 30,
        active: true
    },
    {
        firstName: 'Juan',
        lastName: 'Perez',
        age: 18,
        active: false
    }
];

app.get('/', async (req, res) => {
    const mensaje = data;
    res.send({ status: 200, payload: mensaje });
});

app.post('/', (req, res) => {
    const body = req.body;
    res.send({ status: 'OK', payload: body });
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto http://localhost:${PORT}`);
});