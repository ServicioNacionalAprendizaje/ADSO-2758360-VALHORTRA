const API_URL_AUTH = 'http://localhost:9000/api/auth';
const API_URL_WORKDAY = 'http://localhost:9000/api/workday/user';
let cronometroInterval;
let segundosTranscurridos = 0;

document.addEventListener("DOMContentLoaded", function () {
    cargarHistorialJornadas();
});

function validarCodigo() {
    const userId = document.getElementById('user_id').value;
    const code = document.getElementById('codigo').value;

    if (!userId || !code) {
        alert("Por favor, ingrese el ID de usuario y el código de acceso.");
        return;
    }

    const loginData = {
        userId: parseInt(userId),
        code: code
    };

    console.log("Enviando datos de autenticación:", loginData);

    $.ajax({
        url: `${API_URL_AUTH}/login`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(loginData),
        success: function (response) {
            console.log("Respuesta del servidor:", response);
            alert("Usuario autenticado. Jornada iniciada.");
            document.getElementById("mensaje").textContent = "Usuario autenticado. Jornada iniciada.";
            document.getElementById("mensaje").style.display = "block";
            iniciarCronometro();
            cargarHistorialJornadas();
        },
        error: function (xhr) {
            console.error("Error en la autenticación:", xhr.responseText);
            alert("Autenticación fallida. Verifica el código o el usuario.");
        }
    });
}

function finalizarTurno() {
    const userId = document.getElementById('user_id').value;

    if (!userId) {
        alert("Por favor, ingrese el ID de usuario para finalizar la sesión.");
        return;
    }

    const endSessionData = { userId: parseInt(userId) };

    $.ajax({
        url: `${API_URL_AUTH}/end-session`,
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify(endSessionData),
        success: function (response) {
            console.log("Sesión finalizada:", response);
            alert("Sesión finalizada correctamente.");
            document.getElementById("mensaje").textContent = "Sesión finalizada.";
            document.getElementById("mensaje").style.display = "block";
            detenerCronometro();
            cargarHistorialJornadas();
        },
        error: function (xhr) {
            console.error("Error al finalizar la sesión:", xhr.responseText);
            alert("Error al finalizar la sesión.");
        }
    });
}

function cargarHistorialJornadas() {
    const userId = document.getElementById('user_id').value;
    const listaJornadas = document.getElementById('listaJornadas');
    listaJornadas.innerHTML = "<li class='list-group-item text-center'>Cargando...</li>";

    if (!userId) {
        listaJornadas.innerHTML = "<li class='list-group-item text-center text-warning'>Ingrese un ID de usuario</li>";
        return;
    }

    $.ajax({
        url: `${API_URL_WORKDAY}/${userId}`,
        type: 'GET',
        dataType: 'json',
        success: function (data) {
            listaJornadas.innerHTML = "";
            if (data.length === 0) {
                listaJornadas.innerHTML = "<li class='list-group-item text-center'>No hay registros</li>";
                return;
            }
            data.forEach(jornada => {
                let item = `<li class='list-group-item'>Fecha: ${jornada.date} - Estado: ${jornada.isActive ? 'Activo' : 'Finalizado'}</li>`;
                listaJornadas.innerHTML += item;
            });
        },
        error: function (xhr) {
            console.error("Error al cargar historial:", xhr.responseText);
            listaJornadas.innerHTML = "<li class='list-group-item text-center text-danger'>Error al cargar registros</li>";
        }
    });
}

function iniciarCronometro() {
    detenerCronometro(); // Reiniciar si ya estaba corriendo
    segundosTranscurridos = 0;
    cronometroInterval = setInterval(() => {
        segundosTranscurridos++;
        actualizarCronometro();
    }, 1000);
}

function detenerCronometro() {
    clearInterval(cronometroInterval);
    document.getElementById("cronometro").textContent = "00:00:00";
}

function actualizarCronometro() {
    let horas = Math.floor(segundosTranscurridos / 3600);
    let minutos = Math.floor((segundosTranscurridos % 3600) / 60);
    let segundos = segundosTranscurridos % 60;

    document.getElementById("cronometro").textContent =
        `${String(horas).padStart(2, '0')}:${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}



function obtenerTiempoTranscurrido() {
    let horas = Math.floor(segundosTranscurridos / 3600);
    let minutos = Math.floor((segundosTranscurridos % 3600) / 60);
    let segundos = segundosTranscurridos % 60;
    return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}`;
}
