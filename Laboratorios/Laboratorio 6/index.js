import Fastify from 'fastify';
import productosRoutes from './routes/productos.js';

const fastify = Fastify({ logger: true });

fastify.register(productosRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Servidor activo en ${address}`);
});
