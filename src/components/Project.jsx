import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

export default function Project({
  project,
  updateProjectTasks,
  deleteProject,
  updateProject,
}) {
  const completed = project.completed || false;
  const completedAt = project.completedAt || null;
  const tasks = project.tasks || [];

  const toggleProjectCompleted = () => {
    if (!completed) {
      const now = Date.now();
      updateProject({ ...project, completed: true, completedAt: now });
    } else {
      updateProject({ ...project, completed: false, completedAt: null });
    }
  };

  const addTask = (text) => {
    const newTask = {
      id: Date.now(),
      text,
      completed: false,
      note: "",
      createdAt: Date.now(),
      completedAt: null,
    };
    updateProjectTasks(project.id, [...tasks, newTask]);
  };

  const toggleTask = (id) => {
    updateProjectTasks(
      project.id,
      tasks.map((task) =>
        task.id === id
          ? {
              ...task,
              completed: !task.completed,
              completedAt: !task.completed ? Date.now() : null,
            }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    updateProjectTasks(
      project.id,
      tasks.filter((task) => task.id !== id)
    );
  };

  const updateNote = (id, note) => {
    updateProjectTasks(
      project.id,
      tasks.map((task) => (task.id === id ? { ...task, note } : task))
    );
  };

  const totalTimeMs = tasks.reduce((acc, t) => {
    if (t.completedAt && t.createdAt) {
      return acc + (t.completedAt - t.createdAt);
    }
    return acc;
  }, 0);

  const formatDuration = (ms) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes} min ${seconds} sec`;
  };

  return (
    <div
      className={`border rounded-xl p-6 shadow-lg mb-10 select-none ${
        completed
          ? "bg-green-50 border-green-300"
          : "bg-blue-50 border-blue-300"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <h2
          className={`text-3xl font-bold flex items-center gap-3 ${
            completed ? "text-green-700 line-through" : "text-blue-700"
          }`}
        >
          <span>📁</span> {project.title}
        </h2>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleProjectCompleted}
            className={`px-4 py-2 rounded font-semibold transition ${
              completed
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {completed ? "Mark as Incomplete" : "Mark as Completed"}
          </button>
          <button
            onClick={() => deleteProject(project.id)}
            className="text-red-600 hover:text-red-800 font-semibold transition"
            aria-label={`Delete project ${project.title}`}
          >
            Delete Project
          </button>
        </div>
      </div>

      {completed && completedAt && (
        <p className="mb-6 font-semibold text-green-700 select-text">
          Time spent on project: {formatDuration(totalTimeMs)}
          <br />
          Completed:{" "}
          {new Date(completedAt).toLocaleString("en-US", {
            dateStyle: "short",
            timeStyle: "medium",
          })}
        </p>
      )}

      <TaskForm onAdd={addTask} disabled={completed} />
      <TaskList
        tasks={tasks}
        onToggle={toggleTask}
        onDelete={deleteTask}
        onNoteChange={updateNote}
        disabled={completed}
      />
    </div>
  );
}
