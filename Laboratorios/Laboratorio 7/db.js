// src/db.js
const mongoose = require('mongoose');

async function conectarDB() {
  try {
    await mongoose.connect('mongodb://localhost:27017/laboratorio8', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a MongoDB');
  } catch (error) {
    console.error('❌ Error al conectar con MongoDB:', error);
    process.exit(1);
  }
}

module.exports = conectarDB;
