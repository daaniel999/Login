const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static("public"));

// Conexión a la base de datos
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "tienda",
});

db.connect((err) => {
    if (err) {
        console.error("Error al conectar a la base de datos:", err.message);
        process.exit(1);
    }
    console.log("Conectado a MySQL");
});

// ------------------ LOGIN ------------------
app.post("/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email y contraseña son requeridos" });
    }

    const sql = "SELECT * FROM usuarios WHERE email = ? AND password = ?";
    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error("Error en la consulta:", err.message);
            return res.status(500).json({ error: "Error del servidor" });
        }

        if (results.length > 0) {
            res.json({ success: true });
        } else {
            res.json({ success: false });
        }
    });
});

// ------------------ CRUD USUARIOS ------------------

// Crear usuario
app.post("/usuarios", (req, res) => {
    const { nombre, email, password } = req.body;
    const sql = "INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)";
    db.query(sql, [nombre, email, password], (err, result) => {
        if (err) {
            console.error("Error al insertar usuario:", err.message);
            return res.status(500).json({ error: "Error al crear usuario" });
        }
        res.json({ success: true });
    });
});

// Listar usuarios
app.get("/usuarios", (req, res) => {
    const sql = "SELECT * FROM usuarios";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Error al obtener usuarios:", err.message);
            return res.status(500).json({ error: "Error al obtener usuarios" });
        }
        res.json(results);
    });
});

// Obtener usuario por ID
app.get("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const sql = "SELECT * FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error("Error al obtener usuario:", err.message);
            return res.status(500).json({ error: "Error al obtener usuario" });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }
        res.json(results[0]);
    });
});

// Actualizar usuario
app.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { nombre, email, password } = req.body;
    const sql = "UPDATE usuarios SET nombre = ?, email = ?, password = ? WHERE id = ?";
    db.query(sql, [nombre, email, password, id], (err, result) => {
        if (err) {
            console.error("Error al actualizar usuario:", err.message);
            return res.status(500).json({ error: "Error al actualizar usuario" });
        }
        res.json({ success: true });
    });
});

// Eliminar usuario
app.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM usuarios WHERE id = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar usuario:", err.message);
            return res.status(500).json({ error: "Error al eliminar usuario" });
        }
        res.json({ success: true });
    });
});

// ------------------ INICIAR SERVIDOR ------------------
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
