const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para parsear JSON
app.use(bodyParser.json());

// Credenciales simples (solo ejemplo, no usar en producción)
const USER = "admin";
const PASS = "1234";

// Middleware de autenticación básica
function authMiddleware(req, res, next) {
    const { user, pass } = req.headers;

    if (user === USER && pass === PASS) {
        next();
    } else {
        res.status(401).json({ error: "Acceso denegado: credenciales inválidas" });
    }
}

// Rutas públicas
app.get('/', (req, res) => {
    res.send("Bienvenido a la API de PruebasDast");
});

// Rutas protegidas
app.get('/datos', authMiddleware, (req, res) => {
    res.json({ mensaje: "Accediste con GET a datos protegidos" });
});

app.post('/datos', authMiddleware, (req, res) => {
    const body = req.body;
    res.json({ mensaje: "Accediste con POST a datos protegidos", datos: body });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
