const Producto = require('./Producto');

class ProductoService {
    constructor() {
        this.productos = [
            new Producto(1, "Laptop HP Pavilion", "Laptop de 15 pulgadas con procesador Intel i5", 899.99, "Electrónicos", 10),
            new Producto(2, "Mouse Logitech", "Mouse inalámbrico con sensor óptico", 29.99, "Accesorios", 50),
            new Producto(3, "Teclado Mecánico", "Teclado mecánico con switches Cherry MX", 129.99, "Accesorios", 25),
            new Producto(4, "Monitor Samsung", "Monitor LED de 24 pulgadas Full HD", 199.99, "Electrónicos", 15),
            new Producto(5, "Auriculares Sony", "Auriculares inalámbricos con cancelación de ruido", 89.99, "Accesorios", 30)
        ];
        this.nextId = 6;
    }

    obtenerTodos() {
        return this.productos.map(p => p.toJSON());
    }

    obtenerPorId(id) {
        const producto = this.productos.find(p => p.id === parseInt(id));
        return producto ? producto.toJSON() : null;
    }

    crear(datosProducto) {
        const errores = Producto.validar(datosProducto);
        if (errores.length > 0) {
            throw new Error(errores.join(', '));
        }

        const nuevoProducto = new Producto(
            this.nextId++,
            datosProducto.nombre,
            datosProducto.descripcion,
            datosProducto.precio,
            datosProducto.categoria,
            datosProducto.stock
        );

        this.productos.push(nuevoProducto);
        return nuevoProducto.toJSON();
    }

    actualizar(id, datosProducto) {
        const index = this.productos.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        const errores = Producto.validar(datosProducto);
        if (errores.length > 0) {
            throw new Error(errores.join(', '));
        }

        const productoActualizado = new Producto(
            parseInt(id),
            datosProducto.nombre,
            datosProducto.descripcion,
            datosProducto.precio,
            datosProducto.categoria,
            datosProducto.stock
        );

        this.productos[index] = productoActualizado;
        return productoActualizado.toJSON();
    }

    eliminar(id) {
        const index = this.productos.findIndex(p => p.id === parseInt(id));
        if (index === -1) {
            throw new Error('Producto no encontrado');
        }

        const eliminado = this.productos.splice(index, 1)[0];
        return eliminado.toJSON();
    }

    buscar(termino) {
        const buscar = termino.toLowerCase();
        return this.productos
            .filter(p =>
                p.nombre.toLowerCase().includes(buscar) ||
                p.descripcion.toLowerCase().includes(buscar) ||
                p.categoria.toLowerCase().includes(buscar)
            )
            .map(p => p.toJSON());
    }

    obtenerPorCategoria(categoria) {
        return this.productos
            .filter(p => p.categoria.toLowerCase() === categoria.toLowerCase())
            .map(p => p.toJSON());
    }

    obtenerStockBajo(limite = 10) {
        return this.productos
            .filter(p => p.stock <= limite)
            .map(p => p.toJSON());
    }
}

module.exports = ProductoService;
