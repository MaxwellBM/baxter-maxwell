function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
}

const Auth = {
  login: (username, password) => {
    const usuarios = Storage.load('usuarios') || [];
    const user = usuarios.find(u => u.username === username && u.password === hashCode(password));

    if (user) {
      Storage.save('sesion', { username });
      window.location.href = 'dashboard.html';
    } else {
      alert('Usuario o contraseña incorrectos');
    }
  },

  register: (username, nombre, password) => {
    let usuarios = Storage.load('usuarios') || [];

    if (usuarios.find(u => u.username === username)) {
      alert('El nombre de usuario ya existe');
      return;
    }

    const nuevoUsuario = {
      username,
      nombre,
      password: hashCode(password),
      libros: []
    };

    usuarios.push(nuevoUsuario);
    Storage.save('usuarios', usuarios);
    Storage.save('sesion', { username });
    window.location.href = 'dashboard.html';
  },

  verificarSesion: () => {
    const sesion = Storage.load('sesion');
    if (sesion) {
      window.location.href = 'dashboard.html';
    }
  }
};

// Eventos dinámicos según la página cargada
document.addEventListener('DOMContentLoaded', () => {
  Auth.verificarSesion();

  const loginForm = document.getElementById('form-login');
  const registroForm = document.getElementById('form-registro');

  if (loginForm) {
    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value.trim();
      Auth.login(username, password);
    });

    const irARegistro = document.getElementById('ir-a-registro');
    irARegistro?.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('vista-login').style.display = 'none';
      document.getElementById('vista-registro').style.display = 'block';
    });
  }

  if (registroForm) {
    registroForm.addEventListener('submit', e => {
      e.preventDefault();
      const username = document.getElementById('registro-username').value.trim();
      const nombre = document.getElementById('registro-nombre').value.trim();
      const password = document.getElementById('registro-password').value.trim();
      Auth.register(username, nombre, password);
    });

    const irALogin = document.getElementById('ir-a-login');
    irALogin?.addEventListener('click', e => {
      e.preventDefault();
      document.getElementById('vista-login').style.display = 'block';
      document.getElementById('vista-registro').style.display = 'none';
    });
  }
});
