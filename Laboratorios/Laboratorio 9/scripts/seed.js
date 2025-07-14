const mongoose = require('mongoose');
const Producto = require('../src/models/Producto');

// Datos cargados para ejemplo en la base
const productosEjemplo = [
    {
        nombre: 'Laptop HP Pavilion',
        descripcion: 'Laptop de 15.6 pulgadas con procesador Intel i5, 8GB RAM, 256GB SSD',
        precio: 899.99,
        categoria: 'Electrónicos',
        stock: 15
    },
    {
        nombre: 'Mouse Inalámbrico Logitech',
        descripcion: 'Mouse inalámbrico con sensor óptico de alta precisión',
        precio: 29.99,
        categoria: 'Accesorios',
        stock: 50
    },
    {
        nombre: 'Camiseta de Algodón',
        descripcion: 'Camiseta 100% algodón, disponible en varios colores',
        precio: 19.99,
        categoria: 'Ropa',
        stock: 100
    },
    {
        nombre: 'Lámpara de Mesa LED',
        descripcion: 'Lámpara de escritorio con luz ajustable y USB',
        precio: 45.99,
        categoria: 'Hogar',
        stock: 8
    },
    {
        nombre: 'Balón de Fútbol',
        descripcion: 'Balón oficial tamaño 5, ideal para entrenamiento',
        precio: 34.99,
        categoria: 'Deportes',
        stock: 25
    },
    {
        nombre: 'Auriculares Bluetooth Sony',
        descripcion: 'Auriculares inalámbricos con cancelación de ruido',
        precio: 199.99,
        categoria: 'Electrónicos',
        stock: 5
    },
    {
        nombre: 'Libro "El Señor de los Anillos"',
        descripcion: 'Trilogía completa en tapa dura',
        precio: 59.99,
        categoria: 'Otros',
        stock: 12
    },
    {
        nombre: 'Cafetera Automática',
        descripcion: 'Cafetera programable con molinillo integrado',
        precio: 129.99,
        categoria: 'Hogar',
        stock: 3
    }
];

async function seedDatabase() {
    try {
        // Conectar a MongoDB
        await mongoose.connect('mongodb://localhost:27017/laboratorio9', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log(' Conectado a MongoDB');

        // Limpiar colección existente
        await Producto.deleteMany({});
        console.log('🗑️ Colección limpiada');

        // Insertar productos de ejemplo
        const productosCreados = await Producto.insertMany(productosEjemplo);
        console.log(` ${productosCreados.length} productos insertados`);

        // Mostrar estadísticas
        const total = await Producto.countDocuments();
        const stockBajo = await Producto.countDocuments({ stock: { $lte: 10 } });
        const categorias = await Producto.distinct('categoria');

        console.log('\n Estadísticas:');
        console.log(`- Total productos: ${total}`);
        console.log(`- Productos con stock bajo: ${stockBajo}`);
        console.log(`- Categorías: ${categorias.join(', ')}`);

        console.log('\n Base de datos poblada exitosamente');
        process.exit(0);
    } catch (error) {
        console.error(' Error:', error.message);
        process.exit(1);
    }
}

seedDatabase(); 