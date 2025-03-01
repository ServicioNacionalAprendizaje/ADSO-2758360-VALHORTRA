package com.SENA.GOAPPv2.IService;

import com.SENA.GOAPPv2.Entity.Tasks;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TasksIService {
    Tasks assignTask(Tasks task); // Asignar tarea a un agente
    List<Tasks> getAllTasks(); // Obtener todas las tareas

    // Métodos para asignar un agente a una tienda
    Tasks assignAgentToStore(Tasks task, Long administradorId, Long agenteId, Long tiendaId);

    Tasks asignarAgenteATienda(Tasks tarea, Long administradorId, Long agenteId, Long tiendaId);

    Tasks assignAgentToStore(Long administradorId, Long agenteId, Long tiendaId);

    // 🔹 EDITAR TAREA
    @Transactional
    Tasks updateTask(Long taskId, Tasks updatedTask);

    // 🔹 ELIMINAR TAREA
    @Transactional
    void deleteTask(Long taskId);
}