# Laboratorio 8 - Gestión de Productos con MongoDB


##  Características

### Backend (API REST)
- **Fastify** como framework web
- **MongoDB** con Mongoose como base de datos
- **Arquitectura modular** 



## Funcionalidades

### Gestión de Productos
-  Ver lista de productos
-  Ver detalle de un producto
-  Crear nuevo producto
-  Editar producto existente
-  Eliminar producto
-  Búsqueda por nombre, descripción o categoría
-  Filtro por categoría
-  Filtro por stock bajo
- Estadísticas en tiempo real

### API Endpoints
- `GET /api/productos` - Obtener todos los productos
- `GET /api/productos/:id` - Obtener producto por ID
- `POST /api/productos` - Crear nuevo producto
- `PUT /api/productos/:id` - Actualizar producto
- `DELETE /api/productos/:id` - Eliminar producto
- `GET /api/productos/buscar/:termino` - Buscar productos
- `GET /api/productos/categoria/:categoria` - Productos por categoría
- `GET /api/productos/stock-bajo/:limite` - Productos con stock bajo

## Instalación y Configuración

### Prerrequisitos
- Node.js (versión 16 o superior)
- MongoDB (instalado y ejecutándose en localhost:27017)
- pnpm (recomendado) o npm

### Instalación
1. Clonar el repositorio
2. Instalar dependencias: `pnpm install`
3. Poblar la base de datos: `pnpm run seed`
4. Iniciar el servidor: `pnpm run dev`

### Scripts Disponibles
- `pnpm start` - Iniciar servidor en producción
- `pnpm dev` - Iniciar servidor en modo desarrollo con nodemon
- `pnpm seed` - Poblar la base de datos con datos de ejemplo





