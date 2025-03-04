import { useEffect, useState } from "react";
import { API_URL } from "../env.ts";
import TaskList from "./TaskList.tsx";
import { Trash2, Check, Plus, LogOut } from 'lucide-react';

interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
}

const TodoPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "completed">("pending");
  const [notification, setNotification] = useState<string | null>(null);
  const token = document.cookie.split("; ").find((row) => row.startsWith("token="))?.split("=")[1];

  // Obtener tareas desde la API
  useEffect(() => {
    const fetchTasks = async () => {
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch(`${API_URL}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Tareas obtenidas:", data.tasks); // Añadir console log para depuración
          setTasks(data.tasks || []);
        } else {
          console.error("Error al obtener tareas");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchTasks();
  }, [token]);

  // Agregar tarea
  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      const response = await fetch(`${API_URL}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const newTask = await response.json(); // Obtener la nueva tarea desde la respuesta
        setTasks((prevTasks) => [...prevTasks, newTask]); // Añadir la nueva tarea al estado
        e.target.reset(); // Limpiar el formulario
        setNotification("Tarea agregada exitosamente"); // Mostrar mensaje de notificación
        setTimeout(() => setNotification(null), 3000); // Ocultar la notificación después de 3 segundos
      } else {
        alert("Error al agregar la tarea");
      }
    } catch (error) {
      alert("Error al agregar la tarea");
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setTasks(tasks.filter((task) => task._id !== taskId));
      } else {
        alert("Error al eliminar la tarea");
      }
    } catch (error) {
      alert("Error al eliminar la tarea");
    }
  };

  // Completar tarea
  const handleCompleteTask = async (taskId: string, completed: boolean) => {
    try {
      const response = await fetch(`${API_URL}/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ completed }),
      });

      if (response.ok) {
        setTasks(
          tasks.map((task) =>
            task._id === taskId ? { ...task, completed } : task
          )
        );
      } else {
        alert("Error al actualizar la tarea");
      }
    } catch (error) {
      alert("Error al actualizar la tarea");
    }
  };

  // Filtrar tareas
  const pendingTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-xl mx-auto px-4 w-full">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Mis Tareas</h1>
          <button
            id="logout"
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            onClick={() => {
              document.cookie = "token=; Max-Age=0; path=/";
              window.location.href = "/login";
            }}
          >
            <LogOut className="mr-2" />
            Cerrar Sesión
          </button>
        </div>

        {/* Notificación */}
        {notification && (
          <div className="bg-green-500 text-white py-2 px-4 mb-4 rounded-md">
            {notification}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Agregar Nueva Tarea</h2>
          <form id="taskForm" onSubmit={handleAddTask} className="space-y-4">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                placeholder="¿Qué necesitas hacer?"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-600 mb-1"
              >
                Descripción
              </label>
              <input
                type="text"
                id="description"
                name="description"
                placeholder="Detalles adicionales"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                <div className="flex items-center">
                  <Plus className="mr-2" />
                  Agregar Tarea
                </div>
              </button>
            </div>
          </form>
        </div>

        {/* Pestañas */}
        <div className="flex mb-4 bg-white rounded-lg shadow-md overflow-hidden">
          <button
            className={`tab-button flex-1 py-3 ${activeTab === 'pending' ? 'bg-gray-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab("pending")}
          >
            Pendientes
          </button>
          <button
            className={`tab-button flex-1 py-3 ${activeTab === 'completed' ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            onClick={() => setActiveTab("completed")}
          >
            Completadas
          </button>
        </div>

        {/* Tareas */}
        <div id="pendingTasks" className={activeTab === "pending" ? "" : "hidden"}>
          <TaskList
            tasks={pendingTasks}
            onDelete={handleDeleteTask}
            onComplete={handleCompleteTask}
          />
        </div>

        <div id="completedTasks" className={activeTab === "completed" ? "" : "hidden"}>
          <TaskList
            tasks={completedTasks}
            onDelete={handleDeleteTask}
            onComplete={handleCompleteTask}
          />
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
