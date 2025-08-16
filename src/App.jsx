import { useEffect, useState } from 'react';
import { fetchTasks, addTask, deleteTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  async function load() {
    try {
      const data = await fetchTasks();
      setTasks(data);
    } catch {
      setError('Yükleme hatası');
    }
  }

  useEffect(() => { load(); }, []);

  async function onAdd(e) {
    e.preventDefault();
    if (!title.trim()) return setError('Başlık boş olamaz');
    try {
      const item = await addTask(title.trim());
      setTasks(prev => [...prev, item]);
      setTitle('');
      setError('');
    } catch {
      setError('Ekleme hatası');
    }
  }

  async function onDelete(id) {
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Silme hatası');
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h1>TaskTracker</h1>

      <form onSubmit={onAdd} style={{ display: 'flex', gap: 8 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Görev başlığı..."
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit">Ekle</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul>
        {tasks.map(t => (
          <li key={t.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
            <span>{t.title} {t.isDone ? '✅' : ''}</span>
            <button onClick={() => onDelete(t.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
