# Laboratorio 9 - API REST con Fastify y Stripe

Este proyecto es una aplicación web completa que incluye una API REST construida con Fastify, un frontend moderno y la integración con Stripe para procesamiento de pagos.

##  Características

### Backend (Fastify + MongoDB)
- **API REST completa** para gestión de productos
- **Base de datos MongoDB** con Mongoose como ODM
- **Sistema de órdenes** para manejar compras
- **Integración con Stripe** para procesamiento de pagos
- **Validación de datos** con esquemas JSON
- **Manejo de errores**
- **CORS habilitado** 

### Frontend (HTML + CSS + JavaScript)
- **Interfaz moderna y responsiva** con diseño atractivo
- **Gestión completa de productos** (CRUD)
- **Sistema de carrito de compras**
- **Checkout integrado con Stripe**
- **Búsqueda y filtros** avanzados
- **Notificaciones toast** para feedback del usuario
- **Vistas adaptativas** (grid y lista)

### Funcionalidades de Compra
- **Carrito de compras** con múltiples productos
- **Validación de stock** en tiempo real
- **Procesamiento de pagos** seguro con Stripe
- **Gestión de órdenes** completa
- **Actualización automática** de inventario

## 🛠️ Tecnologías Utilizadas

### Backend
- **Fastify** - Framework web rápido y eficiente
- **MongoDB** - Base de datos NoSQL
- **Mongoose** - ODM para MongoDB
- **Stripe** - Plataforma de pagos
- **dotenv** - Gestión de variables de entorno

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos con gradientes y animaciones
- **JavaScript ES6+** - Lógica de aplicación
- **Font Awesome** - Iconografía
- **Stripe.js** - SDK de Stripe para frontend

## 📦 Instalación

### Prerrequisitos
- Node.js (v14 o superior)
- MongoDB (v4.4 o superior)
- Cuenta de Stripe (para pagos)

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <url-del-repositorio>
   cd laboratorio9
   ```

2. **Instalar dependencias**
   ```bash
   pnpm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp config.env .env
   ```
   
   Editar `.env` con tus credenciales:
   ```env
   MONGODB_URI=mongodb://localhost:27017/laboratorio9
   STRIPE_SECRET_KEY=sk_test_tu_clave_secreta
   STRIPE_PUBLISHABLE_KEY=pk_test_tu_clave_publica
   PORT=3000
   NODE_ENV=development
   ```

4. **Inicializar la base de datos**
   ```bash
   pnpm run seed
   ```

5. **Ejecutar el servidor**
   ```bash
   pnpm run dev
   ```

6. **Abrir en el navegador**
   ```
   http://localhost:3000
   ```

## 🔧 Configuración de Stripe

### 1. Crear cuenta en Stripe
- Registrarse en [stripe.com](https://stripe.com)
- Activar la cuenta para recibir pagos

### 2. Obtener las claves API
- Ir al Dashboard de Stripe
- Copiar las claves de prueba (test keys)
- Actualizar el archivo `.env`


##  API Endpoints

### Productos
```
GET    /api/productos              - Obtener todos los productos
GET    /api/productos/:id          - Obtener producto por ID
POST   /api/productos              - Crear nuevo producto
PUT    /api/productos/:id          - Actualizar producto
DELETE /api/productos/:id          - Eliminar producto
GET    /api/productos/buscar/:termino - Buscar productos
GET    /api/productos/categoria/:categoria - Filtrar por categoría
GET    /api/productos/stock-bajo/:limite - Productos con stock bajo
```

### Órdenes y Pagos
```
POST   /api/ordenes                - Crear nueva orden
GET    /api/ordenes                - Obtener todas las órdenes
GET    /api/ordenes/:id            - Obtener orden por ID
PUT    /api/ordenes/:id/estado     - Actualizar estado de orden
POST   /api/ordenes/:id/payment-intent - Crear Payment Intent
POST   /api/ordenes/confirmar-pago - Confirmar pago
GET    /api/ordenes/estado/:estado - Órdenes por estado
GET    /api/ordenes/cliente/:email - Órdenes por cliente
DELETE /api/ordenes/:id            - Eliminar orden
GET    /api/ordenes/estadisticas   - Estadísticas de órdenes
POST   /api/webhook/stripe         - Webhook de Stripe
```


### Variables de Entorno de Producción
```env
NODE_ENV=production
MONGODB_URI=mongodb://tu-servidor:27017/laboratorio9
STRIPE_SECRET_KEY=sk_live_tu_clave_secreta
STRIPE_PUBLISHABLE_KEY=pk_live_tu_clave_publica
PORT=3000
```

### Comandos de Despliegue
```bash
# Instalar dependencias de producción
pnpm install --production

# Ejecutar en producción
pnpm start
```

## 📝 Estructura del Proyecto

```
laboratorio9/
├── src/
│   ├── models/
│   │   ├── Producto.js          # Modelo de productos
│   │   ├── ProductoService.js   # Servicio de productos
│   │   ├── Orden.js             # Modelo de órdenes
│   │   └── OrdenService.js      # Servicio de órdenes
│   ├── routes/
│   │   ├── productos.js         # Rutas de productos
│   │   └── ordenes.js           # Rutas de órdenes
│   └── server.js                # Servidor principal
├── public/
│   ├── index.html               # Página principal
│   ├── styles.css               # Estilos CSS
│   └── app.js                   # JavaScript del frontend
├── scripts/
│   └── seed.js                  # Datos de prueba
├── config.env                   # Variables de entorno
├── package.json                 # Dependencias
└── README.md                    # Documentación
```

## 🧪 Pruebas

### Datos de Prueba para Stripe
```
Número de tarjeta: 4242 4242 4242 4242
Fecha de expiración: Cualquier fecha futura
CVC: Cualquier número de 3 dígitos
Código postal: Cualquier código postal
```


**Desarrollado con ❤️ para el Laboratorio 9**




