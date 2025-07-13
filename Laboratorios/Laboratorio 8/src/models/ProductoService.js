const Producto = require('./Producto');

class ProductoService {
    // Obtener todos los productos
    async obtenerTodos() {
        return await Producto.find().lean();
    }

    // Obtener un producto por ID
    async obtenerPorId(id) {
        return await Producto.findById(id).lean();
    }

    // Crear un nuevo producto
    async crear(datosProducto) {
        const nuevoProducto = new Producto({
            ...datosProducto
        });

        const guardado = await nuevoProducto.save();
        return guardado.toObject();
    }

    // Actualizar producto
    async actualizar(id, datosProducto) {
        const actualizado = await Producto.findByIdAndUpdate(id, datosProducto, {
            new: true,
            runValidators: true
        });

        if (!actualizado) {
            throw new Error('Producto no encontrado');
        }

        return actualizado.toObject();
    }

    // Eliminar producto
    async eliminar(id) {
        const eliminado = await Producto.findByIdAndDelete(id);
        if (!eliminado) {
            throw new Error('Producto no encontrado');
        }
        return eliminado.toObject();
    }

    // Buscar productos
    async buscar(termino) {
        const regex = new RegExp(termino, 'i');
        return await Producto.find({
            $or: [
                { nombre: regex },
                { descripcion: regex },
                { categoria: regex }
            ]
        }).lean();
    }

    // Obtener por categoría
    async obtenerPorCategoria(categoria) {
        return await Producto.find({ categoria }).lean();
    }

    // Obtener productos con stock bajo
    async obtenerStockBajo(limite = 10) {
        return await Producto.find({ stock: { $lte: limite } }).lean();
    }
}

module.exports = ProductoService;
