package com.SENA.GOAPPv2.Service;

import com.SENA.GOAPPv2.Entity.Tasks;
import com.SENA.GOAPPv2.Entity.User;
import com.SENA.GOAPPv2.IService.TasksIService;
import com.SENA.GOAPPv2.Repository.TasksRepository;
import com.SENA.GOAPPv2.Repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TasksService implements TasksIService {

    private final TasksRepository tasksRepository;
    private final UserRepository userRepository;

    // Inyección de dependencias a través del constructor
    public TasksService(TasksRepository tasksRepository, UserRepository userRepository) {
        this.tasksRepository = tasksRepository;
        this.userRepository = userRepository;
    }

    // Método para asignar una tarea individualmente
    @Override
    public Tasks assignTask(Tasks task) {
        // Validar si el administrador tiene el rol correcto
        if (task.getAdministrador() == null || task.getAdministrador().getRole() != User.RoleType.ADMINISTRADOR) {
            throw new RuntimeException("Solo un administrador puede asignar tareas.");
        }

        // Validar si el agente tiene el rol correcto
        if (task.getAgente() == null || task.getAgente().getRole() != User.RoleType.AGENTE) {
            throw new RuntimeException("El usuario asignado debe tener el rol AGENTE.");
        }

        task.setAssignedAt(LocalDateTime.now()); // Asignar la fecha actual de asignación
        return tasksRepository.save(task);
    }

    // Método para obtener todas las tareas almacenadas en la base de datos
    @Override
    public List<Tasks> getAllTasks() {
        return tasksRepository.findAll();
    }

    @Override
    public Tasks assignAgentToStore(Tasks task, Long administradorId, Long agenteId, Long tiendaId) {
        return null;
    }

    @Override
    public Tasks asignarAgenteATienda(Tasks tarea, Long administradorId, Long agenteId, Long tiendaId) {
        // Validar si el administrador existe
        User administrador = userRepository.findById(administradorId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado con ID: " + administradorId));

        // Validar si el agente existe
        User agente = userRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente no encontrado con ID: " + agenteId));

        // Validar si la tienda existe
        User tienda = userRepository.findById(tiendaId)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada con ID: " + tiendaId));

        // Validar que el administrador tenga el role correcto
        if (!administrador.getRole().equals(User.RoleType.ADMINISTRADOR)) {
            throw new RuntimeException("El usuario con ID: " + administradorId + " no tiene el role de Administrador.");
        }

        // Validar que el agente tenga el role correcto
        if (!agente.getRole().equals(User.RoleType.AGENTE)) {
            throw new RuntimeException("El usuario con ID: " + agenteId + " no tiene el role de Agente.");
        }

        // Validar que la tienda tenga el role correcto
        if (!tienda.getRole().equals(User.RoleType.TIENDA)) {
            throw new RuntimeException("El usuario con ID: " + tiendaId + " no tiene el role de Tienda.");
        }

        // Asignar la tienda y el agente a la tarea
        tarea.setAgente(agente);
        tarea.setTienda(tienda);

        // Guardar la tarea en el repositorio
        return tasksRepository.save(tarea);
    }



    // Método para asignar un agente a una tienda
    @Override
    @Transactional
    public Tasks assignAgentToStore(Long administradorId, Long agenteId, Long tiendaId) {
        // Buscar al administrador por ID y validar su rol
        User administrador = userRepository.findById(administradorId)
                .orElseThrow(() -> new RuntimeException("Administrador no encontrado."));

        if (administrador.getRole() != User.RoleType.ADMINISTRADOR) {
            throw new RuntimeException("Solo un administrador puede asignar un agente a una tienda.");
        }

        // Buscar al agente por ID y validar su rol
        User agente = userRepository.findById(agenteId)
                .orElseThrow(() -> new RuntimeException("Agente no encontrado."));

        if (agente.getRole() != User.RoleType.AGENTE) {
            throw new RuntimeException("El usuario asignado no es un agente.");
        }

        // Buscar a la tienda por ID y validar su rol
        User tienda = userRepository.findById(tiendaId)
                .orElseThrow(() -> new RuntimeException("Tienda no encontrada."));

        if (tienda.getRole() != User.RoleType.TIENDA) {
            throw new RuntimeException("El usuario asignado no es una tienda válida.");
        }

        // Crear una nueva tarea con los usuarios encontrados
        Tasks task = new Tasks(administrador, agente, tienda);
        task.setAssignedAt(LocalDateTime.now());  // Asignar la fecha de creación de la tarea

        return tasksRepository.save(task);  // Guardar la tarea en la base de datos
    }

    // 🔹 EDITAR TAREA
    @Override
    @Transactional
    public Tasks updateTask(Long taskId, Tasks updatedTask) {
        Tasks existingTask = tasksRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + taskId));

        // Actualizar datos de la tarea
        existingTask.setAdministrador(updatedTask.getAdministrador());
        existingTask.setAgente(updatedTask.getAgente());
        existingTask.setTienda(updatedTask.getTienda());
        existingTask.setFechaAsignacion(new Date()); // Actualiza la fecha actual de asignación
        existingTask.setAssignedAt(updatedTask.getAssignedAt());

        return tasksRepository.save(existingTask);
    }

    // 🔹 ELIMINAR TAREA
    @Override
    @Transactional
    public void deleteTask(Long taskId) {
        if (!tasksRepository.existsById(taskId)) {
            throw new RuntimeException("No se encontró la tarea con ID: " + taskId);
        }

        tasksRepository.deleteById(taskId);
    }

    public Tasks getTaskById(Long id) {
        // Intentamos obtener la tarea por su ID usando el repositorio
        return tasksRepository.findById(id).orElse(null);
    }

    public Tasks findById(Long id) {
        // Usamos Optional para manejar el caso en el que la tarea no exista
        Optional<Tasks> taskOptional = tasksRepository.findById(id);

        // Si la tarea existe, la devolvemos; si no, lanzamos una excepción o devolvemos null
        return taskOptional.orElseThrow(() -> new RuntimeException("Tarea no encontrada con ID: " + id));
    }

    public Tasks save(Tasks existingTask) {
        return tasksRepository.save(existingTask);
    }

}