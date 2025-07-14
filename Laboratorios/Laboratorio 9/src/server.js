require('dotenv').config();
const fastify = require('fastify')({ 
    logger: true
});
const path = require('path');
const mongoose = require('mongoose');

//  Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/laboratorio9', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(async () => {
    console.log(' Conectado a MongoDB');
    // Cargar productos por defecto si la colección está vacía
    const Producto = require('./models/Producto');
    const count = await Producto.countDocuments();
    if (count === 0) {
        await Producto.insertMany([
            { nombre: 'Mouse Inalámbrico', descripcion: 'Mouse ergonómico con conexión Bluetooth', precio: 299, categoria: 'Accesorios', stock: 15 },
            { nombre: 'Teclado Mecánico', descripcion: 'Teclado retroiluminado RGB', precio: 899, categoria: 'Accesorios', stock: 8 },
            { nombre: 'Monitor 24"', descripcion: 'Monitor Full HD para oficina y gaming', precio: 2499, categoria: 'Electrónicos', stock: 5 },
            { nombre: 'Camiseta Deportiva', descripcion: 'Camiseta transpirable para ejercicio', precio: 199, categoria: 'Ropa', stock: 20 },
            { nombre: 'Botella Térmica', descripcion: 'Mantiene tu bebida fría o caliente', precio: 150, categoria: 'Deportes', stock: 12 },
            { nombre: 'Lámpara LED', descripcion: 'Lámpara de escritorio con luz regulable', precio: 350, categoria: 'Hogar', stock: 10 },
            { nombre: 'Audífonos Bluetooth', descripcion: 'Sonido envolvente y batería de larga duración', precio: 599, categoria: 'Electrónicos', stock: 7 },
            { nombre: 'Mochila Urbana', descripcion: 'Mochila resistente al agua para laptop', precio: 499, categoria: 'Otros', stock: 9 }
        ]);
        console.log('Productos de ejemplo insertados automáticamente.');
    }
})
.catch(err => {
    console.error(' Error al conectar a MongoDB:', err);
    process.exit(1);
});

// 🌐 CORS
fastify.register(require('@fastify/cors'), {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
});

//  Archivos estáticos
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/'
});

//  Rutas de productos
fastify.register(require('./routes/productos'), { prefix: '/api' });

//  Rutas de órdenes
fastify.register(require('./routes/ordenes'), { prefix: '/api' });

//  Ruta raíz
fastify.get('/', async (request, reply) => {
    return { 
        message: 'API de Productos y Compras',
        endpoints: [
            'GET /api/productos',
            'GET /api/productos/:id', 
            'POST /api/productos',
            'PUT /api/productos/:id',
            'DELETE /api/productos/:id',
            'GET /api/productos/buscar/:termino',
            'GET /api/productos/categoria/:categoria',
            'GET /api/productos/stock-bajo/:limite',
            'POST /api/ordenes',
            'GET /api/ordenes',
            'GET /api/ordenes/:id',
            'PUT /api/ordenes/:id/estado',
            'POST /api/ordenes/:id/payment-intent',
            'POST /api/ordenes/confirmar-pago',
            'GET /api/ordenes/estado/:estado',
            'GET /api/ordenes/cliente/:email',
            'DELETE /api/ordenes/:id',
            'GET /api/ordenes/estadisticas',
            'POST /api/webhook/stripe'
        ]
    };
});

//  Ruta de salud
fastify.get('/health', async (request, reply) => {
    return {
        status: 'OK',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    };
});

//  Manejo de errores
fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.code(error.statusCode || 500);
    return { error: 'Error interno del servidor' };
});

//  Rutas no encontradas
fastify.setNotFoundHandler((request, reply) => {
    reply.code(404);
    return { error: 'Ruta no encontrada' };
});

//  Iniciar servidor
const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(` Servidor corriendo en puerto ${port}`);
        console.log(` Ambiente: ${process.env.NODE_ENV || 'development'}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

// 🧹 Cierre graceful
process.on('SIGINT', () => {
    fastify.close(() => {
        console.log(' Servidor cerrado');
        process.exit(0);
    });
});

start();
