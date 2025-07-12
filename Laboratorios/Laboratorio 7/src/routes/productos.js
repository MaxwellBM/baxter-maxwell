const ProductoService = require('../models/ProductoService');
const productoService = new ProductoService();

// Esquema de validación
const productoSchema = {
    type: 'object',
    properties: {
        nombre: { type: 'string' },
        descripcion: { type: 'string' },
        precio: { type: 'number' },
        categoria: { type: 'string' },
        stock: { type: 'integer' }
    },
    required: ['nombre', 'descripcion', 'precio', 'categoria', 'stock']
};

async function routes(fastify, options) {

    // Obtener todos los productos
    fastify.get('/productos', async (request, reply) => {
        try {
            const productos = productoService.obtenerTodos();
            reply.send({ productos, total: productos.length });
        } catch (error) {
            reply.code(500).send({ error: 'Error al obtener productos' });
        }
    });

    // Obtener producto por ID
    fastify.get('/productos/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const producto = productoService.obtenerPorId(id);
            if (!producto) {
                reply.code(404).send({ error: 'Producto no encontrado' });
            } else {
                reply.send({ producto });
            }
        } catch (error) {
            reply.code(500).send({ error: 'Error al obtener producto' });
        }
    });

    // Crear nuevo producto
    fastify.post('/productos', { schema: { body: productoSchema } }, async (request, reply) => {
        try {
            const nuevoProducto = productoService.crear(request.body);
            reply.code(201).send({ producto: nuevoProducto });
        } catch (error) {
            reply.code(400).send({ error: error.message || 'Error al crear producto' });
        }
    });

    // Actualizar producto
    fastify.put('/productos/:id', { schema: { body: productoSchema } }, async (request, reply) => {
        try {
            const { id } = request.params;
            const productoActualizado = productoService.actualizar(id, request.body);
            reply.send({ producto: productoActualizado });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                reply.code(404).send({ error: 'Producto no encontrado' });
            } else {
                reply.code(400).send({ error: error.message || 'Error al actualizar producto' });
            }
        }
    });

    // Eliminar producto
    fastify.delete('/productos/:id', async (request, reply) => {
        try {
            const { id } = request.params;
            const productoEliminado = productoService.eliminar(parseInt(id)); 
            reply.send({ producto: productoEliminado });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                reply.code(404).send({ error: 'Producto no encontrado' });
            } else {
                reply.code(500).send({ error: error.message || 'Error al eliminar producto' });
            }
        }
    });


    // Buscar productos
    fastify.get('/productos/buscar/:termino', async (request, reply) => {
        try {
            const { termino } = request.params;
            const productos = productoService.buscar(termino);
            reply.send({ productos, total: productos.length });
        } catch (error) {
            reply.code(500).send({ error: 'Error al buscar productos' });
        }
    });

    // Filtrar por categoría
    fastify.get('/productos/categoria/:categoria', async (request, reply) => {
        try {
            const { categoria } = request.params;
            const productos = productoService.obtenerPorCategoria(categoria);
            reply.send({ productos, total: productos.length });
        } catch (error) {
            reply.code(500).send({ error: 'Error al obtener productos por categoría' });
        }
    });

    // Productos con stock bajo
    fastify.get('/productos/stock-bajo/:limite?', async (request, reply) => {
        try {
            const { limite } = request.params;
            const productos = productoService.obtenerStockBajo(limite ? parseInt(limite) : 10);
            reply.send({ productos, total: productos.length });
        } catch (error) {
            reply.code(500).send({ error: 'Error al obtener productos con stock bajo' });
        }
    });
}

module.exports = routes;
