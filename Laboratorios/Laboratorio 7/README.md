# Laboratorio 7 - Gestión de Productos


##  Características

### Backend (API REST)
- **Fastify** como framework web
- **Arquitectura modular** con separación de responsabilidades
- **Validación de datos** con esquemas JSON
- **Manejo de errores** centralizado
- **CORS** habilitado para desarrollo
- **Logging** estructurado
- **Health check** endpoint

### Frontend
- **Interfaz moderna** y responsive
- **Dashboard** con estadísticas en tiempo real
- **Búsqueda** y filtros avanzados
- **CRUD completo** de productos
- **Notificaciones** toast
- **Modales** para formularios y detalles
- **Diseño mobile-first**

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




