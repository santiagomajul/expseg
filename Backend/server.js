// Servidor principal (server.js)
const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');
const cors = require('cors'); // Importar cors
const app = express();
const PORT = 3000;

app.use(cors()); // Habilitar CORS para permitir peticiones desde el frontend

// Middlewares
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Rutas
app.use(routes);

// Servidor en marcha
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});