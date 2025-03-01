$(document).ready(function () {
    // Capturamos el evento "submit" del formulario de login
    $("#loginForm").submit(function (event) {
        event.preventDefault(); // Evita que el formulario se envíe normalmente

        // Obtenemos los valores ingresados en los campos de usuario y contraseña
        var username = $("#username").val();
        var password = $("#password").val();

        // Realizamos una petición AJAX para enviar los datos al backend
        $.ajax({
            url: "http://localhost:9000/api/auth/loginsession", // Endpoint del backend
            type: "POST", // Método HTTP para enviar los datos
            contentType: "application/json", // Tipo de contenido JSON
            data: JSON.stringify({ username: username, password: password }), // Convertimos los datos a JSON

            // Función que se ejecuta si la solicitud es exitosa
            success: function (response) {
                console.log("Respuesta del servidor:", response); // Mostramos la respuesta en la consola

                // Verificamos el rol del usuario autenticado
                if (response.role === "ADMINISTRADOR") {
                    // Si el usuario es ADMINISTRADOR, lo redirigimos a la página de administración
                    window.location.href = "../view/admin.html"; // Ajusta la ruta si es necesario
                } else {
                    // Si el usuario no es administrador, mostramos un mensaje de alerta
                    alert("No tienes permisos de administrador.");
                }
            },

            // Función que se ejecuta si hay un error en la solicitud
            error: function (xhr) {
                alert("Usuario o contraseña incorrectos"); // Mostramos una alerta de error
                console.error("Error en la autenticación:", xhr); // Registramos el error en la consola
            }
        });
    });
});
