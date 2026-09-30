const STATUSES = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' }
];

export default function Toolbar({
  search,
  onSearchChange,
  assignee,
  onAssigneeChange,
  status,
  onStatusChange,
  users
}) {
  return (
    <div className="toolbar">
      <div className="search-row">
        <input
          type="text"
          placeholder="🔍 Search by title or assignee..."
          autoComplete="off"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        <select value={assignee} onChange={(e) => onAssigneeChange(e.target.value)}>
          <option value="">All assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.username}>{u.username}</option>
          ))}
          <option value="Unassigned">Unassigned</option>
        </select>
      </div>
      <div className="filter-row">
        {STATUSES.map((s) => (
          <button
            key={s.key}
            type="button"
            className={`filter-btn${status === s.key ? ' active' : ''}`}
            onClick={() => onStatusChange(s.key)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
