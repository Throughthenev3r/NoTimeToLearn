import { useState } from "react";

export default function Register({ onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const storedUsers = JSON.parse(localStorage.getItem("usersData")) || {
      users: {},
    };

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    if (storedUsers.users[email]) {
      setError("User already exists");
      return;
    }

    // Добавляем нового пользователя
    storedUsers.users[email] = {
      password,
      projects: [],
    };

    storedUsers.currentUser = email;
    localStorage.setItem("usersData", JSON.stringify(storedUsers));
    setError("");
    onRegister(email);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 max-w-sm mx-auto"
    >
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="border p-2 rounded"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Register
      </button>
      {error && <p className="text-red-600">{error}</p>}
    </form>
  );
}
