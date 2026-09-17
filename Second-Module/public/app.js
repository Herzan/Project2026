// ---- State ----
let currentStatus = 'all';   // 'all' | 'active' | 'completed'
let currentSearch = '';
let currentAssignee = '';
let searchDebounce = null;

// ---- Elements ----
const taskList = document.getElementById('taskList');
const statsEl = document.getElementById('stats');
const addForm = document.getElementById('addForm');
const taskInput = document.getElementById('taskInput');
const assigneeInput = document.getElementById('assigneeInput');
const searchInput = document.getElementById('searchInput');
const assigneeFilter = document.getElementById('assigneeFilter');
const statusFilter = document.getElementById('statusFilter');
const assigneeOptions = document.getElementById('assigneeOptions');
const toast = document.getElementById('toast');

// ---- Helpers ----
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function showToast(message, isError = false) {
  toast.textContent = message;
  toast.className = 'toast show' + (isError ? ' error' : '');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.className = 'toast';
  }, 2200);
}

function buildQuery() {
  const params = new URLSearchParams();
  if (currentSearch) params.set('search', currentSearch);
  if (currentAssignee) params.set('assignee', currentAssignee);
  if (currentStatus !== 'all') params.set('status', currentStatus);
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

// ---- Data fetching ----
async function fetchTasks() {
  try {
    const res = await fetch(`/api/tasks${buildQuery()}`);
    if (!res.ok) throw new Error('Failed to load tasks');
    render(await res.json());
  } catch (err) {
    showToast(err.message, true);
  }
}

async function fetchAssignees() {
  try {
    const res = await fetch('/api/tasks/assignees');
    if (!res.ok) return;
    const names = await res.json();

    // Populate the filter dropdown, preserving current selection
    const previous = assigneeFilter.value;
    assigneeFilter.innerHTML = '<option value="">All assignees</option>' +
      names.map(n => `<option value="${escapeHtml(n)}">${escapeHtml(n)}</option>`).join('');
    if (names.includes(previous)) assigneeFilter.value = previous;

    // Populate the autocomplete list for the "assign to" input
    assigneeOptions.innerHTML = names.map(n => `<option value="${escapeHtml(n)}"></option>`).join('');
  } catch {
    // Non-critical; ignore
  }
}

// ---- Rendering ----
function render(tasks) {
  const done = tasks.filter(t => t.done).length;
  statsEl.textContent = tasks.length
    ? `${done}/${tasks.length} shown · ${tasks.length - done} remaining`
    : '';

  taskList.innerHTML = tasks.length
    ? tasks.map(taskRowHtml).join('')
    : `<li class="empty">${emptyStateMessage()}</li>`;
}

function emptyStateMessage() {
  if (currentSearch || currentAssignee || currentStatus !== 'all') {
    return 'No tasks match your filters. 🔍';
  }
  return 'No tasks yet. Add one above! 👆';
}

function taskRowHtml(t) {
  const initials = (t.assignee || 'U').trim().slice(0, 2).toUpperCase();
  return `
    <li class="${t.done ? 'done' : ''}" data-id="${t.id}">
      <input type="checkbox" class="chk" ${t.done ? 'checked' : ''} title="Mark complete" />
      <div class="task-main">
        <span class="task-title" title="Double-click to edit">${escapeHtml(t.title)}</span>
        <span class="assignee-badge" title="Assigned to ${escapeHtml(t.assignee)}">
          <span class="avatar">${escapeHtml(initials)}</span>${escapeHtml(t.assignee)}
        </span>
      </div>
      <button class="btn-edit" title="Edit task">✏️</button>
      <button class="btn-del" title="Delete task">Delete</button>
    </li>`;
}

// ---- Event delegation on the task list ----
taskList.addEventListener('click', async (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.classList.contains('chk')) {
    await toggleTask(id);
  } else if (e.target.classList.contains('btn-del')) {
    await handleDelete(id, li);
  } else if (e.target.classList.contains('btn-edit')) {
    startEdit(li, id);
  }
});

