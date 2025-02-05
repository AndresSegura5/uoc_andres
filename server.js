const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const PORT = 3000;
const FILE_PATH = 'expediente.txt';

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));  // 🔹 Permite servir index.html desde la misma carpeta

// Cargar asignaturas desde el archivo
app.get('/asignaturas', (req, res) => {
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        if (err) return res.status(500).send('Error al leer el archivo.');
        const subjects = data ? JSON.parse(data) : [];
        res.json(subjects);
    });
});

// Guardar una nueva asignatura
app.post('/asignaturas', (req, res) => {
    const newSubject = req.body;
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        const subjects = data ? JSON.parse(data) : [];
        subjects.push(newSubject);
        fs.writeFile(FILE_PATH, JSON.stringify(subjects, null, 2), (err) => {
            if (err) return res.status(500).send('Error al escribir en el archivo.');
            res.json({ message: 'Asignatura añadida', subjects });
        });
    });
});

// Eliminar una asignatura
app.delete('/asignaturas/:name', (req, res) => {
    const { name } = req.params;
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        let subjects = data ? JSON.parse(data) : [];
        subjects = subjects.filter(subject => subject.name !== name);
        fs.writeFile(FILE_PATH, JSON.stringify(subjects, null, 2), (err) => {
            if (err) return res.status(500).send('Error al escribir en el archivo.');
            res.json({ message: 'Asignatura eliminada', subjects });
        });
    });
});

// Actualizar una asignatura
app.put('/asignaturas/:name', (req, res) => {
    const { name } = req.params;
    const updatedSubject = req.body;
    fs.readFile(FILE_PATH, 'utf8', (err, data) => {
        let subjects = data ? JSON.parse(data) : [];
        subjects = subjects.map(subject => subject.name === name ? updatedSubject : subject);
        fs.writeFile(FILE_PATH, JSON.stringify(subjects, null, 2), (err) => {
            if (err) return res.status(500).send('Error al escribir en el archivo.');
            res.json({ message: 'Asignatura actualizada', subjects });
        });
    });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
