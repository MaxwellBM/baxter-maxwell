class Producto {
    constructor(id, nombre, descripcion, precio, categoria, stock) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = parseFloat(precio);
        this.categoria = categoria;
        this.stock = parseInt(stock);
        this.fechaCreacion = new Date();
    }

    static validar(producto) {
        const errores = [];
        
        if (!producto.nombre) {
            errores.push('Nombre requerido');
        }
        
        if (!producto.descripcion) {
            errores.push('Descripción requerida');
        }
        
        if (!producto.precio || producto.precio <= 0) {
            errores.push('Precio inválido');
        }
        
        if (!producto.categoria) {
            errores.push('Categoría requerida');
        }
        
        if (producto.stock < 0) {
            errores.push('Stock no puede ser negativo');
        }
        
        return errores;
    }

    toJSON() {
        return {
            id: this.id,
            nombre: this.nombre,
            descripcion: this.descripcion,
            precio: this.precio,
            categoria: this.categoria,
            stock: this.stock,
            fechaCreacion: this.fechaCreacion
        };
    }
}

module.exports = Producto; 