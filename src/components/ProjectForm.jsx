import { useState } from "react";

export default function ProjectForm({ onAdd }) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim() === "") return;
    onAdd(title.trim());
    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex gap-3">
      <input
        type="text"
        className="flex-grow border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        placeholder="Add new project"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoComplete="off"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700 transition"
      >
        Add Project
      </button>
    </form>
  );
}
