// 2 horas para que me faltara solo esta vaina (odio aquí)
const API_BASE_URL = 'http://localhost:3000/api';

// Estado global de la aplicación
let productos = [];
let productoActual = null;
let modoEdicion = false;
let carrito = [];
let stripe = null;
let cardElement = null;

// Todos los elementos
const elementos = {
    btnNuevoProducto: document.getElementById('btnNuevoProducto'),
    totalProductos: document.getElementById('totalProductos'),
    stockBajo: document.getElementById('stockBajo'),
    categorias: document.getElementById('categorias'),
    searchInput: document.getElementById('searchInput'),
    btnLimpiarBusqueda: document.getElementById('btnLimpiarBusqueda'),
    categoriaFilter: document.getElementById('categoriaFilter'),
    btnStockBajo: document.getElementById('btnStockBajo'),
    productosGrid: document.getElementById('productosGrid'),
    loadingSpinner: document.getElementById('loadingSpinner'),
    noProducts: document.getElementById('noProducts'),
    btnCrearPrimerProducto: document.getElementById('btnCrearPrimerProducto'),
    btnGridView: document.getElementById('btnGridView'),
    btnListView: document.getElementById('btnListView'),
    modalFormulario: document.getElementById('modalFormulario'),
    modalTitulo: document.getElementById('modalTitulo'),
    btnCerrarModal: document.getElementById('btnCerrarModal'),
    productoForm: document.getElementById('productoForm'),
    btnSubmitText: document.getElementById('btnSubmitText'),
    btnCancelar: document.getElementById('btnCancelar'),
    modalDetalle: document.getElementById('modalDetalle'),
    modalDetalleTitulo: document.getElementById('modalDetalleTitulo'),
    modalDetalleBody: document.getElementById('modalDetalleBody'),
    btnCerrarDetalle: document.getElementById('btnCerrarDetalle'),
    btnEditarProducto: document.getElementById('btnEditarProducto'),
    btnEliminarProducto: document.getElementById('btnEliminarProducto'),
    modalConfirmacion: document.getElementById('modalConfirmacion'),
    confirmacionTitulo: document.getElementById('confirmacionTitulo'),
    confirmacionMensaje: document.getElementById('confirmacionMensaje'),
    btnCerrarConfirmacion: document.getElementById('btnCerrarConfirmacion'),
    btnConfirmar: document.getElementById('btnConfirmar'),
    btnCancelarConfirmacion: document.getElementById('btnCancelarConfirmacion'),
    toastContainer: document.getElementById('toastContainer'),
    btnComprarProducto: document.getElementById('btnComprarProducto'),
    modalCheckout: document.getElementById('modalCheckout'),
    btnCerrarCheckout: document.getElementById('btnCerrarCheckout'),
    checkoutItems: document.getElementById('checkoutItems'),
    checkoutTotal: document.getElementById('checkoutTotal'),
    checkoutForm: document.getElementById('checkoutForm'),
    btnConfirmarCompra: document.getElementById('btnConfirmarCompra'),
    btnCancelarCompra: document.getElementById('btnCancelarCompra'),
    clienteNombre: document.getElementById('clienteNombre'),
    clienteEmail: document.getElementById('clienteEmail'),
    clienteTelefono: document.getElementById('clienteTelefono'),
    direccionCalle: document.getElementById('direccionCalle'),
    direccionCiudad: document.getElementById('direccionCiudad'),
    direccionCodigoPostal: document.getElementById('direccionCodigoPostal'),
    direccionPais: document.getElementById('direccionPais'),
    stripeCardElement: document.getElementById('stripeCardElement'),
    btnVerCarrito: document.getElementById('btnVerCarrito'),
    cartBadge: document.getElementById('cartBadge'),
    modalCarrito: document.getElementById('modalCarrito'),
    btnCerrarCarrito: document.getElementById('btnCerrarCarrito'),
    carritoVacio: document.getElementById('carritoVacio'),
    carritoItems: document.getElementById('carritoItems'),
    carritoLista: document.getElementById('carritoLista'),
    carritoTotal: document.getElementById('carritoTotal'),
    btnVaciarCarrito: document.getElementById('btnVaciarCarrito'),
    btnIrACheckout: document.getElementById('btnIrACheckout')
};

