<script>
    document.addEventListener("DOMContentLoaded", function() {
        cargarAgentesAsignados();
    });

    function cargarAgentesAsignados() {
        fetch("http://localhost:9000/api/assigned-agents") // Reemplaza con la URL correcta de tu API
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la respuesta del servidor: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                let tbody = document.querySelector("#assignedAgentsTable tbody");
                tbody.innerHTML = ""; // Limpiar la tabla antes de agregar nuevos datos

                if (!Array.isArray(data) || data.length === 0) {
                    tbody.innerHTML = "<tr><td colspan='6' class='text-center'>No hay agentes asignados</td></tr>";
                    return;
                }

                data.forEach(agent => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${agent.id ?? "N/A"}</td>
                            <td>${agent.nombre ?? "Desconocido"}</td>
                            <td>${agent.documento ?? "No disponible"}</td>
                            <td>${agent.telefono ?? "No disponible"}</td>
                            <td>${agent.email ?? "No disponible"}</td>
                            <td>${agent.codigoActivacion ?? "No asignado"}</td>
                        </tr>
                    `;
                });
            })
            .catch(error => {
                console.error("❌ Error al cargar los agentes asignados:", error);
            });
    }
</script>
