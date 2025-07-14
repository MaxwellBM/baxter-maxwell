const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

async function routes(fastify, options) {
  // Crear PaymentIntent
  fastify.post('/ordenes/pago', async (request, reply) => {
    const { amount } = request.body;

    if (!amount || typeof amount !== 'number') {
      return reply.code(400).send({ error: 'El campo "amount" es requerido y debe ser numérico' });
    }

    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount), // Stripe trabaja con centavos
        currency: 'usd',
        automatic_payment_methods: { enabled: true }
      });

      return reply.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      request.log.error(error);
      reply.code(500).send({ error: 'Error al crear el payment intent' });
    }
  });
}

module.exports = routes;
