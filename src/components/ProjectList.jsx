import Project from "./Project"; // 🛠️ Важно: импортируем Project!

export default function ProjectList({
  projects,
  updateProjectTasks,
  deleteProject,
  updateProject,
}) {
  return (
    <div className="space-y-6">
      {projects.map((project) => (
        <Project
          key={project.id}
          project={project}
          updateProjectTasks={updateProjectTasks}
          deleteProject={deleteProject}
          updateProject={updateProject}
        />
      ))}
    </div>
  );
}
