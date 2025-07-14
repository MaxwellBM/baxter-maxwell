const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    descripcion: {
        type: String,
        required: [true, 'La descripción es obligatoria']
    },
    precio: {
        type: Number,
        required: [true, 'El precio es obligatorio'],
        min: [0.01, 'El precio debe ser mayor a 0']
    },
    categoria: {
        type: String,
        required: [true, 'La categoría es obligatoria']
    },
    stock: {
        type: Number,
        required: [true, 'El stock es obligatorio'],
        min: [0, 'El stock no puede ser negativo']
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
});

// Exportar el modelo
module.exports = mongoose.model('Producto', productoSchema);
