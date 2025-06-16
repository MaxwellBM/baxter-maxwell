const Books = {
  usuario: null,

  init: () => {
    const sesion = Storage.load('sesion');
    const usuarios = Storage.load('usuarios') || [];

    if (!sesion || !sesion.username) {
      window.location.href = 'index.html';
      return;
    }

    Books.usuario = usuarios.find(u => u.username === sesion.username);

    if (!Books.usuario) {
      window.location.href = 'index.html';
      return;
    }

    Books.renderTabla();

    const form = document.getElementById('form-libro');
    if (form) {
      form.addEventListener('submit', Books.agregarLibro);
    }

    const boton = document.getElementById('btn-mostrar-form');
    const formularioLateral = document.getElementById('form-seccion');

    if (boton && formularioLateral) {
      boton.addEventListener('click', () => {
        formularioLateral.classList.toggle('visible');
      });
    }

    // Mostrar/Ocultar el reporte al hacer clic
    const btnReporte = document.getElementById("btn-reporte");
    const seccionReporte = document.getElementById("reporte-lectura");

    if (btnReporte && seccionReporte) {
      btnReporte.addEventListener("click", () => {
        Books.actualizarReporte();
        seccionReporte.style.display =
          seccionReporte.style.display === "none" ? "block" : "none";
      });
    }
  },

  renderTabla: () => {
    const tbody = document.querySelector('#tabla-libros tbody');
    tbody.innerHTML = '';

    if (Books.usuario.libros.length === 0) {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td colspan="6" style="text-align:center; color:#888;">No has agregado ningún libro aún.</td>`;
      tbody.appendChild(tr);
      return;
    }

    Books.usuario.libros.forEach((libro, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${libro.titulo}</td>
        <td>${libro.autor}</td>
        <td>${libro.fecha}</td>
        <td>${libro.paginas}</td>
        <td>${libro.recomendar ? '✅' : '❌'}</td>
        <td><button onclick="Books.eliminarLibro(${index})">Eliminar</button></td>
      `;
      tbody.appendChild(tr);
    });
  },

  agregarLibro: (e) => {
    e.preventDefault();

    const titulo = document.getElementById('titulo').value.trim();
    const autor = document.getElementById('autor').value.trim();
    const fecha = document.getElementById('fecha').value;
    const paginas = parseInt(document.getElementById('paginas').value);
    const recomendar = document.getElementById('recomendar').checked;

    if (!titulo || !autor || !fecha || isNaN(paginas) || paginas <= 0) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    Books.usuario.libros.push({ titulo, autor, fecha, paginas, recomendar });

    const usuarios = Storage.load('usuarios');
    const idx = usuarios.findIndex(u => u.username === Books.usuario.username);
    usuarios[idx] = Books.usuario;
    Storage.save('usuarios', usuarios);

    Books.renderTabla();
    Books.actualizarReporte();
    document.getElementById('form-libro').reset();

    const formularioLateral = document.getElementById('form-seccion');
    if (formularioLateral) {
      formularioLateral.classList.remove('visible');
    }
  },

  eliminarLibro: (index) => {
    Books.usuario.libros.splice(index, 1);
    const usuarios = Storage.load('usuarios');
    const idx = usuarios.findIndex(u => u.username === Books.usuario.username);
    usuarios[idx] = Books.usuario;
    Storage.save('usuarios', usuarios);

    Books.renderTabla();
    Books.actualizarReporte();
  },

  actualizarReporte: () => {
    const total = Books.usuario.libros.length;
    const totalPaginas = Books.usuario.libros.reduce((sum, libro) => sum + libro.paginas, 0);
    const promedio = total === 0 ? 0 : Math.round(totalPaginas / total);

    const spanTotal = document.getElementById("total-libros");
    const spanPromedio = document.getElementById("promedio-paginas");

    if (spanTotal && spanPromedio) {
      spanTotal.textContent = total;
      spanPromedio.textContent = promedio;
    }

    // Actualizar gráfico de recomendación
    const barraSi = document.getElementById("barra-si");
    const barraNo = document.getElementById("barra-no");

    if (barraSi && barraNo) {
      const recomendados = Books.usuario.libros.filter(l => l.recomendar).length;
      const noRecomendados = Books.usuario.libros.filter(l => !l.recomendar).length;
      const totalRecomendacion = recomendados + noRecomendados;

      const porcentajeSi = totalRecomendacion === 0 ? 0 : (recomendados / totalRecomendacion) * 100;
      const porcentajeNo = totalRecomendacion === 0 ? 0 : (noRecomendados / totalRecomendacion) * 100;

      barraSi.style.height = `${porcentajeSi}%`;
      barraNo.style.height = `${porcentajeNo}%`;
    }
  }
};

document.addEventListener('DOMContentLoaded', Books.init);
