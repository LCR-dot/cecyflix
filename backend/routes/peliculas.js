//routes/peliculas.js
const express = require('express');
const router = express.Router();
const Pelicula = require('../models/Pelicula');
// Ruta para obtener todas las películas
router.get('/', async (req, res) => {
    try {
        const peliculas = await Pelicula.find();
        console.log('🎬 Películas recuperadas:', peliculas);
        res.json(peliculas);
    } catch (error) {
        console.error('❌ Error en Pelicula.find():', error); // <-- Esto te dará el error real en consola
        res.status(500).json({ mensaje: 'Error al obtener películas', error: error.message });

    }
});
module.exports = router;