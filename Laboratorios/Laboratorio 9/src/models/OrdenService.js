const Orden = require('./Orden');
const Producto = require('./Producto');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

class OrdenService {
    // Crear una nueva orden
    async crear(datosOrden) {
        try {
            const orden = new Orden(datosOrden);
            await orden.save();
            return orden;
        } catch (error) {
            throw new Error(`Error al crear orden: ${error.message}`);
        }
    }

    // Obtener todas las órdenes
    async obtenerTodas() {
        try {
            return await Orden.find().populate('items.producto').sort({ fechaCreacion: -1 });
        } catch (error) {
            throw new Error(`Error al obtener órdenes: ${error.message}`);
        }
    }

    // Obtener orden por ID
    async obtenerPorId(id) {
        try {
            return await Orden.findById(id).populate('items.producto');
        } catch (error) {
            throw new Error(`Error al obtener orden: ${error.message}`);
        }
    }

    // Actualizar estado de orden
    async actualizarEstado(id, nuevoEstado) {
        try {
            const orden = await Orden.findById(id);
            if (!orden) {
                throw new Error('Orden no encontrada');
            }

            orden.estado = nuevoEstado;
            
            // Si se marca como pagada, actualizar fecha de pago
            if (nuevoEstado === 'pagada' && !orden.fechaPago) {
                orden.fechaPago = new Date();
            }

            await orden.save();
            return orden;
        } catch (error) {
            throw new Error(`Error al actualizar estado: ${error.message}`);
        }
    }

    // Crear Payment Intent de Stripe
    async crearPaymentIntent(ordenId) {
        try {
            const orden = await Orden.findById(ordenId);
            if (!orden) {
                throw new Error('Orden no encontrada');
            }

            if (orden.estado !== 'pendiente') {
                throw new Error('La orden ya no está pendiente');
            }

            console.log('Intentando crear payment intent:', {
                id: ordenId,
                total: orden.total,
                estado: orden.estado,
                items: orden.items
            });

            const paymentIntent = await stripe.paymentIntents.create({
                amount: Math.round(orden.total * 100), // Stripe usa centavos
                currency: 'usd',
                metadata: {
                    ordenId: ordenId
                }
            });

            orden.stripePaymentIntentId = paymentIntent.id;
            await orden.save();

            return {
                clientSecret: paymentIntent.client_secret,
                orden: orden
            };
        } catch (error) {
            console.error('Error real de Stripe:', error);
            throw new Error(`Error al crear payment intent`);
        }
    }

    // Confirmar pago de Stripe
    async confirmarPago(paymentIntentId) {
        try {
            const orden = await Orden.findOne({ stripePaymentIntentId: paymentIntentId });
            if (!orden) {
                throw new Error('Orden no encontrada');
            }

            // Verificar el pago con Stripe
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
            
            if (paymentIntent.status === 'succeeded') {
                orden.estado = 'pagada';
                orden.fechaPago = new Date();
                
                // Actualizar stock de productos
                await orden.actualizarStock();
                
                await orden.save();
                return orden;
            } else {
                throw new Error('El pago no fue exitoso');
            }
        } catch (error) {
            throw new Error(`Error al confirmar pago: ${error.message}`);
        }
    }

    // Obtener órdenes por estado
    async obtenerPorEstado(estado) {
        try {
            return await Orden.find({ estado }).populate('items.producto').sort({ fechaCreacion: -1 });
        } catch (error) {
            throw new Error(`Error al obtener órdenes por estado: ${error.message}`);
        }
    }

    // Obtener órdenes por cliente
    async obtenerPorCliente(email) {
        try {
            return await Orden.find({ 'cliente.email': email }).populate('items.producto').sort({ fechaCreacion: -1 });
        } catch (error) {
            throw new Error(`Error al obtener órdenes por cliente: ${error.message}`);
        }
    }

    // Eliminar orden (solo si está pendiente)
    async eliminar(id) {
        try {
            const orden = await Orden.findById(id);
            if (!orden) {
                throw new Error('Orden no encontrada');
            }

            if (orden.estado !== 'pendiente') {
                throw new Error('No se puede eliminar una orden que no está pendiente');
            }

            await Orden.findByIdAndDelete(id);
            return orden;
        } catch (error) {
            throw new Error(`Error al eliminar orden: ${error.message}`);
        }
    }

    // Obtener estadísticas de órdenes
    async obtenerEstadisticas() {
        try {
            const total = await Orden.countDocuments();
            const pendientes = await Orden.countDocuments({ estado: 'pendiente' });
            const pagadas = await Orden.countDocuments({ estado: 'pagada' });
            const canceladas = await Orden.countDocuments({ estado: 'cancelada' });

            const totalVentas = await Orden.aggregate([
                { $match: { estado: 'pagada' } },
                { $group: { _id: null, total: { $sum: '$total' } } }
            ]);

            return {
                total,
                pendientes,
                pagadas,
                canceladas,
                totalVentas: totalVentas[0]?.total || 0
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas: ${error.message}`);
        }
    }
}

module.exports = OrdenService; 