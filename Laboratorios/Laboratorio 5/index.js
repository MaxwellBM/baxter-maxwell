import Fastify from 'fastify';
import fibonacciRoutes from './routes/fibonacci.js';

const fastify = Fastify({ logger: true });

fastify.register(fibonacciRoutes);

fastify.listen({ port: 3000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Servidor corriendo en ${address}`);
});
