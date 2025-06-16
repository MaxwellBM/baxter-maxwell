// routes/fibonacci.js
export default async function (fastify, options) {
  function generarFibonacci(n) {
    const serie = [];
    for (let i = 0; i < n; i++) {
      if (i === 0) serie.push(0);
      else if (i === 1) serie.push(1);
      else serie.push(serie[i - 1] + serie[i - 2]);
    }
    return serie;
  }

  fastify.get('/fibonacci/:n', (request, reply) => {
    const n = parseInt(request.params.n);
    if (isNaN(n) || n < 1) {
      return reply.status(400).send({ error: 'El valor debe ser un número entero positivo' });
    }
    return reply.send(generarFibonacci(n));
  });
}
