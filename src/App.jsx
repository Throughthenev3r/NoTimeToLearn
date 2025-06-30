import { useState, useEffect } from "react";
import ProjectForm from "./components/ProjectForm";
import ProjectList from "./components/ProjectList";

import "./index.css";

function App() {
  const [loading, setLoading] = useState(true);

  const [users, setUsers] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  const [projects, setProjects] = useState([]);

  // При загрузке приложения — загружаем users и currentUser из localStorage
  useEffect(() => {
    const storedUsers = localStorage.getItem("users");
    const storedCurrentUser = localStorage.getItem("currentUser");

    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // Инициализируем начальный набор пользователей
      const initialUsers = {
        "user1@example.com": { password: "1234", projects: [] },
        "another@example.com": { password: "abcd", projects: [] },
      };
      localStorage.setItem("users", JSON.stringify(initialUsers));
      setUsers(initialUsers);
    }

    setCurrentUser(storedCurrentUser || null);
    setLoading(false);
  }, []);

  // При изменении currentUser или users — обновляем локальные проекты
  useEffect(() => {
    if (currentUser && users[currentUser]) {
      setProjects(users[currentUser].projects || []);
    } else {
      setProjects([]);
    }
  }, [currentUser, users]);

  // Централизованное обновление проектов и локалстоража — чтобы избежать циклов и мерцания
  const updateProjectsAndStorage = (newProjects) => {
    setProjects(newProjects);

    const updatedUsers = {
      ...users,
      [currentUser]: {
        ...users[currentUser],
        projects: newProjects,
      },
    };

    localStorage.setItem("users", JSON.stringify(updatedUsers));
    // Обновлять setUsers не нужно, чтобы не вызвать лишний ререндер и цикл
  };

  // Управление проектами
  const addProject = (title) => {
    const newProject = {
      id: Date.now(),
      title,
      tasks: [],
    };
    updateProjectsAndStorage([...projects, newProject]);
  };

  const updateProjectTasks = (projectId, updatedTasks) => {
    updateProjectsAndStorage(
      projects.map((proj) =>
        proj.id === projectId ? { ...proj, tasks: updatedTasks } : proj
      )
    );
  };

  const deleteProject = (projectId) => {
    updateProjectsAndStorage(projects.filter((proj) => proj.id !== projectId));
  };

  const updateProject = (updatedProject) => {
    updateProjectsAndStorage(
      projects.map((proj) =>
        proj.id === updatedProject.id ? updatedProject : proj
      )
    );
  };

  // Логика переключения между формами регистрации и логина
  const [showRegister, setShowRegister] = useState(false);

  // Поля и ошибки логина
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  // Поля и ошибки регистрации
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState(null);

  // Обработка логина
  const handleLogin = (e) => {
    e.preventDefault();
    if (!users[loginEmail]) {
      setLoginError("User not found");
      return;
    }
    if (users[loginEmail].password !== loginPassword) {
      setLoginError("Incorrect password");
      return;
    }
    setLoginError(null);
    setCurrentUser(loginEmail);
    localStorage.setItem("currentUser", loginEmail);
    setLoginEmail("");
    setLoginPassword("");
  };

  // Обработка регистрации
  const handleRegister = (e) => {
    e.preventDefault();
    if (users[regEmail]) {
      setRegError("User already exists");
      return;
    }
    if (!regEmail || !regPassword) {
      setRegError("Please fill all fields");
      return;
    }

    const updatedUsers = {
      ...users,
      [regEmail]: {
        password: regPassword,
        projects: [],
      },
    };

    setUsers(updatedUsers);
    localStorage.setItem("users", JSON.stringify(updatedUsers));
    setCurrentUser(regEmail);
    localStorage.setItem("currentUser", regEmail);
    setRegEmail("");
    setRegPassword("");
    setRegError(null);
  };

  // Выход из системы
  const handleLogout = () => {
    if (currentUser) {
      // Сохраняем проекты текущего пользователя перед выходом
      const updatedUsers = {
        ...users,
        [currentUser]: {
          ...users[currentUser],
          projects,
        },
      };
      localStorage.setItem("users", JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }

    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setProjects([]);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
        {!currentUser ? (
          <>
            {showRegister ? (
              <>
                <h1 className="text-3xl font-bold text-center mb-6">
                  Register for Learn Tracker
                </h1>
                <form
                  onSubmit={handleRegister}
                  className="flex flex-col gap-4 max-w-sm mx-auto"
                >
                  <input
                    type="email"
                    placeholder="Email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="border border-gray-400 rounded px-4 py-2"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    className="border border-gray-400 rounded px-4 py-2"
                    required
                  />
                  {regError && (
                    <div className="text-red-600 font-semibold">{regError}</div>
                  )}
                  <button
                    type="submit"
                    className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition mx-auto w-full max-w-xs"
                  >
                    Register
                  </button>
                </form>
                <p className="text-center mt-4">
                  Already have an account?{" "}
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={() => {
                      setShowRegister(false);
                      setRegError(null);
                    }}
                  >
                    Login here
                  </button>
                </p>
              </>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-center mb-6">
                  Login to Learn Tracker
                </h1>
                <form
                  onSubmit={handleLogin}
                  className="flex flex-col gap-4 max-w-sm mx-auto"
                >
                  <input
                    type="email"
                    placeholder="Email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="border border-gray-400 rounded px-4 py-2"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="border border-gray-400 rounded px-4 py-2"
                    required
                  />
                  {loginError && (
                    <div className="text-red-600 font-semibold">
                      {loginError}
                    </div>
                  )}
                  <div className="flex justify-center">
                    <button
                      type="submit"
                      className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition w-full max-w-xs text-center"
                    >
                      Login
                    </button>
                  </div>
                </form>
                <p className="text-center mt-4">
                  Don't have an account?{" "}
                  <button
                    className="text-green-600 hover:underline"
                    onClick={() => {
                      setShowRegister(true);
                      setLoginError(null);
                    }}
                  >
                    Register here
                  </button>
                </p>
              </>
            )}
          </>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-5xl font-extrabold text-blue-800 select-none">
                📚 Learn Tracker — {currentUser}
              </h1>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Logout
              </button>
            </div>
            <ProjectForm onAdd={addProject} />
            <ProjectList
              projects={projects}
              updateProjectTasks={updateProjectTasks}
              deleteProject={deleteProject}
              updateProject={updateProject}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
