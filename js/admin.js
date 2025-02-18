/*  ********************************
    ********************************
    ADMINISTRADOR - GESTION USUARIOS
    ********************************
    ********************************
    
*/

 
// Redirección al hacer clic en el botón
$(document).ready(function () {
    var btnGestionUsuarios = $("#btnGestionUsuarios");
    if (btnGestionUsuarios.length) {
        btnGestionUsuarios.click(function () {
            console.log("Botón 'Gestionar Usuarios' clickeado"); // Para depuración
            window.location.href = "usuario.html"; // Asegúrate de que usuario.html esté en /view/
        });
    } else {
        console.error("El botón 'btnGestionUsuarios' no existe en esta página.");
    }
});


/*  ********************************
    ********************************
    ADMINISTRADOR - GESTION PERSONAS
    ********************************
    ********************************
    
*/

// Redirección al hacer clic en el botón
$(document).ready(function () {
    var btnGestionPersonas = $("#btnGestionPersonas");
    if (btnGestionPersonas.length) {
        btnGestionPersonas.click(function () {
            console.log("Botón 'Gestionar Personas' clickeado"); // Para depuración
            window.location.href = "persona.html"; // Asegúrate de que persona.html esté en /view/
        });
    } else {
        console.error("El botón 'btnGestionPersonas' no existe en esta página.");
    }
});


/*  ********************************
    ********************************
    ADMINISTRADOR - GESTION ADMINISTRADORES
    ********************************
    ********************************
    
*/

// Redirección al hacer clic en el botón
$(document).ready(function () {
    var btnGestionAdministradores = $("#btnGestionAdministradores");
    if (btnGestionAdministradores.length) {
        btnGestionAdministradores.click(function () {
            console.log("Botón 'Gestionar Administradores' clickeado"); // Para depuración
            window.location.href = "gestionar_admin.html"; // Asegúrate de que administradores.html esté en /view/
        });
    } else {
        console.error("El botón 'btnGestionAdministradores' no existe en esta página.");
    }
});

/*  ********************************
    ********************************
    ADMINISTRADOR - GESTION AGENTES
    ********************************
    ********************************
    
*/

// Redirección al hacer clic en el botón
$(document).ready(function () {
    var btnGestionAgentes = $("#btnGestionAgentes");
    if (btnGestionAgentes.length) {
        btnGestionAgentes.click(function () {
            console.log("Botón 'Gestionar Agentes' clickeado"); // Para depuración
            window.location.href = "agente.html"; // Asegúrate de que agentes.html esté en /view/
        });
    } else {
        console.error("El botón 'btnGestionAgentes' no existe en esta página.");
    }
});

/*  ********************************
    ********************************
    ADMINISTRADOR - GESTION TIENDAS
    ********************************
    ********************************
    
*/

// Redirección al hacer clic en el botón
$(document).ready(function () {
    var btnGestionTiendas = $("#btnGestionTiendas");
    if (btnGestionTiendas.length) {
        btnGestionTiendas.click(function () {
            console.log("Botón 'Gestionar Tiendas' clickeado"); // Para depuración
            window.location.href = "tienda.html"; // Asegúrate de que tiendas.html esté en /view/
        });
    } else {
        console.error("El botón 'btnGestionTiendas' no existe en esta página.");
    }
});

/*  ********************************
    ********************************
    ADMINISTRADOR - ASIGNAR TAREAS
    ********************************
    ********************************
    
*/

// Redirección al hacer clic en el botón
$(document).ready(function () {
    var btnAsignarTareas = $("#btnAsignarTareas");
    if (btnAsignarTareas.length) {
        btnAsignarTareas.click(function () {
            console.log("Botón 'Asignar Tareas' clickeado"); // Para depuración
            window.location.href = "asignar_tarea.html"; // Asegúrate de que asignar_tareas.html esté en /view/
        });
    } else {
        console.error("El botón 'btnAsignarTareas' no existe en esta página.");
    }
});


/*  ********************************
    ********************************
    ADMINISTRADOR - GESTION CODIGO
    ********************************
    ********************************
    
*/

document.addEventListener("DOMContentLoaded", function () {
    const btnCodigo = document.getElementById("btnCodigo");
    const panel = document.getElementById("panel");

    if (btnCodigo) {
        btnCodigo.addEventListener("click", function () {
            fetch("http://localhost:9000/api/codes/today")
                .then(response => response.json())
                .then(data => {
                    if (data && data.code) {
                        panel.innerHTML = `
                            <div class="text-center">
                                <h3 class="text-success">Código del día</h3>
                                <p class="fs-4 fw-bold">${data.code}</p>
                            </div>
                        `;
                    } else {
                        panel.innerHTML = `<p class="text-danger text-center">No se encontró un código disponible.</p>`;
                    }
                })
                .catch(error => {
                    console.error("Error al obtener el código:", error);
                    panel.innerHTML = `<p class="text-danger text-center">Error al cargar el código.</p>`;
                });
        });
    }
});



