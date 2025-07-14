const mongoose = require('mongoose');

const itemOrdenSchema = new mongoose.Schema({
    producto: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Producto',
        required: true
    },
    nombre: {
        type: String,
        required: true
    },
    precio: {
        type: Number,
        required: true
    },
    cantidad: {
        type: Number,
        required: true,
        min: 1
    },
    subtotal: {
        type: Number,
        required: true
    }
});

const ordenSchema = new mongoose.Schema({
    items: [itemOrdenSchema],
    total: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'pagada', 'cancelada', 'enviada', 'entregada'],
        default: 'pendiente'
    },
    metodoPago: {
        type: String,
        enum: ['stripe', 'efectivo'],
        default: 'stripe'
    },
    stripePaymentIntentId: {
        type: String
    },
    cliente: {
        nombre: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        telefono: {
            type: String
        },
        direccion: {
            calle: String,
            ciudad: String,
            codigoPostal: String,
            pais: String
        }
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    },
    fechaPago: {
        type: Date
    },
    fechaEnvio: {
        type: Date
    },
    fechaEntrega: {
        type: Date
    },
    notas: {
        type: String
    }
});

// Método para calcular el total de la orden
ordenSchema.methods.calcularTotal = function() {
    this.total = this.items.reduce((sum, item) => sum + item.subtotal, 0);
    return this.total;
};

// Método para agregar un item a la orden
ordenSchema.methods.agregarItem = function(producto, cantidad) {
    const subtotal = producto.precio * cantidad;
    this.items.push({
        producto: producto._id,
        nombre: producto.nombre,
        precio: producto.precio,
        cantidad: cantidad,
        subtotal: subtotal
    });
    this.calcularTotal();
};

// Método para actualizar el stock de productos
ordenSchema.methods.actualizarStock = async function() {
    const Producto = mongoose.model('Producto');
    
    for (const item of this.items) {
        const producto = await Producto.findById(item.producto);
        if (producto) {
            producto.stock -= item.cantidad;
            await producto.save();
        }
    }
};

// Middleware para validar stock antes de guardar
ordenSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('items')) {
        const Producto = mongoose.model('Producto');
        
        for (const item of this.items) {
            const producto = await Producto.findById(item.producto);
            if (!producto) {
                return next(new Error(`Producto ${item.nombre} no encontrado`));
            }
            if (producto.stock < item.cantidad) {
                return next(new Error(`Stock insuficiente para ${item.nombre}. Disponible: ${producto.stock}`));
            }
        }
    }
    next();
});

module.exports = mongoose.model('Orden', ordenSchema); 