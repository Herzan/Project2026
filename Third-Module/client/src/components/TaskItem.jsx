import { useState } from 'react';

export default function TaskItem({ task, users, onToggle, onDelete, onSave }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [assignee, setAssignee] = useState(task.assignee);

  const initials = (task.assignee || 'U').trim().slice(0, 2).toUpperCase();

  function startEdit() {
    setTitle(task.title);
    setAssignee(task.assignee);
    setEditing(true);
  }

  function cancelEdit() {
    setEditing(false);
  }

  function save() {
    if (!title.trim()) return;
    onSave(task.id, { title: title.trim(), assignee: assignee.trim() });
    setEditing(false);
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') save();
    if (e.key === 'Escape') cancelEdit();
  }

  function handleDelete() {
    if (window.confirm(`Delete "${task.title}"? This can't be undone.`)) {
      onDelete(task.id);
    }
  }

  return (
    <li className={task.done ? 'done' : ''}>
      <input
        type="checkbox"
        className="chk"
        checked={task.done}
        onChange={() => onToggle(task.id)}
        title="Mark complete"
      />

      {editing ? (
        <div className="task-main" onKeyDown={handleKeyDown}>
          <input
            type="text"
            className="edit-title"
            value={title}
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          />
          <select
            className="edit-assignee"
            value={assignee}
            onChange={(e) => setAssignee(e.target.value)}
          >
            <option value="Unassigned">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.username}>{u.username}</option>
            ))}
          </select>
        </div>
      ) : (
        <div className="task-main" onDoubleClick={startEdit}>
          <span className="task-title" title="Double-click to edit">{task.title}</span>
          <span className="assignee-badge" title={`Assigned to ${task.assignee}`}>
            <span className="avatar">{initials}</span>{task.assignee}
          </span>
        </div>
      )}

      {editing ? (
        <>
          <button className="btn-save" title="Save" onClick={save}>💾</button>
          <button className="btn-cancel" title="Cancel" onClick={cancelEdit}>✖️</button>
        </>
      ) : (
        <>
          <button className="btn-edit" title="Edit task" onClick={startEdit}>✏️</button>
          <button className="btn-del" title="Delete task" onClick={handleDelete}>Delete</button>
        </>
      )}
    </li>
  );
}
