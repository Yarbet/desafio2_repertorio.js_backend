const express = require('express');
const fs = require('fs');
const app = express();
const PORT = 3000;

app.use(express.json());

// Leer las canciones
app.get('/canciones', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    res.json(canciones);
});

// Agregar una nueva canción
app.post('/canciones', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    const nuevaCancion = req.body;
    canciones.push(nuevaCancion);
    fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2));
    res.status(201).json({ mensaje: 'Canción agregada con éxito', nuevaCancion });
});

// Editar una canción existente
app.put('/canciones/:id', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    const id = req.params.id;
    const index = canciones.findIndex(cancion => cancion.id == id);

    if (index !== -1) {
        canciones[index] = { ...canciones[index], ...req.body };
        fs.writeFileSync('repertorio.json', JSON.stringify(canciones, null, 2));
        res.json({ mensaje: 'Canción actualizada con éxito', cancionActualizada: canciones[index] });
    } else {
        res.status(404).json({ mensaje: 'Canción no encontrada' });
    }
});

// Eliminar una canción
app.delete('/canciones/:id', (req, res) => {
    const canciones = JSON.parse(fs.readFileSync('repertorio.json', 'utf8'));
    const id = req.params.id;
    const nuevasCanciones = canciones.filter(cancion => cancion.id != id);

    if (canciones.length === nuevasCanciones.length) {
        return res.status(404).json({ mensaje: 'Canción no encontrada' });
    }

    fs.writeFileSync('repertorio.json', JSON.stringify(nuevasCanciones, null, 2));
    res.json({ mensaje: 'Canción eliminada con éxito' });
});

// Servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
