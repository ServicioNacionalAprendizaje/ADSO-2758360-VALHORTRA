document.addEventListener("DOMContentLoaded", function () {
    cargarUsuarios("ADMINISTRADOR", "administrador");
    cargarUsuarios("AGENTE", "agente");
    cargarUsuarios("TIENDA", "tienda");
    cargarTareas();
});

// Variable para saber si estamos editando una tarea
let editingTaskId = null;

function cargarUsuarios(rol, selectId) {
    fetch("http://localhost:9000/api/users")
        .then(response => response.json())
        .then(data => {
            let select = document.getElementById(selectId);
            select.innerHTML = `<option value="">Seleccione un ${rol}</option>`;
            data.forEach(user => {
                if (user.role === rol && user.person) {
                    select.innerHTML += `<option value="${user.id}">${user.person.firstName} ${user.person.lastName}</option>`;
                }
            });
        })
        .catch(error => console.error(`Error al cargar ${rol}:`, error));
}

function cargarTareas() {
    fetch("http://localhost:9000/api/tasks/all")
        .then(response => response.json())
        .then(data => {
            let tbody = document.querySelector("#tasksTabla tbody");
            tbody.innerHTML = "";
            data.forEach(task => {
                let row = `<tr>
                    <td>${task.id}</td>
                    <td>${task.administrador ? task.administrador.person.firstName : 'No asignado'}</td>
                    <td>${task.agente ? task.agente.person.firstName : 'No asignado'}</td>
                    <td>${task.tienda ? task.tienda.person.firstName : 'No asignado'}</td>
                    <td>${new Date(task.fechaAsignacion).toLocaleString()}</td>
                    <td>${new Date(task.fechaCreacion).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-warning" onclick="editarTarea(${task.id})">Editar</button>
                        <button class="btn btn-danger" onclick="eliminarTarea(${task.id})">Eliminar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        })
        .catch(error => console.error("Error al cargar tareas:", error));
}

function editarTarea(id) {
    fetch(`http://localhost:9000/api/tasks/${id}`)
        .then(response => response.json())
        .then(task => {
            // Rellenar los campos con los datos de la tarea seleccionada
            document.getElementById("administrador").value = task.administrador.id;
            document.getElementById("agente").value = task.agente.id;
            document.getElementById("tienda").value = task.tienda.id;

            // Guardar el ID de la tarea en edición
            editingTaskId = id;

            // Configurar botones
            let btnSave = document.getElementById("submitBtn");
            btnSave.textContent = "Limpiar";
            btnSave.setAttribute("onclick", "resetForm()"); // Ahora el botón sirve para limpiar

            document.getElementById("btnActualizar").disabled = false; // Habilitar "Actualizar"
        })
        .catch(error => console.error("Error al obtener tarea:", error));
}

function actualizarTarea() {
    if (!editingTaskId) {
        alert("Error: No hay tarea seleccionada para actualizar.");
        return;
    }

    let administrador = document.getElementById("administrador").value;
    let agente = document.getElementById("agente").value;
    let tienda = document.getElementById("tienda").value;

    if (!administrador || !agente || !tienda) {
        alert("Debe seleccionar todos los campos.");
        return;
    }

    fetch(`http://localhost:9000/api/tasks/${editingTaskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            administradorId: Number(administrador),
            agenteId: Number(agente),
            tiendaId: Number(tienda)
        })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(err => { throw new Error(`Error ${response.status}: ${JSON.stringify(err)}`); });
        }
        return response.json();
    })
    .then(() => {
        console.log("Tarea actualizada exitosamente.");
        alert("Tarea actualizada con éxito.");
        cargarTareas();
        resetForm(); // Restablecer el formulario después de actualizar
    })
    .catch(error => {
        console.error("Error al actualizar tarea:", error);
        alert("No se pudo actualizar la tarea.");
    });
}

function resetForm() {
    // Limpiar el formulario
    document.getElementById("taskForm").reset();

    // Restablecer variables
    editingTaskId = null;

    // Restaurar el botón a "Crear Tarea"
    let btnSave = document.getElementById("submitBtn");
    btnSave.textContent = "Crear Tarea";
    btnSave.setAttribute("onclick", "crearTarea()"); // Volver a su acción original

    // Deshabilitar "Actualizar"
    document.getElementById("btnActualizar").disabled = true;
}

function eliminarTarea(id) {
    fetch(`http://localhost:9000/api/tasks/${id}`, {
        method: "DELETE"
    })
    .then(() => {
        console.log("Tarea eliminada");
        cargarTareas(); // Recargar la lista de tareas
    })
    .catch(error => console.error("Error al eliminar tarea:", error));
}

cargarTareas();
