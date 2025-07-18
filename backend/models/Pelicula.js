const mongoose = require('mongoose');
const peliculaSchema = new mongoose.Schema({
    titulo: { type: String, required: true },
    genero: String,
    descripcion: String,
    poster: String
}, {
    collection: 'peliculas'  // Así Mongoose usará exactamente esta colección
});

//module.exports = mongoose.model('Pelicula', peliculaSchema);
module.exports = mongoose.model('Pelicula', peliculaSchema, 'peliculas');
