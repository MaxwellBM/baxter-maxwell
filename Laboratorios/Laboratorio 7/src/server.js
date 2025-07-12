const fastify = require('fastify')({ 
    logger: true
});
const path = require('path');

// Registrar CORS
fastify.register(require('@fastify/cors'), {
    origin: '*', // Permitir todos los orígenes, o cámbialo por el específico si lo prefieres
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'] 
});


// Servir archivos estáticos
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '../public'),
    prefix: '/'
});

// Registrar rutas
fastify.register(require('./routes/productos'), { prefix: '/api' });

// Ruta raíz
fastify.get('/', async (request, reply) => {
    return { 
        message: 'API de Productos',
        endpoints: [
            'GET /api/productos',
            'GET /api/productos/:id', 
            'POST /api/productos',
            'PUT /api/productos/:id',
            'DELETE /api/productos/:id',
            'GET /api/productos/buscar/:termino',
            'GET /api/productos/categoria/:categoria',
            'GET /api/productos/stock-bajo/:limite'
        ]
    };
});

// Ruta de salud
fastify.get('/health', async (request, reply) => {
    return {
        status: 'OK',
        uptime: process.uptime()
    };
});

// Manejo de errores global
fastify.setErrorHandler((error, request, reply) => {
    fastify.log.error(error);
    reply.code(error.statusCode || 500);
    return { error: 'Error interno del servidor' };
});

// Manejo de rutas no encontradas
fastify.setNotFoundHandler((request, reply) => {
    reply.code(404);
    return { error: 'Ruta no encontrada' };
});

// Iniciar el servidor
const start = async () => {
    try {
        const port = process.env.PORT || 3000;
        await fastify.listen({ port, host: '0.0.0.0' });
        console.log(`Servidor corriendo en puerto ${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

// Manejo de señales para cierre graceful
process.on('SIGINT', () => {
    fastify.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});

start(); 