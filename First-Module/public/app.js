async function fetchTasks() {
  const res = await fetch('/api/tasks');
  render(await res.json());
}

function render(tasks) {
  const list = document.getElementById('taskList');
  const done = tasks.filter(t => t.done).length;
  document.getElementById('stats').textContent =
    tasks.length ? `${done}/${tasks.length} completed` : '';
  list.innerHTML = tasks.length
    ? tasks.map(t => `
        <li class="${t.done ? 'done' : ''}">
          <span onclick="toggleTask(${t.id})" title="Click to toggle">
            ${t.done ? '✔️' : '⬜'} ${t.title}
          </span>
          <button class="btn-del" onclick="deleteTask(${t.id})">Delete</button>
        </li>`).join('')
    : '<li class="empty">No tasks yet. Add one above! 👆</li>';
}

async function addTask() {
  const input = document.getElementById('taskInput');
  if (!input.value.trim()) return;
  await fetch('/api/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: input.value })
  });
  input.value = '';
  fetchTasks();
}

async function toggleTask(id) {
  await fetch(`/api/tasks/${id}/toggle`, { method: 'PUT' });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
  fetchTasks();
}

document.getElementById('taskInput')
  .addEventListener('keydown', e => { if (e.key === 'Enter') addTask(); });

fetchTasks();
