const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// 🔒 Seguridad con Helmet
app.use(helmet());

// Configuración personalizada de CSP (Content Security Policy)
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],          // Evita recursos externos
      scriptSrc: ["'self'"],           // Bloquea scripts externos
      styleSrc: ["'self'"],            // Evita style-src unsafe-inline
      objectSrc: ["'none'"],           // Bloquea objetos incrustados
      frameAncestors: ["'none'"],      // Anti-Clickjacking
    },
  })
);

// Deshabilitar encabezado X-Powered-By
app.disable('x-powered-by');

// Rutas públicas
app.get('/', (req, res) => {
  res.send("Bienvenido a la API de PruebasDast con cabeceras seguras");
});

// Middleware de autenticación básica
const USER = "admin";
const PASS = "1234";

function authMiddleware(req, res, next) {
  const { user, pass } = req.headers;
  if (user === USER && pass === PASS) {
    next();
  } else {
    res.status(401).json({ error: "Acceso denegado: credenciales inválidas" });
  }
}

// Rutas protegidas
app.get('/datos', authMiddleware, (req, res) => {
  res.json({ mensaje: "Accediste con GET a datos protegidos" });
});

app.post('/datos', authMiddleware, (req, res) => {
  res.json({ mensaje: "Accediste con POST a datos protegidos", datos: req.body });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
