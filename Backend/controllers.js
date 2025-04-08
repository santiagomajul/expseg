// Controladores (controllers.js)
const db = require('./db');

// Registrar un nuevo expediente
exports.registrarExpediente = (req, res) => {
    const { fecha, numero, asunto, causante, adjunto } = req.body;
    console.log(req.body);

    // Verificar si ya existe un expediente con el mismo número
    const queryCheck = 'SELECT * FROM expedientes WHERE numero = ?';

    db.get(queryCheck, [numero], (err, row) => {
        if (err) {
            console.error('Error al verificar el expediente:', err);
            return res.status(500).json({ success: false, message: 'Error al verificar el expediente.' });
        }

        if (row) {
            return res.status(400).json({ success: false, message: 'El número de expediente ya existe.' });
        }

        // Si no existe, continuar con el registro del expediente
        const query = `INSERT INTO expedientes (fecha, numero, asunto, causante, adjunto) VALUES (?, ?, ?, ?, ?)`;

        db.run(query, [fecha, numero, asunto, causante, adjunto], function (err) {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error al registrar el expediente.' });
            }
            res.json({ success: true, id: this.lastID });
        });
    });
};

// Ruta para verificar si un expediente existe
exports.expedienteExiste = (req, res) => {
    const expedienteId = req.params.expedienteId;
    const queryCheckExpediente = 'SELECT numero FROM expedientes WHERE numero = ?';

    db.get(queryCheckExpediente, [expedienteId], (err, expediente) => {
        if (err) {
            console.error('Error al verificar el expediente:', err);
            return res.status(500).json({ exists: false });
        }
        res.json({ exists: !!expediente });
    });
};

// Ruta para registrar el movimiento (sin cambios significativos)
exports.registrarMovimiento = (req, res) => {
    const { expediente_id, oficina, nombre_recibe, fecha_movimiento, descripcion } = req.body;

    console.log('Datos recibidos en el backend:', req.body);

    const query = `INSERT INTO movimientos (expediente_id, oficina, nombre_recibe, fecha_movimiento, descripcion) 
                   VALUES (?, ?, ?, ?, ?)`;

    db.run(query, [expediente_id, oficina, nombre_recibe, fecha_movimiento, descripcion], function (err) {
        if (err) {
            console.error('Error al registrar el movimiento:', err);
            return res.status(500).json({ success: false, message: 'Error al registrar el movimiento.' });
        }

        res.json({ success: true, id: this.lastID });
    });
};


// Buscar expedientes
exports.buscarExpedientes = (req, res) => {
    const termino = `%${req.query.termino}%`;
    const query = `SELECT * FROM expedientes WHERE numero LIKE ? OR asunto LIKE ? OR causante LIKE ?`;

    db.all(query, [termino, termino, termino], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al buscar expedientes.' });
        }
        res.json(rows);
    });
};

// Listar todos los expedientes
exports.listarExpedientes = (req, res) => {
    const query = `SELECT * FROM expedientes`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al listar expedientes.' });
        }
        res.json(rows);
    });
};

// Obtener detalles de un expediente
exports.detallesExpediente = (req, res) => {
    const { id } = req.params;
    const queryExpediente = `SELECT * FROM expedientes WHERE id = ?`;
    const queryMovimientos = `SELECT * FROM movimientos WHERE expediente_id = ?`;

    db.get(queryExpediente, [id], (err, expediente) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al obtener el expediente.' });
        }

        if (!expediente) {
            return res.status(404).json({ success: false, message: 'Expediente no encontrado.' });
        }

        db.all(queryMovimientos, [id], (err, movimientos) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ success: false, message: 'Error al obtener los movimientos.' });
            }

            res.json({ success: true, expediente, movimientos });
        });
    });
};

// Controlador para buscar movimientos
exports.buscarMovimiento = (req, res) => { 
    const termino = `%${req.query.termino}%`;
    const query = `SELECT * FROM movimientos WHERE expediente_id LIKE ? OR oficina LIKE ? OR nombre_recibe LIKE ?`;

    db.all(query, [termino, termino, termino], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al buscar movimientos.' });
        }
        res.json(rows);  // Envía los datos de los movimientos encontrados
    });
};

// Controlador para listar todos los movimientos
exports.listarMovimiento = (req, res) => {
    const query = `SELECT * FROM movimientos`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Error al listar movimientos.' });
        }
        res.json(rows);  // Envía todos los movimientos
    });
};

