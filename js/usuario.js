// Se ejecuta cuando la página ha cargado completamente
document.addEventListener("DOMContentLoaded", function () {
    cargarUsuarios(); // Cargar la lista de usuarios al inicio

    // Agregar evento al botón de filtro
    document.getElementById("filterUserButton").addEventListener("click", filtrarUsuarios);

    // Permitir filtrar al presionar "Enter"
    document.getElementById("filterUserInput").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            filtrarUsuarios();
        }
    });
});

// Función para obtener y mostrar los usuarios en la tabla
function cargarUsuarios() {
    fetch("http://localhost:9000/api/users") // Petición a la API de usuarios
        .then(response => response.json()) // Convertir la respuesta a JSON
        .then(data => {
            let tbody = document.querySelector("#usuariosTabla tbody");
            tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

            // Recorrer la lista de usuarios y agregar cada uno como una fila en la tabla
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

function filtrarUsuarios() {
    let criterio = document.getElementById("filterUserType")?.value || ""; // Obtener el criterio
    let valor = document.getElementById("filterUserInput")?.value.toLowerCase().trim() || ""; // Valor de búsqueda

    let filas = document.querySelectorAll("#usuariosTabla tbody tr"); // Obtener filas

    if (!criterio || !filas.length) return; // Salir si no hay criterio o filas

    // Mapeo de criterios a índices de columnas
    const criterioColumnas = {
        "username": 1,
        "role": 2,
        "isActive": 3
    };

    let columnaIndex = criterioColumnas[criterio]; // Obtener el índice de la columna

    filas.forEach(fila => {
        let columnaTexto = fila.cells[columnaIndex]?.textContent.toLowerCase().trim() || ""; // Obtener el texto de la celda
        fila.style.display = columnaTexto.includes(valor) ? "" : "none"; // Filtrar
    });
}


// Función para crear un nuevo usuario
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
        cargarUsuarios(); // Recargar la lista de usuarios
        limpiarFormulario(); // Limpiar los campos del formulario
    })
    .catch(error => {
        console.error("Error creando usuario:", error);
        alert("No se pudo crear el usuario.");
    });
}

// Función para obtener los datos de un usuario y cargarlos en el formulario para editar
function editarUsuario(id) {
    fetch(`http://localhost:9000/api/users/${id}`)
        .then(response => response.json())
        .then(usuario => {
            document.getElementById("userId").value = usuario.id; // Guardar el ID en un campo oculto
            document.getElementById("username").value = usuario.username;
            document.getElementById("password").value = ""; // No mostrar la contraseña por seguridad
            document.getElementById("role").value = usuario.role;
            document.getElementById("isActive").value = usuario.isActive ? "true" : "false";
            document.getElementById("person_id").value = usuario.person ? usuario.person.id : "";

            // Habilitar botón de actualizar y deshabilitar "Crear"
            document.getElementById("btnCrear").disabled = true;
            document.getElementById("btnActualizar").disabled = false;
        })
        .catch(error => console.error("Error obteniendo usuario:", error));
}

// Función para actualizar un usuario
function actualizarUsuario() {
    let id = document.getElementById("userId").value;
    let password = document.getElementById("password").value;

    let usuario = {
        username: document.getElementById("username").value,
        role: document.getElementById("role").value,
        isActive: document.getElementById("isActive").value === "true",
        person: { id: parseInt(document.getElementById("person_id").value) || null }
    };

    // Solo enviar la contraseña si el usuario ha ingresado una nueva
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
        cargarUsuarios(); // Recargar la tabla después de actualizar
        limpiarFormulario(); // Limpiar el formulario
    })
    .catch(error => {
        console.error("Error actualizando usuario:", error);
        alert("No se pudo actualizar el usuario.");
    });
}

// Función para eliminar un usuario
function eliminarUsuario(id) {
    if (!confirm("¿Seguro que deseas eliminar este usuario?")) return; // Confirmar eliminación

    fetch(`http://localhost:9000/api/users/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); });
        }
        cargarUsuarios(); // Recargar la lista después de eliminar
    })
    .catch(error => {
        console.error("Error eliminando usuario:", error);
        alert("No se pudo eliminar el usuario.");
    });
}

// Función para limpiar los campos del formulario y resetear botones
function limpiarFormulario() {
    document.getElementById("usuarioForm").reset(); // Resetear el formulario
    document.getElementById("userId").value = ""; // Limpiar el ID oculto

    // Habilitar botón "Crear" y deshabilitar "Actualizar"
    document.getElementById("btnCrear").disabled = false;
    document.getElementById("btnActualizar").disabled = true;
}
