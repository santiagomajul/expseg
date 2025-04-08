// Configuración de base de datos (db.js)
const sqlite3 = require('sqlite3').verbose();  // Importar sqlite3
const db = new sqlite3.Database('expedientes.db');

// Crear tablas si no existen
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS expedientes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        fecha TEXT NOT NULL,
        numero TEXT NOT NULL,
        asunto TEXT NOT NULL,
        causante TEXT NOT NULL,
        adjunto TEXT
    )`);

    db.run(`CREATE TABLE IF NOT EXISTS movimientos (
        id_movimiento INTEGER PRIMARY KEY AUTOINCREMENT,
        expediente_id INTEGER NOT NULL,
        nombre_recibe TEXT NOT NULL,
        fecha_movimiento TEXT NOT NULL,
        descripcion TEXT NOT NULL,
        FOREIGN KEY (expediente_id) REFERENCES expedientes(id)
    )`);
});

module.exports = db;