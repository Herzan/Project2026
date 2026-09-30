import { useState } from 'react';

export default function AddTaskForm({ onAdd, users, currentUser }) {
  const [title, setTitle] = useState('');
  const [assignee, setAssignee] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd({ title: trimmed, assignee });
    setTitle('');
    setAssignee('');
  }

  return (
    <form className="input-row" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Enter a new task..."
        autoComplete="off"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <select value={assignee} onChange={(e) => setAssignee(e.target.value)}>
        <option value="">Unassigned</option>
        {users.map((u) => (
          <option key={u.id} value={u.username}>
            {u.username === currentUser.username ? `${u.username} (me)` : u.username}
          </option>
        ))}
      </select>
      <button type="submit" className="btn-add">Add</button>
    </form>
  );
}
