import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onToggle, onDelete, onNoteChange }) {
  const formatDuration = (start, end) => {
    const diff = Math.floor((end - start) / 1000);
    const minutes = Math.floor(diff / 60);
    const seconds = diff % 60;
    return `${minutes} min ${seconds} sec`;
  };

  if (tasks.length === 0) {
    return (
      <p className="text-center text-gray-500 mt-6 italic select-none">
        No Tasks
      </p>
    );
  }

  return (
    <ul className="list-none pl-0">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          onNoteChange={onNoteChange}
          formatDuration={formatDuration}
        />
      ))}
    </ul>
  );
}
