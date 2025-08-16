export const API = import.meta.env.VITE_API_BASE;

export async function fetchTasks() {
  const res = await fetch(`${API}/tasks`);
  return res.json();
}

export async function addTask(title) {
  const res = await fetch(`${API}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title, isDone: false })
  });
  if (!res.ok) throw new Error('Add failed');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API}/tasks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete failed');
}
