const ProductoService = require('../models/ProductoService');
const productoService = new ProductoService();

// Esquema de validación para Fastify
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
            const productos = await productoService.obtenerTodos();
            reply.send({ productos, total: productos.length });
        } catch (error) {
            reply.code(500).send({ error: 'Error al obtener productos' });
        }
    });

    // Obtener producto por ID
    fastify.get('/productos/:id', async (request, reply) => {
        try {
            const producto = await productoService.obtenerPorId(request.params.id);
            if (!producto) {
                return reply.code(404).send({ error: 'Producto no encontrado' });
            }
            reply.send({ producto });
        } catch (error) {
            reply.code(500).send({ error: 'Error al obtener producto' });
        }
    });

    // Crear nuevo producto
    fastify.post('/productos', { schema: { body: productoSchema } }, async (request, reply) => {
        try {
            const nuevoProducto = await productoService.crear(request.body);
            reply.code(201).send({ producto: nuevoProducto });
        } catch (error) {
            reply.code(400).send({ error: error.message || 'Error al crear producto' });
        }
    });

    // Actualizar producto
    fastify.put('/productos/:id', { schema: { body: productoSchema } }, async (request, reply) => {
        try {
            const productoActualizado = await productoService.actualizar(request.params.id, request.body);
            reply.send({ producto: productoActualizado });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                reply.code(404).send({ error: error.message });
            } else {
                reply.code(400).send({ error: error.message || 'Error al actualizar producto' });
            }
        }
    });

    // Eliminar producto
    fastify.delete('/productos/:id', async (request, reply) => {
        try {
            const productoEliminado = await productoService.eliminar(request.params.id);
            reply.send({ producto: productoEliminado });
        } catch (error) {
            if (error.message === 'Producto no encontrado') {
                reply.code(404).send({ error: error.message });
            } else {
                reply.code(500).send({ error: error.message || 'Error al eliminar producto' });
            }
        }
    });

    // Buscar productos
    fastify.get('/productos/buscar/:termino', async (request, reply) => {
        try {
            const productos = await productoService.buscar(request.params.termino);
            reply.send({ productos, total: productos.length });
        } catch (error) {
            reply.code(500).send({ error: 'Error al buscar productos' });
        }
    });

    // Filtrar por categoría
    fastify.get('/productos/categoria/:categoria', async (request, reply) => {
        try {
            const productos = await productoService.obtenerPorCategoria(request.params.categoria);
            reply.send({ productos, total: productos.length });
        } catch (error) {
            reply.code(500).send({ error: 'Error al obtener productos por categoría' });
        }
    });

    // Productos con stock bajo
    fastify.get('/productos/stock-bajo/:limite?', async (request, reply) => {
        try {
            const limite = parseInt(request.params.limite) || 10;
            const productos = await productoService.obtenerStockBajo(limite);
            reply.send({ productos, total: productos.length });
        } catch (error) {
            reply.code(500).send({ error: 'Error al obtener productos con stock bajo' });
        }
    });
}

module.exports = routes;
