document.addEventListener("DOMContentLoaded", cargarUsuarios);

const form = document.getElementById("formUsuario");
const tabla = document.getElementById("tablaUsuarios");

form.addEventListener("submit", function(e) {
    e.preventDefault();
    const id = document.getElementById("idUsuario").value;
    const nombre = document.getElementById("nombre").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (id) {
        // Si hay ID, es actualización
        fetch(`/usuarios/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password })
        }).then(() => {
            cargarUsuarios();
            form.reset();
        });
    } else {
        // Si no hay ID, es creación
        fetch("/usuarios", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, password })
        }).then(() => {
            cargarUsuarios();
            form.reset();
        });
    }
});

function cargarUsuarios() {
    fetch("/usuarios")
        .then(res => res.json())
        .then(data => {
            tabla.innerHTML = "";
            data.forEach(usuario => {
                const fila = document.createElement("tr");
                fila.innerHTML = `
                    <td>${usuario.id}</td>
                    <td>${usuario.nombre}</td>
                    <td>${usuario.email}</td>
                    <td>
                        <button onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                    </td>
                `;
                tabla.appendChild(fila);
            });
        });
}

function editarUsuario(id) {
    fetch(`/usuarios/${id}`)
        .then(res => res.json())
        .then(usuario => {
            document.getElementById("idUsuario").value = usuario.id;
            document.getElementById("nombre").value = usuario.nombre;
            document.getElementById("email").value = usuario.email;
            document.getElementById("password").value = ""; // No cargamos contraseña
        });
}

function eliminarUsuario(id) {
    if (confirm("¿Seguro que quieres eliminar este usuario?")) {
        fetch(`/usuarios/${id}`, {
            method: "DELETE"
        }).then(() => cargarUsuarios());
    }
}
