function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Validación segura de contraseña
function esContrasenaValida(password) {
  const tieneLongitud = password.length >= 8;
  const tieneEspecial = /[^A-Za-z0-9]/.test(password);
  return tieneLongitud && tieneEspecial;
}

document.addEventListener('DOMContentLoaded', () => {
  const sesion = Storage.load("sesion");
  const usuarios = Storage.load("usuarios") || [];
  const user = usuarios.find(u => u.username === sesion?.username);

  if (!user) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("perfil-username").value = user.username;
  document.getElementById("perfil-nombre").value = user.nombre;

  document.getElementById("form-perfil").addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoNombre = document.getElementById("perfil-nombre").value.trim();
    const nuevaClave = document.getElementById("perfil-password").value;

    if (!nuevoNombre) {
      alert("El nombre no puede estar vacío.");
      return;
    }

    const idx = usuarios.findIndex(u => u.username === user.username);
    usuarios[idx].nombre = nuevoNombre;

    if (nuevaClave) {
      if (!esContrasenaValida(nuevaClave)) {
        alert("La contraseña debe tener al menos 8 caracteres y un carácter especial.");
        return;
      }
      usuarios[idx].password = hashCode(nuevaClave);
    }

    Storage.save("usuarios", usuarios);
    alert("Perfil actualizado correctamente.");
    document.getElementById("perfil-password").value = "";
    Storage.remove("sesion");
    window.location.href = "index.html";
  });
});
