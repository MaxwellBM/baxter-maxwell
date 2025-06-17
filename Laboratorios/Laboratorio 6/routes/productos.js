// routes/productos.js

let productos = [
  { id: 1, nombre: "Laptop", precio: 800, categoria: "Electrónica" },
  { id: 2, nombre: "Silla", precio: 50, categoria: "Hogar" }
];

let nextId = 3;

export default async function (fastify, options) {

  // GET /productos
  fastify.get('/productos', (req, reply) => {
    reply.send(productos);
  });

  // GET /productos/:id
  fastify.get('/productos/:id', (req, reply) => {
    const id = parseInt(req.params.id);
    const producto = productos.find(p => p.id === id);
    if (!producto) return reply.status(404).send({ error: 'Producto no encontrado' });
    reply.send(producto);
  });

  // POST /productos
  fastify.post('/productos', (req, reply) => {
    const { nombre, precio, categoria } = req.body;

    if (!nombre || !precio || !categoria) {
      return reply.status(400).send({ error: 'Faltan campos requeridos' });
    }

    const nuevo = { id: nextId++, nombre, precio, categoria };
    productos.push(nuevo);
    reply.code(201).send(nuevo);
  });

  // PUT /productos/:id
  fastify.put('/productos/:id', (req, reply) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return reply.status(404).send({ error: 'Producto no encontrado' });

    const { nombre, precio, categoria } = req.body;
    if (!nombre || !precio || !categoria) {
      return reply.status(400).send({ error: 'Faltan campos requeridos' });
    }

    productos[index] = { id, nombre, precio, categoria };
    reply.send(productos[index]);
  });

  // DELETE /productos/:id
  fastify.delete('/productos/:id', (req, reply) => {
    const id = parseInt(req.params.id);
    const index = productos.findIndex(p => p.id === id);
    if (index === -1) return reply.status(404).send({ error: 'Producto no encontrado' });

    const eliminado = productos.splice(index, 1)[0];
    reply.send({ eliminado });
  });
}
