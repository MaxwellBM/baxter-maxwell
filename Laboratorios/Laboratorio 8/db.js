const mongoose = require('mongoose');

async function conectarDB() { 
  try {
    await mongoose.connect('mongodb://localhost:27017/laboratorio8', {
      useNewUrlParser: true, // odio aqui 5 horas para averiguar esta vaina
      useUnifiedTopology: true
    });
    console.log(' Conectado a MongoDB');
  } catch (error) {
    console.error(' Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
}

module.exports = conectarDB;
