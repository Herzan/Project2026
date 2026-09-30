import TaskItem from './TaskItem.jsx';

export default function TaskList({ tasks, users, hasActiveFilters, onToggle, onDelete, onSave }) {
  const done = tasks.filter((t) => t.done).length;

  return (
    <>
      <div className="stats">
        {tasks.length
          ? `${done}/${tasks.length} shown · ${tasks.length - done} remaining`
          : ''}
      </div>

      <ul>
        {tasks.length ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              users={users}
              onToggle={onToggle}
              onDelete={onDelete}
              onSave={onSave}
            />
          ))
        ) : (
          <li className="empty">
            {hasActiveFilters ? 'No tasks match your filters. 🔍' : 'No tasks yet. Add one above! 👆'}
          </li>
        )}
      </ul>
    </>
  );
}
