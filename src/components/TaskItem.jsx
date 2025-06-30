import { useState } from "react";

export default function TaskItem({
  task,
  onToggle,
  onDelete,
  onNoteChange,
  formatDuration,
  disabled,
}) {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(task.note || "");

  const handleSaveNote = () => {
    onNoteChange(task.id, noteText);
    setIsEditingNote(false);
  };

  const handleCancelNote = () => {
    setNoteText(task.note || "");
    setIsEditingNote(false);
  };

  return (
    <li
      className={`pr-4 pt-4 pb-4 rounded-md flex flex-col bg-gray-100 border border-gray-300 shadow mb-5 transition ${
        disabled ? "opacity-60 cursor-not-allowed" : "hover:bg-gray-200"
      }`}
    >
      <div className="flex items-center justify-between mb-2">
        <div
          onClick={() => !disabled && onToggle(task.id)}
          className={`cursor-pointer text-left flex-grow text-gray-800 select-text ${
            task.completed ? "line-through text-gray-400" : ""
          } ${disabled ? "cursor-not-allowed" : ""}`}
          title={disabled ? "Project is completed" : "Click to toggle complete"}
        >
          📝 {task.text}
        </div>
        <div className="flex items-center gap-4 whitespace-nowrap ml-4">
          {task.completedAt && (
            <div className="text-sm text-gray-500 select-none">
              Time spent: {formatDuration(task.createdAt, task.completedAt)}
            </div>
          )}
          <button
            onClick={() => !disabled && onDelete(task.id)}
            className={`px-3 py-1 bg-white border border-gray-300 text-gray-700 rounded-md shadow-sm transition ${
              disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-100"
            }`}
            aria-label={`Delete task ${task.text}`}
            disabled={disabled}
          >
            ❌
          </button>
        </div>
      </div>

      {/* Заметки */}
      <div className="mt-2">
        {isEditingNote ? (
          <>
            <textarea
              className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-green-400 transition"
              rows={3}
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              disabled={disabled}
            />
            <div className="flex gap-2 mt-2">
              <button
                onClick={handleSaveNote}
                disabled={disabled}
                className="bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
              <button
                onClick={handleCancelNote}
                disabled={disabled}
                className="bg-gray-300 text-gray-700 px-4 py-1 rounded hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div
            className={`whitespace-pre-wrap text-gray-700 cursor-pointer ${
              disabled ? "cursor-not-allowed" : "hover:bg-gray-200 rounded p-2"
            }`}
            onClick={() => !disabled && setIsEditingNote(true)}
            title={disabled ? "" : "Click to edit note"}
          >
            {task.note ? (
              task.note
            ) : (
              <i className="text-gray-400">No notes. Click to add.</i>
            )}
          </div>
        )}
      </div>
    </li>
  );
}
