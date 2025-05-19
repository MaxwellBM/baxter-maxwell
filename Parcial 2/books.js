const Books = {
  usuario: null,

  init: () => {
    const sesion = Storage.load('sesion');
    const usuarios = Storage.load('usuarios') || [];
    Books.usuario = usuarios.find(u => u.username === sesion?.username);

    if (!Books.usuario) {
      window.location.href = 'index.html';
      return;
    }

    Books.renderTabla();

    document.getElementById('form-libro').addEventListener('submit', Books.agregarLibro);
    document.getElementById('btn-mostrar-form').addEventListener('click', () => {
      document.getElementById('form-seccion').classList.toggle('visible');
    });
  },

  renderTabla: () => {
    const tbody = document.querySelector('#tabla-libros tbody');
    tbody.innerHTML = '';

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

    if (!titulo || !autor || !fecha || isNaN(paginas)) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    Books.usuario.libros.push({ titulo, autor, fecha, paginas, recomendar });

    const usuarios = Storage.load('usuarios');
    const idx = usuarios.findIndex(u => u.username === Books.usuario.username);
    usuarios[idx] = Books.usuario;
    Storage.save('usuarios', usuarios);

    Books.renderTabla();
    document.getElementById('form-libro').reset();
    document.getElementById('form-seccion').classList.remove('visible');
  },

  eliminarLibro: (index) => {
    Books.usuario.libros.splice(index, 1);
    const usuarios = Storage.load('usuarios');
    const idx = usuarios.findIndex(u => u.username === Books.usuario.username);
    usuarios[idx] = Books.usuario;
    Storage.save('usuarios', usuarios);
    Books.renderTabla();
  }
};

document.addEventListener('DOMContentLoaded', Books.init);
