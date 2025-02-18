document.addEventListener("DOMContentLoaded", function () {
    cargarAdministradores();
    cargarAgentes();
    cargarTiendas();
});

// ✅ Cargar Administradores
function cargarAdministradores() {
    fetch("http://localhost:9000/api/users?role=ADMIN")
        .then(response => response.json())
        .then(data => {
            let selectAdmin = document.getElementById("administrador");
            selectAdmin.innerHTML = '<option value="">Seleccione un Administrador</option>';
            data.forEach(admin => {
                selectAdmin.innerHTML += `<option value="${admin.id}">${admin.id}</option>`;
            });
        })
        .catch(error => console.error("Error al cargar administradores:", error));
}

// ✅ Cargar Agentes
function cargarAgentes() {
    fetch("http://localhost:9000/api/users?role=AGENTE")
        .then(response => response.json())
        .then(data => {
            let selectAgente = document.getElementById("agente");
            selectAgente.innerHTML = '<option value="">Seleccione un Agente</option>';
            data.forEach(agente => {
                selectAgente.innerHTML += `<option value="${agente.id}">${agente.id}</option>`;
            });
        })
        .catch(error => console.error("Error al cargar agentes:", error));
}

// ✅ Cargar Tiendas
function cargarTiendas() {
    fetch("http://localhost:9000/api/users?role=TIENDA")
        .then(response => response.json())
        .then(data => {
            let selectTienda = document.getElementById("tienda");
            selectTienda.innerHTML = '<option value="">Seleccione una Tienda</option>';
            data.forEach(tienda => {
                selectTienda.innerHTML += `<option value="${tienda.id}">${tienda.id}</option>`;
            });
        })
        .catch(error => console.error(" Error al cargar tiendas:", error));
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

    // Obtén los roles de los elementos seleccionados
    let roleAdmin = "ADMINISTRADOR";  // Fijo ya que solo puede ser ADMIN
    let roleAgente = "AGENTE";        // Fijo ya que solo puede ser AGENTE
    let roleTienda = "TIENDA";        // Fijo ya que solo puede ser TIENDA

    // Enviar los datos de los roles como parámetros
    fetch(`http://localhost:9000/api/tasks/assign?roleAdmin=${roleAdmin}&roleAgente=${roleAgente}&roleTienda=${roleTienda}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
    })
    .then(response => response.json())
    .then(data => {
        alert("Tarea asignada correctamente.");
        console.log("Tarea creada:", data);
    })
    .catch(error => console.error("Error al asignar tarea:", error));
}
