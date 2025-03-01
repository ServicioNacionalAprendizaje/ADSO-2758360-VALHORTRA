package com.SENA.GOAPPv2.Controller;

import com.SENA.GOAPPv2.Service.AuthenticationService;
import com.SENA.GOAPPv2.DTO.LoginSession;
import com.SENA.GOAPPv2.Entity.User;
import com.SENA.GOAPPv2.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {

    @Autowired
    private AuthenticationService authenticationService;

    @Autowired
    private UserRepository userRepository;

    /**
     * Endpoint para autenticar a un usuario utilizando un código.
     * Recibe el `userId` y el `code` desde el cuerpo de la solicitud.
     *
     * @param loginRequest Objeto con los datos de inicio de sesión.
     * @return Respuesta HTTP indicando el resultado de la autenticación.
     */
    @PostMapping("/login")
    public ResponseEntity<String> authenticateUser(@RequestBody LoginRequest loginRequest) {
        Long userId = loginRequest.getUserId();
        String code = loginRequest.getCode();

        // Intenta autenticar al usuario
        boolean isAuthenticated = authenticationService.authenticate(userId, code);

        if (isAuthenticated) {
            return ResponseEntity.ok("Usuario autenticado. Jornada iniciada.");
        } else {
            return ResponseEntity.badRequest().body("Autenticación fallida. Verifica el código o el usuario.");
        }
    }

    /**
     * Nuevo endpoint para inicio de sesión con usuario, contraseña y redirección según rol.
     * @param loginRequest Objeto con username y password.
     * @return Respuesta con datos de sesión o error 401 si las credenciales son incorrectas.
     */
    @PostMapping("/loginsession")
    public ResponseEntity<?> login(@RequestBody LoginUserRequest loginRequest) {
        Optional<User> userOpt = userRepository.findByUsername(loginRequest.getUsername());

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(loginRequest.getPassword())) { // ⚠️ Usa hashing en producción
                return ResponseEntity.ok(new LoginSession(user.getUsername(), user.getRole().name()));
            }
        }
        return ResponseEntity.status(401).body("Usuario o contraseña incorrectos");
    }

    /**
     * Endpoint para obtener el tiempo transcurrido desde que el usuario inició sesión.
     * Recibe el `userId` desde la solicitud.
     *
     * @param userId El ID del usuario autenticado.
     * @return El tiempo transcurrido en segundos.
     */
    @GetMapping("/elapsed-time/{id}")
    public ResponseEntity<Long> getElapsedTime(@RequestParam Long userId) {
        long elapsedTime = authenticationService.getElapsedTime(userId);
        return ResponseEntity.ok(elapsedTime);
    }

    /**
     * Endpoint para finalizar la sesión de un usuario de manera manual.
     * Recibe el `userId` desde la solicitud.
     *
     * @param request Objeto con el `userId` del usuario a desconectar.
     * @return Respuesta HTTP indicando que la sesión ha sido finalizada.
     */
    @PostMapping("/end-session")
    public ResponseEntity<String> endSession(@RequestBody EndSessionRequest request) {
        authenticationService.endSession(request.getUserId());
        return ResponseEntity.ok("Sesión finalizada correctamente.");
    }

    /**
     * Clase interna para manejar los datos de inicio de sesión con código.
     */
    public static class LoginRequest {
        private Long userId;
        private String code;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }

        public String getCode() {
            return code;
        }

        public void setCode(String code) {
            this.code = code;
        }
    }

    /**
     * Nueva clase interna para manejar los datos de inicio de sesión con username y password.
     */
    public static class LoginUserRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }

    /**
     * Clase interna para manejar la solicitud de finalización de sesión.
     */
    public static class EndSessionRequest {
        private Long userId;

        public Long getUserId() {
            return userId;
        }

        public void setUserId(Long userId) {
            this.userId = userId;
        }
    }

    @DeleteMapping("/deleteWorkday/{userId}")
    public ResponseEntity<String> deleteWorkday(@PathVariable Long userId) {
        return ResponseEntity.ok("Workday eliminado correctamente.");
    }
}
