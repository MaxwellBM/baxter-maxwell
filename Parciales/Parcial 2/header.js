const Header = {
  mostrarNombreUsuario: () => {
    const sesion = Storage.load('sesion');
    const usuarios = Storage.load('usuarios') || [];
    const header = document.getElementById('usuario-header');

    if (!sesion || !sesion.username) {
      window.location.href = 'index.html';
      return;
    }

    const usuario = usuarios.find(u => u.username === sesion.username);
    if (!usuario) {
      window.location.href = 'index.html';
      return;
    }

    header.innerHTML = `
      <div class="barra-superior">
        <span id="ir-perfil" style="cursor:pointer; text-decoration: underline;">👤 ${usuario.nombre}</span>
        <button id="cerrar-sesion">Cerrar sesión</button>
      </div>
    `;

    // Redirige a perfil.html al hacer clic en el nombre
    document.getElementById('ir-perfil').addEventListener('click', () => {
      window.location.href = 'perfil.html';
    });

    // Cierra sesión
    document.getElementById('cerrar-sesion').addEventListener('click', () => {
      Storage.remove('sesion');
      window.location.href = 'index.html';
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  Header.mostrarNombreUsuario();
});
