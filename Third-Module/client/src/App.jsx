import { useCallback, useEffect, useRef, useState } from 'react';
import Login from './components/Login.jsx';
import AddTaskForm from './components/AddTaskForm.jsx';
import Toolbar from './components/Toolbar.jsx';
import TaskList from './components/TaskList.jsx';
import Toast from './components/Toast.jsx';
import * as api from './api.js';

export default function App() {
  const [user, setUser] = useState(null);
  // While we check a saved token we show nothing (avoids a login-page flash)
  const [checking, setChecking] = useState(Boolean(api.auth.getToken()));

  // Restore the session if a token is saved in the browser
  useEffect(() => {
    api.setUnauthorizedHandler(() => {
      api.auth.clear();
      setUser(null);
    });
    if (!api.auth.getToken()) return;
    api
      .getMe()
      .then(setUser)
      .catch(() => api.auth.clear())
      .finally(() => setChecking(false));
  }, []);

  function handleLoggedIn({ token, user: u }) {
    api.auth.setToken(token);
    setUser(u);
  }

  function handleLogout() {
    api.auth.clear();
    setUser(null);
  }

  if (checking) return null;
  if (!user) return <Login onLoggedIn={handleLoggedIn} />;
  return <TaskBoard user={user} onLogout={handleLogout} />;
}

function TaskBoard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [assignee, setAssignee] = useState('');
  const [status, setStatus] = useState('all');

  const [toast, setToast] = useState({ message: '', isError: false });
  const toastTimer = useRef(null);

  const showToast = useCallback((message, isError = false) => {
    setToast({ message, isError });
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast({ message: '', isError: false }), 2200);
  }, []);

  const loadTasks = useCallback(async () => {
    try {
      const data = await api.getTasks({ search: debouncedSearch, assignee, status });
      setTasks(data);
    } catch (err) {
      showToast(err.message, true);
    }
  }, [debouncedSearch, assignee, status, showToast]);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    api.getUsers().then(setUsers).catch(() => {});
  }, []);

  async function handleAdd({ title, assignee: who }) {
    try {
      await api.createTask({ title, assignee: who });
      showToast('Task added');
      loadTasks();
    } catch (err) {
      showToast(err.message, true);
    }
  }

  async function handleToggle(id) {
    try {
      await api.toggleTask(id);
      loadTasks();
    } catch (err) {
      showToast(err.message, true);
    }
  }

  async function handleDelete(id) {
    try {
      await api.deleteTask(id);
      showToast('Task deleted');
      loadTasks();
    } catch (err) {
      showToast(err.message, true);
    }
  }

  async function handleSave(id, updates) {
    try {
      await api.updateTask(id, updates);
      showToast('Task updated');
      loadTasks();
    } catch (err) {
      showToast(err.message, true);
    }
  }

  const hasActiveFilters = Boolean(debouncedSearch || assignee || status !== 'all');

  return (
    <div className="container">
      <div className="topbar">
        <h1>✅ Task Manager</h1>
        <div className="user-box">
          <span>👤 {user.name || user.username}</span>
          <button className="btn-logout" onClick={onLogout}>Log out</button>
        </div>
      </div>

      <AddTaskForm onAdd={handleAdd} users={users} currentUser={user} />

      <Toolbar
        search={search}
        onSearchChange={setSearch}
        assignee={assignee}
        onAssigneeChange={setAssignee}
        status={status}
        onStatusChange={setStatus}
        users={users}
      />

      <TaskList
        tasks={tasks}
        users={users}
        hasActiveFilters={hasActiveFilters}
        onToggle={handleToggle}
        onDelete={handleDelete}
        onSave={handleSave}
      />

      <Toast message={toast.message} isError={toast.isError} />
    </div>
  );
}
