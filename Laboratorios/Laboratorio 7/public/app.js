// Configuración de la API
const API_BASE_URL = 'http://localhost:3000/api';

// Estado global de la aplicación
let productos = [];
let productoActual = null;
let modoEdicion = false;

// Elementos del DOM
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
    toastContainer: document.getElementById('toastContainer')
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
            <div class="producto-card" onclick="ui.verDetalle(${p.id})">
                <div class="producto-header">
                    <div>
                        <h3 class="producto-nombre">${p.nombre}</h3>
                        <span class="producto-categoria">${p.categoria}</span>
                    </div>
                </div>
                <p class="producto-descripcion">${p.descripcion}</p>
                <div class="producto-info">
                    <span class="producto-precio">${utils.formatearPrecio(p.precio)}</span>
                    <span class="producto-stock ${p.stock <= 10 ? 'bajo' : ''}">Stock: ${p.stock}</span>
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
        const producto = productos.find(p => p.id === id);
        if (producto) {
            ui.ocultarDetalle();
            ui.mostrarFormulario(producto);
        }
    },

    confirmarEliminacion(id) {
        const producto = productos.find(p => p.id === id);
        if (!producto) return;

        elementos.confirmacionTitulo.textContent = 'Eliminar Producto';
        elementos.confirmacionMensaje.textContent = `¿Estás seguro de eliminar "${producto.nombre}"?`;
        elementos.btnConfirmar.onclick = () => ui.eliminarProducto(id);
        elementos.modalConfirmacion.style.display = 'flex';
    },

    async eliminarProducto(id) {
        const resultado = await api.eliminarProducto(id);
        if (resultado) {
            productos = productos.filter(p => p.id !== id);
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
        if (modoEdicion && productoActual?.id) {
            res = await api.actualizarProducto(productoActual.id, nuevo);
            if (res) {
                const i = productos.findIndex(p => p.id === productoActual.id);
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
});