taskList.addEventListener('dblclick', (e) => {
  const li = e.target.closest('li[data-id]');
  if (!li) return;
  if (e.target.classList.contains('task-title')) {
    startEdit(li, Number(li.dataset.id));
  }
});

function startEdit(li, id) {
  if (li.classList.contains('editing')) return;
  const titleEl = li.querySelector('.task-title');
  const assigneeText = li.querySelector('.assignee-badge').textContent.trim();
  const currentTitle = titleEl.textContent;

  li.classList.add('editing');
  li.querySelector('.task-main').innerHTML = `
    <input type="text" class="edit-title" value="${escapeHtml(currentTitle)}" />
    <input type="text" class="edit-assignee" value="${escapeHtml(assigneeText)}" list="assigneeOptions" />
  `;
  li.insertAdjacentHTML('beforeend', `
    <button class="btn-save" title="Save">💾</button>
    <button class="btn-cancel" title="Cancel">✖️</button>
  `);
  li.querySelector('.btn-edit').style.display = 'none';
  li.querySelector('.btn-del').style.display = 'none';

  const editTitleInput = li.querySelector('.edit-title');
  editTitleInput.focus();
  editTitleInput.select();

  li.querySelector('.btn-save').addEventListener('click', () => saveEdit(li, id));
  li.querySelector('.btn-cancel').addEventListener('click', fetchTasks);
  li.addEventListener('keydown', function onKey(ev) {
    if (ev.key === 'Enter') { saveEdit(li, id); li.removeEventListener('keydown', onKey); }
    if (ev.key === 'Escape') { fetchTasks(); li.removeEventListener('keydown', onKey); }
  });
}

async function saveEdit(li, id) {
  const title = li.querySelector('.edit-title').value.trim();
  const assignee = li.querySelector('.edit-assignee').value.trim();
  if (!title) { showToast('Title cannot be empty', true); return; }

  try {
    const res = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, assignee })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Update failed');
    showToast('Task updated');
    await Promise.all([fetchTasks(), fetchAssignees()]);
  } catch (err) {
    showToast(err.message, true);
  }
}

async function toggleTask(id) {
  try {
    const res = await fetch(`/api/tasks/${id}/toggle`, { method: 'PUT' });
    if (!res.ok) throw new Error('Could not update task');
    fetchTasks();
  } catch (err) {
    showToast(err.message, true);
  }
}

async function handleDelete(id, li) {
  const title = li.querySelector('.task-title')?.textContent || 'this task';
  if (!confirm(`Delete "${title}"? This can't be undone.`)) return;

  try {
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Could not delete task');
    showToast('Task deleted');
    await Promise.all([fetchTasks(), fetchAssignees()]);
  } catch (err) {
    showToast(err.message, true);
  }
}

// ---- Add task ----
addForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  try {
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, assignee: assigneeInput.value.trim() })
    });
    if (!res.ok) throw new Error((await res.json()).error || 'Could not add task');
    taskInput.value = '';
    assigneeInput.value = '';
    taskInput.focus();
    showToast('Task added');
    await Promise.all([fetchTasks(), fetchAssignees()]);
  } catch (err) {
    showToast(err.message, true);
  }
});

// ---- Search & filters ----
searchInput.addEventListener('input', () => {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    currentSearch = searchInput.value;
    fetchTasks();
  }, 250);
});

assigneeFilter.addEventListener('change', () => {
  currentAssignee = assigneeFilter.value;
  fetchTasks();
});

statusFilter.addEventListener('click', (e) => {
  const btn = e.target.closest('.filter-btn');
  if (!btn) return;
  currentStatus = btn.dataset.status;
  [...statusFilter.children].forEach(b => b.classList.toggle('active', b === btn));
  fetchTasks();
});

// ---- Init ----
fetchTasks();
fetchAssignees();