// Utilidades
const utils = {
    formatearPrecio: precio =>
        new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(precio),

    formatearFecha: fecha =>
        new Date(fecha).toLocaleDateString('es-ES'),

    mostrarToast: (mensaje, tipo = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${tipo}`;
        const id = Date.now();
        toast.id = `toast-${id}`;
        toast.innerHTML = `
            <div class="toast-header">
                <span class="toast-title">${tipo === 'success' ? 'Éxito' : 'Error'}</span>
                <button class="toast-close" onclick="utils.cerrarToast('${id}')">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="toast-message">${mensaje}</div>`;
        elementos.toastContainer.appendChild(toast);
        setTimeout(() => utils.cerrarToast(id), 5000);
    },

    cerrarToast: id => {
        const toast = document.getElementById(`toast-${id}`);
        if (toast) toast.remove();
    },

    limpiarFormulario: () => {
        elementos.productoForm.reset();
        productoActual = null;
        modoEdicion = false;
    },

    mostrarLoading: () => {
        elementos.loadingSpinner.style.display = 'flex';
        elementos.productosGrid.style.display = 'none';
        elementos.noProducts.style.display = 'none';
    },

    ocultarLoading: () => {
        elementos.loadingSpinner.style.display = 'none';
        elementos.productosGrid.style.display = 'grid';
    }
};

// API Service
const api = {
    async obtenerProductos() {
        try {
            const res = await fetch(`${API_BASE_URL}/productos`);
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            return data.productos || [];
        } catch (e) {
            utils.mostrarToast('Error al cargar productos', 'error');
            return [];
        }
    },

    async obtenerProducto(id) {
        try {
            const res = await fetch(`${API_BASE_URL}/productos/${id}`);
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            return data.producto;
        } catch (e) {
            utils.mostrarToast('Error al obtener producto', 'error');
            return null;
        }
    },

    async crearProducto(producto) {
        try {
            const res = await fetch(`${API_BASE_URL}/productos`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            return data.producto;
        } catch (e) {
            utils.mostrarToast('Error al crear producto', 'error');
            return null;
        }
    },

    async actualizarProducto(id, producto) {
        try {
            const res = await fetch(`${API_BASE_URL}/productos/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(producto)
            });
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            return data.producto;
        } catch (e) {
            utils.mostrarToast('Error al actualizar producto', 'error');
            return null;
        }
    },

    async eliminarProducto(id) {
        try {
            const res = await fetch(`${API_BASE_URL}/productos/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            return data.producto;
        } catch (e) {
            utils.mostrarToast('Error al eliminar producto', 'error');
            return null;
        }
    },

    // Funciones para órdenes y pagos
    async crearOrden(datosOrden) {
        try {
            const res = await fetch(`${API_BASE_URL}/ordenes`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosOrden)
            });
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            return data.orden;
        } catch (e) {
            utils.mostrarToast('Error al crear orden', 'error');
            return null;
        }
    },

    async crearPaymentIntent(ordenId) {
        try {
            const res = await fetch(`${API_BASE_URL}/ordenes/${ordenId}/payment-intent`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            return data;
        } catch (e) {
            utils.mostrarToast('Error al crear payment intent', 'error');
            return null;
        }
    },

    async confirmarPago(paymentIntentId) {
        try {
            const res = await fetch(`${API_BASE_URL}/ordenes/confirmar-pago`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentIntentId })
            });
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            return data.orden;
        } catch (e) {
            utils.mostrarToast('Error al confirmar pago', 'error');
            return null;
        }
    }
};

// UI
const ui = {
    renderizarProductos(productosLista) {
        if (productosLista.length === 0) {
            elementos.productosGrid.innerHTML = '';
            elementos.noProducts.style.display = 'block';
            return;
        }

        elementos.noProducts.style.display = 'none';
        const html = productosLista.map(p => `
            <div class="producto-card">
                <div class="producto-header" onclick="ui.verDetalle('${p._id}')">
                    <div>
                        <h3 class="producto-nombre">${p.nombre}</h3>
                        <span class="producto-categoria">${p.categoria}</span>
                    </div>
                </div>
                <p class="producto-descripcion" onclick="ui.verDetalle('${p._id}')">${p.descripcion}</p>
                <div class="producto-info" onclick="ui.verDetalle('${p._id}')">
                    <span class="producto-precio">${utils.formatearPrecio(p.precio)}</span>
                    <span class="producto-stock ${p.stock <= 10 ? 'bajo' : ''}">Stock: ${p.stock}</span>
                </div>
                <div class="producto-actions">
                    <button class="btn-comprar" onclick="event.stopPropagation(); ui.agregarAlCarrito(${JSON.stringify(p).replace(/"/g, '&quot;')})" ${p.stock <= 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i>
                        ${p.stock <= 0 ? 'Sin Stock' : 'Comprar'}
                    </button>
                </div>
            </div>`).join('');

        elementos.productosGrid.innerHTML = html;
    },

    actualizarEstadisticas() {
        elementos.totalProductos.textContent = productos.length;
        elementos.stockBajo.textContent = productos.filter(p => p.stock <= 10).length;
        elementos.categorias.textContent = new Set(productos.map(p => p.categoria)).size;
    },

    mostrarFormulario(producto = null) {
        productoActual = producto;
        modoEdicion = !!producto;

        if (modoEdicion) {
            elementos.modalTitulo.textContent = 'Editar Producto';
            elementos.btnSubmitText.textContent = 'Actualizar';
            elementos.productoForm.nombre.value = producto.nombre;
            elementos.productoForm.descripcion.value = producto.descripcion;
            elementos.productoForm.precio.value = producto.precio;
            elementos.productoForm.categoria.value = producto.categoria;
            elementos.productoForm.stock.value = producto.stock;
        } else {
            elementos.modalTitulo.textContent = 'Nuevo Producto';
            elementos.btnSubmitText.textContent = 'Guardar';
            utils.limpiarFormulario();
        }

        elementos.modalFormulario.style.display = 'flex';
    },

    ocultarFormulario() {
        elementos.modalFormulario.style.display = 'none';
        utils.limpiarFormulario();
    },

    async verDetalle(id) {
        const producto = await api.obtenerProducto(id);
        if (!producto) return;

        elementos.modalDetalleTitulo.textContent = producto.nombre;
        elementos.modalDetalleBody.innerHTML = `
            <div><strong>Descripción:</strong> ${producto.descripcion}</div>
            <div><strong>Precio:</strong> ${utils.formatearPrecio(producto.precio)}</div>
            <div><strong>Categoría:</strong> ${producto.categoria}</div>
            <div><strong>Stock:</strong> ${producto.stock}</div>`;

        elementos.btnEditarProducto.onclick = () => ui.editarProducto(id);
        elementos.btnEliminarProducto.onclick = () => ui.confirmarEliminacion(id);
        elementos.modalDetalle.style.display = 'flex';
    },

    editarProducto(id) {
        const producto = productos.find(p => p._id === id);
        if (producto) {
            ui.ocultarDetalle();
            ui.mostrarFormulario(producto);
        }
    },

    confirmarEliminacion(id) {
        const producto = productos.find(p => p._id === id);
        if (!producto) return;

        elementos.confirmacionTitulo.textContent = 'Eliminar Producto';
        elementos.confirmacionMensaje.textContent = `¿Estás seguro de eliminar "${producto.nombre}"?`;
        elementos.btnConfirmar.onclick = () => ui.eliminarProducto(id);
        elementos.modalConfirmacion.style.display = 'flex';
    },

    async eliminarProducto(id) {
        const resultado = await api.eliminarProducto(id);
        if (resultado) {
            productos = productos.filter(p => p._id !== id);
            ui.renderizarProductos(productos);
            ui.actualizarEstadisticas();
            utils.mostrarToast('Producto eliminado');
            ui.ocultarConfirmacion();
            ui.ocultarDetalle();
        }
    },

    ocultarDetalle() {
        elementos.modalDetalle.style.display = 'none';
    },

    ocultarConfirmacion() {
        elementos.modalConfirmacion.style.display = 'none';
    },

    async cargarProductos() {
        utils.mostrarLoading();
        productos = await api.obtenerProductos();
        ui.renderizarProductos(productos);
        ui.actualizarEstadisticas();
        utils.ocultarLoading();
    },

    // Funciones para el carrito y checkout
    agregarAlCarrito(producto, cantidad = 1) {
        const itemExistente = carrito.find(item => item.producto._id === producto._id);
        
        if (itemExistente) {
            itemExistente.cantidad += cantidad;
        } else {
            carrito.push({
                producto: producto,
                cantidad: cantidad
            });
        }
        
        ui.actualizarBadgeCarrito();
        utils.mostrarToast(`${producto.nombre} agregado al carrito`, 'success');
    },

    removerDelCarrito(productoId) {
        carrito = carrito.filter(item => item.producto._id !== productoId);
        ui.actualizarBadgeCarrito();
        utils.mostrarToast('Producto removido del carrito', 'success');
    },

    obtenerTotalCarrito() {
        return carrito.reduce((total, item) => total + (item.producto.precio * item.cantidad), 0);
    },

    actualizarBadgeCarrito() {
        const totalItems = carrito.reduce((total, item) => total + item.cantidad, 0);
        if (totalItems > 0) {
            elementos.cartBadge.textContent = totalItems;
            elementos.cartBadge.style.display = 'block';
        } else {
            elementos.cartBadge.style.display = 'none';
        }
    },

    mostrarCarrito() {
        if (carrito.length === 0) {
            elementos.carritoVacio.style.display = 'block';
            elementos.carritoItems.style.display = 'none';
        } else {
            elementos.carritoVacio.style.display = 'none';
            elementos.carritoItems.style.display = 'block';
            
            // Renderizar items del carrito
            elementos.carritoLista.innerHTML = carrito.map((item, index) => `
                <div class="carrito-item">
                    <div class="carrito-item-info">
                        <div class="carrito-item-nombre">${item.producto.nombre}</div>
                        <div class="carrito-item-precio">${utils.formatearPrecio(item.producto.precio)} c/u</div>
                    </div>
                    <div class="carrito-item-cantidad">
                        <button class="btn-quantity" onclick="ui.cambiarCantidad(${index}, -1)">-</button>
                        <input type="number" value="${item.cantidad}" min="1" max="${item.producto.stock}" 
                               onchange="ui.actualizarCantidad(${index}, this.value)">
                        <button class="btn-quantity" onclick="ui.cambiarCantidad(${index}, 1)">+</button>
                    </div>
                    <div class="carrito-item-subtotal">
                        ${utils.formatearPrecio(item.producto.precio * item.cantidad)}
                    </div>
                    <div class="carrito-item-actions">
                        <button class="btn-remove" onclick="ui.removerDelCarrito('${item.producto._id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `).join('');
            
            elementos.carritoTotal.textContent = utils.formatearPrecio(ui.obtenerTotalCarrito());
        }
        
        elementos.modalCarrito.style.display = 'flex';
    },

    ocultarCarrito() {
        elementos.modalCarrito.style.display = 'none';
    },

    cambiarCantidad(index, delta) {
        const item = carrito[index];
        const nuevaCantidad = item.cantidad + delta;
        
        if (nuevaCantidad >= 1 && nuevaCantidad <= item.producto.stock) {
            item.cantidad = nuevaCantidad;
            ui.actualizarBadgeCarrito();
            ui.mostrarCarrito(); // Refrescar la vista
        }
    },

    actualizarCantidad(index, nuevaCantidad) {
        const item = carrito[index];
        const cantidad = parseInt(nuevaCantidad);
        
        if (cantidad >= 1 && cantidad <= item.producto.stock) {
            item.cantidad = cantidad;
        } else {
            // Restaurar valor anterior si es inválido
            const input = elementos.carritoLista.querySelectorAll('input')[index];
            input.value = item.cantidad;
        }
        
        ui.actualizarBadgeCarrito();
        ui.mostrarCarrito(); // Refrescar la vista
    },

    vaciarCarrito() {
        carrito = [];
        ui.actualizarBadgeCarrito();
        ui.ocultarCarrito();
        utils.mostrarToast('Carrito vaciado', 'success');
    },

    mostrarCheckout() {
        if (carrito.length === 0) {
            utils.mostrarToast('El carrito está vacío', 'warning');
            return;
        }

        // Renderizar items del carrito
        elementos.checkoutItems.innerHTML = carrito.map(item => `
            <div class="checkout-item">
                <div class="checkout-item-info">
                    <div class="checkout-item-name">${item.producto.nombre}</div>
                    <div class="checkout-item-details">Cantidad: ${item.cantidad} x ${utils.formatearPrecio(item.producto.precio)}</div>
                </div>
                <div class="checkout-item-price">${utils.formatearPrecio(item.producto.precio * item.cantidad)}</div>
            </div>
        `).join('');

        elementos.checkoutTotal.textContent = utils.formatearPrecio(ui.obtenerTotalCarrito());
        elementos.modalCheckout.style.display = 'flex';
        
        // Inicializar Stripe si no está inicializado
        if (!stripe) {
            ui.inicializarStripe();
        }
    },

    ocultarCheckout() {
        elementos.modalCheckout.style.display = 'none';
        elementos.checkoutForm.reset();
    },

    async inicializarStripe() {
        try {
            // Cargar Stripe desde CDN si no está cargado
            if (typeof Stripe === 'undefined') {
                const script = document.createElement('script');
                script.src = 'https://js.stripe.com/v3/';
                document.head.appendChild(script);
                await new Promise(resolve => script.onload = resolve);
            }

            // Inicializar Stripe con la clave pública
            stripe = Stripe('pk_test_51RkW5d4DxAf69OZnUTRSxitCvYGGbzN8lMlvEsMcd0J2sMVb6DB66dkCtyC3stUlmm4PSvJBVjk7kmHlTkwzr7eF00xriRNhmi');
            
            // Crear el elemento de tarjeta
            const elements = stripe.elements();
            cardElement = elements.create('card', {
                style: {
                    base: {
                        fontSize: '16px',
                        color: '#424770',
                        '::placeholder': {
                            color: '#aab7c4',
                        },
                    },
                    invalid: {
                        color: '#9e2146',
                    },
                },
            });
            
            cardElement.mount('#stripeCardElement');
        } catch (error) {
            console.error('Error al inicializar Stripe:', error);
            utils.mostrarToast('Error al inicializar el sistema de pagos', 'error');
        }
    },

    async procesarCompra(event) {
        event.preventDefault();
        
        const btnConfirmar = elementos.btnConfirmarCompra;
        const textoOriginal = btnConfirmar.innerHTML;
        btnConfirmar.disabled = true;
        btnConfirmar.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';

        try {
            // Validar formulario
            if (!elementos.checkoutForm.checkValidity()) {
                elementos.checkoutForm.reportValidity();
                return;
            }

            // Preparar datos de la orden
            const datosOrden = {
                items: carrito.map(item => ({
                    productoId: item.producto._id,
                    cantidad: item.cantidad
                })),
                cliente: {
                    nombre: elementos.clienteNombre.value,
                    email: elementos.clienteEmail.value,
                    telefono: elementos.clienteTelefono.value,
                    direccion: {
                        calle: elementos.direccionCalle.value,
                        ciudad: elementos.direccionCiudad.value,
                        codigoPostal: elementos.direccionCodigoPostal.value,
                        pais: elementos.direccionPais.value
                    }
                }
            };

            // Crear orden
            const orden = await api.crearOrden(datosOrden);
            if (!orden) {
                throw new Error('Error al crear la orden');
            }

            // Crear Payment Intent
            const paymentData = await api.crearPaymentIntent(orden._id);
            if (!paymentData) {
                throw new Error('Error al crear el payment intent');
            }

            // Confirmar pago con Stripe
            const { error, paymentIntent } = await stripe.confirmCardPayment(
                paymentData.clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: elementos.clienteNombre.value,
                            email: elementos.clienteEmail.value
                        }
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }

            // Confirmar pago en el backend
            const ordenConfirmada = await api.confirmarPago(paymentIntent.id);
            if (!ordenConfirmada) {
                throw new Error('Error al confirmar el pago');
            }

            // Éxito
            utils.mostrarToast('¡Compra realizada con éxito!', 'success');
            carrito = [];
            ui.actualizarBadgeCarrito();
            ui.ocultarCheckout();
            ui.cargarProductos(); // Recargar productos para actualizar stock

        } catch (error) {
            console.error('Error en el proceso de compra:', error);
            utils.mostrarToast(`Error: ${error.message}`, 'error');
        } finally {
            btnConfirmar.disabled = false;
            btnConfirmar.innerHTML = textoOriginal;
        }
    },

    async manejarEnvioFormulario(event) {
        event.preventDefault();

        const formData = new FormData(event.target);
        const nuevo = {
            nombre: formData.get('nombre'),
            descripcion: formData.get('descripcion'),
            precio: parseFloat(formData.get('precio')),
            categoria: formData.get('categoria'),
            stock: parseInt(formData.get('stock'))
        };

        let res;
        if (modoEdicion && productoActual?._id) {
            res = await api.actualizarProducto(productoActual._id, nuevo);
            if (res) {
                const i = productos.findIndex(p => p._id === productoActual._id);
                productos[i] = res;
                utils.mostrarToast('Producto actualizado');
            }
        } else {
            res = await api.crearProducto(nuevo);
            if (res) {
                productos.push(res);
                utils.mostrarToast('Producto creado');
            }
        }

        if (res) {
            ui.renderizarProductos(productos);
            ui.actualizarEstadisticas();
            ui.ocultarFormulario();
        }
    },

    // Funciones de filtrado y búsqueda
    filtrarProductos() {
        const termino = elementos.searchInput.value.toLowerCase();
        const categoria = elementos.categoriaFilter.value;
        
        let productosFiltrados = productos;
        
        // Filtro por término de búsqueda
        if (termino) {
            productosFiltrados = productosFiltrados.filter(p => 
                p.nombre.toLowerCase().includes(termino) ||
                p.descripcion.toLowerCase().includes(termino) ||
                p.categoria.toLowerCase().includes(termino)
            );
        }
        
        // Filtro por categoría
        if (categoria) {
            productosFiltrados = productosFiltrados.filter(p => p.categoria === categoria);
        }
        
        ui.renderizarProductos(productosFiltrados);
        ui.actualizarEstadisticas();
        
        // Mostrar/ocultar botón de limpiar búsqueda
        elementos.btnLimpiarBusqueda.style.display = termino ? 'block' : 'none';
    },

    limpiarBusqueda() {
        elementos.searchInput.value = '';
        elementos.categoriaFilter.value = '';
        elementos.btnLimpiarBusqueda.style.display = 'none';
        ui.renderizarProductos(productos);
        ui.actualizarEstadisticas();
    },

    async filtrarStockBajo() {
        try {
            const res = await fetch(`${API_BASE_URL}/productos/stock-bajo/10`);
            if (!res.ok) throw new Error(`Error HTTP ${res.status}`);
            const data = await res.json();
            ui.renderizarProductos(data.productos || []);
            ui.actualizarEstadisticas();
            utils.mostrarToast(`Mostrando ${data.productos?.length || 0} productos con stock bajo`);
        } catch (e) {
            utils.mostrarToast('Error al filtrar productos con stock bajo', 'error');
        }
    },

    cambiarVista(tipo) {
        elementos.btnGridView.classList.toggle('active', tipo === 'grid');
        elementos.btnListView.classList.toggle('active', tipo === 'list');
        elementos.productosGrid.className = tipo === 'list' ? 'productos-list' : 'productos-grid';
    }
};

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    ui.cargarProductos();
    elementos.productoForm.addEventListener('submit', ui.manejarEnvioFormulario);
    elementos.btnNuevoProducto.onclick = () => ui.mostrarFormulario();
    elementos.btnCerrarModal.onclick = ui.ocultarFormulario;
    elementos.btnCancelar.onclick = ui.ocultarFormulario;
    elementos.btnCerrarDetalle.onclick = ui.ocultarDetalle;
    elementos.btnCerrarConfirmacion.onclick = ui.ocultarConfirmacion;
    elementos.btnCancelarConfirmacion.onclick = ui.ocultarConfirmacion;
    elementos.btnCrearPrimerProducto.onclick = () => ui.mostrarFormulario();
    
    // Búsqueda y filtros
    elementos.searchInput.addEventListener('input', ui.filtrarProductos);
    elementos.btnLimpiarBusqueda.onclick = ui.limpiarBusqueda;
    elementos.categoriaFilter.addEventListener('change', ui.filtrarProductos);
    elementos.btnStockBajo.onclick = ui.filtrarStockBajo;
    
    // Vista de productos
    elementos.btnGridView.onclick = () => ui.cambiarVista('grid');
    elementos.btnListView.onclick = () => ui.cambiarVista('list');
    
    // Checkout y compras
    elementos.btnComprarProducto.onclick = () => ui.mostrarCheckout();
    elementos.btnCerrarCheckout.onclick = ui.ocultarCheckout;
    elementos.btnCancelarCompra.onclick = ui.ocultarCheckout;
    elementos.checkoutForm.addEventListener('submit', ui.procesarCompra);
    
    // Carrito
    elementos.btnVerCarrito.onclick = ui.mostrarCarrito;
    elementos.btnCerrarCarrito.onclick = ui.ocultarCarrito;
    elementos.btnVaciarCarrito.onclick = ui.vaciarCarrito;
    elementos.btnIrACheckout.onclick = () => {
        ui.ocultarCarrito();
        ui.mostrarCheckout();
    };
});
