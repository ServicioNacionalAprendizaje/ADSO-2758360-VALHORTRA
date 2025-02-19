// Evento principal cuando se carga el DOM
document.addEventListener("DOMContentLoaded", function () {
    cargarAdministradores();
    cargarAgentes();
    cargarTiendas();
    cargarTareas(); // Llamar a la función para cargar tareas
});

// ✅ Cargar Administradores
function cargarAdministradores() {
    fetch("http://localhost:9000/api/users?role=ADMIN")
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener administradores");
            return response.json();
        })
        .then(data => {
            let selectAdmin = document.getElementById("administrador");
            selectAdmin.innerHTML = '<option value="">Seleccione un Administrador</option>';
            data.forEach(admin => {
                selectAdmin.innerHTML += `<option value="${admin.id}">${admin.id} - ${admin.nombre}</option>`;
            });
        })
        .catch(error => console.error("Error al cargar administradores:", error));
}

// ✅ Cargar Agentes
function cargarAgentes() {
    fetch("http://localhost:9000/api/users?role=AGENTE")
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener agentes");
            return response.json();
        })
        .then(data => {
            let selectAgente = document.getElementById("agente");
            selectAgente.innerHTML = '<option value="">Seleccione un Agente</option>';
            data.forEach(agente => {
                selectAgente.innerHTML += `<option value="${agente.id}">${agente.id} - ${agente.nombre}</option>`;
            });
        })
        .catch(error => console.error("Error al cargar agentes:", error));
}

// ✅ Cargar Tiendas
function cargarTiendas() {
    fetch("http://localhost:9000/api/users?role=TIENDA")
        .then(response => {
            if (!response.ok) throw new Error("Error al obtener tiendas");
            return response.json();
        })
        .then(data => {
            let selectTienda = document.getElementById("tienda");
            selectTienda.innerHTML = '<option value="">Seleccione una Tienda</option>';
            data.forEach(tienda => {
                selectTienda.innerHTML += `<option value="${tienda.id}">${tienda.id} - ${tienda.nombre}</option>`;
            });
        })
        .catch(error => console.error("Error al cargar tiendas:", error));
}

// ✅ Asignar Tarea
function crearTarea() {
    let adminId = document.getElementById("administrador").value;
    let agenteId = document.getElementById("agente").value;
    let tiendaId = document.getElementById("tienda").value;

    if (!adminId || !agenteId || !tiendaId) {
        alert("Debe seleccionar un Administrador, un Agente y una Tienda.");
        return;
    }

    // Enviar los datos seleccionados al backend
    fetch(`http://localhost:9000/api/tasks/assign?administradorId=${adminId}&agenteId=${agenteId}&tiendaId=${tiendaId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    })
        .then(response => {
            if (!response.ok) throw new Error("Error en la asignación de la tarea.");
            return response.json();
        })
        .then(data => {
            alert("Tarea asignada correctamente.");
            console.log("Tarea creada:", data);
            cargarTareas(); // Recargar la tabla de tareas
        })
        .catch(error => {
            console.error("Error al asignar tarea:", error);
            alert("Ocurrió un error al asignar la tarea.");
        });
}

// ✅ Cargar Tareas
// Función para cargar las tareas desde la API y mostrarlas en la tabla
function cargarTareas() {
    const url = "http://localhost:9000/api/tasks/all"; // Ruta actualizada para obtener todas las tareas
    const tabla = document.querySelector("#tasksTabla tbody"); // Selecciona el cuerpo de la tabla

    // Limpiar la tabla antes de cargar los datos
    tabla.innerHTML = "";

    fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al obtener las tareas: ${response.status} ${response.statusText}`);
            }
            return response.json();
        })
        .then((data) => {
            console.log("Datos recibidos:", data);

            // Si no hay tareas, mostrar un mensaje
            if (data.length === 0) {
                tabla.innerHTML = `<tr><td colspan="7" class="text-center">No hay tareas disponibles</td></tr>`;
                return;
            }

            // Recorrer los datos y crear filas en la tabla
            data.forEach((tarea) => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
                    <td>${tarea.id}</td>
                    <td>${tarea.administrador.person.firstName} ${tarea.administrador.person.lastName}</td>
                    <td>${tarea.agente.person.firstName} ${tarea.agente.person.lastName}</td>
                    <td>${tarea.tienda.person.firstName}</td>
                    <td>${new Date(tarea.fechaAsignacion).toLocaleString()}</td>
                    <td>${new Date(tarea.assignedAt).toLocaleString()}</td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="eliminarTarea(${tarea.id})">Eliminar</button>
                    </td>
                `;

                tabla.appendChild(fila);
            });
        })
        .catch((error) => {
            console.error("Error al cargar tareas:", error);
            alert("Hubo un problema al cargar las tareas. Revisa la consola para más detalles.");
        });
}

// Función para eliminar una tarea
function eliminarTarea(id) {
    const url = `http://localhost:9000/api/tasks/${id}`; // Endpoint para eliminar tareas

    fetch(url, {
        method: "DELETE",
    })
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Error al eliminar la tarea: ${response.status} ${response.statusText}`);
            }
            alert("Tarea eliminada correctamente");
            cargarTareas(); // Recargar las tareas después de eliminar
        })
        .catch((error) => {
            console.error("Error al eliminar tarea:", error);
            alert("Hubo un problema al eliminar la tarea. Revisa la consola para más detalles.");
        });
}

// Cargar las tareas al cargar la página
document.addEventListener("DOMContentLoaded", cargarTareas);
