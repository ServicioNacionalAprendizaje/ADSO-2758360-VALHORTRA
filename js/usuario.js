document.addEventListener("DOMContentLoaded", function () {
    cargarUsuarios();
});

function cargarUsuarios() {
    fetch("http://localhost:9000/api/users")
        .then(response => response.json())
        .then(data => {
            let tbody = document.querySelector("#usuariosTabla tbody");
            tbody.innerHTML = "";
            data.forEach(usuario => {
                let fila = `<tr>
                    <td>${usuario.id}</td>
                    <td>${usuario.username}</td>
                    <td>${usuario.role}</td>
                    <td>${usuario.isActive ? 'Activo' : 'Inactivo'}</td>
                    <td>${usuario.person ? usuario.person.id : 'Sin asignar'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarUsuario(${usuario.id})">Eliminar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += fila;
            });
        })
        .catch(error => console.error("Error cargando usuarios:", error));
}

function crearUsuario() {
    let usuario = {
        username: document.getElementById("username").value,
        password: document.getElementById("password").value,
        role: document.getElementById("role").value,
        isActive: document.getElementById("isActive").value === "true",
        person: { id: parseInt(document.getElementById("person_id").value) || null }
    };

    fetch("http://localhost:9000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(() => {
        cargarUsuarios();
        limpiarFormulario();
    })
    .catch(error => {
        console.error("Error creando usuario:", error);
        alert("No se pudo crear el usuario.");
    });
}

function editarUsuario(id) {
    fetch(`http://localhost:9000/api/users/${id}`)
        .then(response => response.json())
        .then(usuario => {
            document.getElementById("userId").value = usuario.id; // Campo oculto
            document.getElementById("username").value = usuario.username;
            document.getElementById("password").value = ""; // No mostrar la contraseña
            document.getElementById("role").value = usuario.role;
            document.getElementById("isActive").value = usuario.isActive ? "true" : "false";
            document.getElementById("person_id").value = usuario.person ? usuario.person.id : "";

            // Habilitar botón de actualizar y deshabilitar "Crear"
            document.getElementById("btnCrear").disabled = true;
            document.getElementById("btnActualizar").disabled = false;
        })
        .catch(error => console.error("Error obteniendo usuario:", error));
}

function actualizarUsuario() {
    let id = document.getElementById("userId").value;
    let password = document.getElementById("password").value;

    let usuario = {
        username: document.getElementById("username").value,
        role: document.getElementById("role").value,
        isActive: document.getElementById("isActive").value === "true",
        person: { id: parseInt(document.getElementById("person_id").value) || null }
    };

    if (password.trim() !== "") {
        usuario.password = password;
    }

    fetch(`http://localhost:9000/api/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(usuario)
    })
    .then(response => response.json())
    .then(() => {
        cargarUsuarios();
        limpiarFormulario();
    })
    .catch(error => {
        console.error("Error actualizando usuario:", error);
        alert("No se pudo actualizar el usuario.");
    });
}

function eliminarUsuario(id) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return;

    fetch(`http://localhost:9000/api/users/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        cargarUsuarios();
    })
    .catch(error => {
        console.error("Error eliminando usuario:", error);
        alert("No se pudo eliminar el usuario.");
    });
}

function limpiarFormulario() {
    document.getElementById("usuarioForm").reset();
    document.getElementById("userId").value = "";

    // Habilitar botón "Crear" y deshabilitar "Actualizar"
    document.getElementById("btnCrear").disabled = false;
    document.getElementById("btnActualizar").disabled = true;
}
