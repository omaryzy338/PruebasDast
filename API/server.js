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
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'"],          // Fallback seguro
      scriptSrc: ["'self'"],           // Solo scripts propios
      styleSrc: ["'self'"],            // Solo estilos locales, sin unsafe-inline
      imgSrc: ["'self'"],              // Solo imágenes locales
      fontSrc: ["'self'"],             // Solo fuentes locales
      connectSrc: ["'self'"],          // Solo conexiones locales
      objectSrc: ["'none'"],           // Bloquea objetos incrustados
      frameAncestors: ["'none'"],      // Anti-Clickjacking
      baseUri: ["'self'"],             // Evita redirecciones inseguras
      formAction: ["'self'"],          // Formularios solo hacia tu dominio
      scriptSrcAttr: ["'none'"],       // Bloquea atributos inline en scripts
      upgradeInsecureRequests: [],     // Fuerza HTTPS si usas recursos externos
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

// Manejador de errores 404
app.use((req, res) => {
  res.status(404).send("Ruta no encontrada");
});

// Manejador de errores 500
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Error interno del servidor");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
