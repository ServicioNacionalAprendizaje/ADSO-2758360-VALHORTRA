package com.SENA.GOAPPv2.Service;

import com.SENA.GOAPPv2.DTO.LoginSession;
import com.SENA.GOAPPv2.Entity.Code;
import com.SENA.GOAPPv2.Entity.User;
import com.SENA.GOAPPv2.Entity.Workday;
import com.SENA.GOAPPv2.IService.AuthenticationIService;
import com.SENA.GOAPPv2.IService.WorkdayIService;
import com.SENA.GOAPPv2.Repository.CodeRepository;
import com.SENA.GOAPPv2.Repository.UserRepository;
import com.SENA.GOAPPv2.Repository.WorkdayRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

@Service
public class AuthenticationService implements AuthenticationIService {

    private static final long MAX_SESSION_HOURS = 8; // Máximo de horas de sesión por día
    static final long HOURLY_RATE = 9000; // Tarifa por hora en pesos colombianos

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CodeRepository codeRepository;

    @Autowired
    private WorkdayRepository workdayRepository;

    @Autowired
    private WorkdayIService workdayService;

    @Override
    public boolean authenticate(Long userId, String inputCode) {
        Optional<User> optionalUser = userRepository.findById(userId);
        if (optionalUser.isEmpty()) {
            System.out.println("Usuario no encontrado con ID: " + userId);
            return false;
        }

        User user = optionalUser.get();
        Optional<Code> dailyCode = codeRepository.findByGenerationDate(LocalDate.now());

        if (dailyCode.isEmpty()) {
            System.out.println("No se encontró un código válido para hoy.");
            return false;
        }

        if (!dailyCode.get().getCode().equals(inputCode)) {
            System.out.println("Código incorrecto.");
            return false;
        }

        if (user.isActive()) {
            System.out.println("El usuario ya está autenticado.");
            return false;
        }

        user.setActive(true);
        user.setStartTime(LocalDateTime.now());
        userRepository.save(user);

        createWorkdayForUser(user);

        System.out.println("Autenticación exitosa.");
        return true;
    }

    private void createWorkdayForUser(User user) {
        Workday workday = new Workday();
        workday.setUser(user);
        workday.setDate(LocalDate.now());
        workday.setStartTime(user.getStartTime());
        workdayRepository.save(workday);

        System.out.println("Jornada de trabajo registrada para el usuario con ID: " + user.getId());
    }

    @Override
    public Code assignDailyCode(Long userId) {
        return null;
    }

    @Override
    public Optional<User> getUserById(Long userId) {
        return userRepository.findById(userId);
    }

    @Override
    public void getElapsedTime() {
    }

    @Override
    public long getElapsedTime(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getStartTime() != null) {
                return ChronoUnit.SECONDS.between(user.getStartTime(), LocalDateTime.now());
            }
        }
        return 0;
    }

    @Override
    public void endSession(Long userId) {
        Optional<User> userOptional = userRepository.findById(userId);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            if (user.getStartTime() != null) {
                LocalDateTime endTime = LocalDateTime.now();
                long hoursWorked = ChronoUnit.HOURS.between(user.getStartTime(), endTime);
                long totalPay = hoursWorked * HOURLY_RATE;

                Workday workday = new Workday();
                workday.setUser(user);
                workday.setDate(LocalDate.now());
                workday.setStartTime(user.getStartTime());
                workday.setEndTime(endTime);
                workday.setHoursWorked(hoursWorked);
                workday.setTotalPay(totalPay);

                workdayRepository.save(workday);

                user.setActive(false);
                user.setStartTime(null);
                userRepository.save(user);

                System.out.println("Sesión terminada y jornada registrada para el usuario con ID: " + userId);
            } else {
                System.out.println("El usuario no tiene una jornada activa para finalizar.");
            }
        } else {
            System.out.println("Usuario no encontrado con ID: " + userId);
        }
    }

    public void generateDailyCode() {
        String dailyCode = generateCodeForDay();

        Optional<Code> existingCode = codeRepository.findByGenerationDate(LocalDate.now());
        if (existingCode.isEmpty()) {
            Code newCode = new Code();
            newCode.setCode(dailyCode);
            newCode.setGenerationDate(LocalDate.now());
            codeRepository.save(newCode);
        }
    }

    private String generateCodeForDay() {
        return "CODE-" + LocalDate.now().toString();
    }

    @Scheduled(fixedRate = 60000) // Ejecutar cada 60 segundos
    public void checkActiveSessions() {
        List<User> activeUsers = userRepository.findByIsActiveTrue();

        for (User user : activeUsers) {
            if (user.getStartTime() != null) {
                long hoursElapsed = ChronoUnit.HOURS.between(user.getStartTime(), LocalDateTime.now());

                if (hoursElapsed >= MAX_SESSION_HOURS) {
                    endSession(user.getId());
                    System.out.println("Sesión finalizada automáticamente para el usuario con ID: " + user.getId());
                }
            }
        }
    }

    /**
     * Nuevo método para autenticación con usuario, contraseña y rol.
     *
     * @param username Nombre de usuario.
     * @param password Contraseña en texto plano (⚠️ debe usarse hashing en producción).
     * @return Un objeto LoginSession si las credenciales son correctas, de lo contrario null.
     */
    public LoginSession loginWithUsernameAndPassword(String username, String password) {
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(password)) { // ⚠️ Usa hashing en producción
                return new LoginSession(user.getUsername(), user.getRole().name());
            }
        }
        return null;
    }
}
