const API_URL = 'http://localhost:9000/api/person';

document.addEventListener("DOMContentLoaded", function () {
    obtenerPersonas();
});

function obtenerPersonas() {
    console.log("Obteniendo datos de la base de datos...");

    $.ajax({
        url: API_URL, 
        type: 'GET',
        success: function (data) {
            console.log("Datos recibidos:", data); 
            let tbody = document.querySelector("#personasTabla tbody");
            tbody.innerHTML = ""; 

            if (data.length === 0) {
                tbody.innerHTML = `<tr><td colspan="9" class="text-center">No hay personas registradas.</td></tr>`;
                return;
            }

            data.forEach(person => {
                let row = `<tr>
                    <td>${person.id}</td>
                    <td>${person.firstName}</td>
                    <td>${person.lastName}</td>
                    <td>${person.document}</td>
                    <td>${person.address}</td>
                    <td>${person.phone}</td>
                    <td>${person.email}</td>
                    <td>${person.birthDate}</td>
                    <td>
                        <button class='btn btn-warning btn-sm' onclick='cargarPersona(${person.id})'>Editar</button>
                        <button class='btn btn-danger btn-sm' onclick='eliminarPersona(${person.id})'>Eliminar</button>
                    </td>
                </tr>`;
                tbody.innerHTML += row;
            });
        },
        error: function (xhr, status, error) {
            console.error("Error al obtener personas:", error);
            alert("No se pudieron cargar los datos. Verifica la conexión con el servidor.");
        }
    });
}

function cargarPersona(id) {
    $.ajax({
        url: `${API_URL}/${id}`,
        type: 'GET',
        success: function (person) {
            document.getElementById('firstName').value = person.firstName;
            document.getElementById('lastName').value = person.lastName;
            document.getElementById('document').value = person.document;
            document.getElementById('address').value = person.address;
            document.getElementById('phone').value = person.phone;
            document.getElementById('email').value = person.email;
            document.getElementById('birthDate').value = person.birthDate;
            document.getElementById('btnActualizar').disabled = false;
            document.getElementById('btnActualizar').setAttribute('onclick', `actualizarPersona(${id})`);
        },
        error: function () {
            alert("Error al cargar los datos de la persona.");
        }
    });
}

function crearPersona() {
    const persona = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        document: document.getElementById('document').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        birthDate: document.getElementById('birthDate').value ? new Date(document.getElementById('birthDate').value).toISOString().split('T')[0] : null
    };

    console.log("Enviando persona:", persona);

    $.ajax({
        url: API_URL,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(persona),
        success: function (response) {
            console.log("Respuesta del servidor:", response);
            alert("Persona creada con éxito");
            obtenerPersonas();
            document.getElementById("personaForm").reset();
        },
        error: function (xhr, status, error) {
            console.error("Error en la solicitud:", xhr.responseText);
            alert("Error al crear la persona: " + xhr.responseText);
        }
    });
}



function actualizarPersona(id) {
    const persona = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        document: document.getElementById('document').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        birthDateAsString: document.getElementById('birthDate').value
    };

    $.ajax({
        url: `${API_URL}/${id}`,
        type: 'PUT',
        contentType: 'application/json',
        data: JSON.stringify(persona),
        success: function () {
            alert("Persona actualizada con éxito");
            obtenerPersonas();
            document.getElementById("personaForm").reset();
            document.getElementById('btnActualizar').disabled = true;
        },
        error: function () {
            alert("Error al actualizar la persona");
        }
    });
}

function eliminarPersona(id) {
    if (confirm("¿Seguro que deseas eliminar esta persona?")) {
        $.ajax({
            url: `${API_URL}/${id}`,
            type: 'DELETE',
            success: function () {
                alert("Persona eliminada con éxito");
                obtenerPersonas();
            },
            error: function () {
                alert("Error al eliminar la persona");
            }
        });
    }
}
