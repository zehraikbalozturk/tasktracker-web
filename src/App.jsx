import { useEffect, useState, useMemo } from 'react';
import { fetchTasks, addTask, deleteTask, toggleTask } from './api';

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState('all'); // 'all' | 'active' | 'done'

  const total = tasks.length;
  const done = useMemo(() => tasks.filter(t => t.isDone).length, [tasks]);
  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(t => !t.isDone);
    if (filter === 'done') return tasks.filter(t => t.isDone);
    return tasks; // all
  }, [tasks, filter]);

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
    const t = title.trim();
    if (t.length < 2) return setError('Başlık en az 2 karakter olmalı');
    if (t.length > 100) return setError('Başlık en fazla 100 karakter olabilir');

    setBusy(true);
    try {
      const item = await addTask(t);
      setTasks(prev => [...prev, item]);
      setTitle('');
      setError('');
    } catch {
      setError('Ekleme hatası (sunucu reddetti)');
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(id) {
    setBusy(true);
    try {
      await deleteTask(id);
      setTasks(prev => prev.filter(t => t.id !== id));
    } catch {
      setError('Silme hatası');
    } finally {
      setBusy(false);
    }
  }

  async function onToggle(id) {
    try {
      const updated = await toggleTask(id);
      setTasks(prev => prev.map(t => t.id === id ? updated : t));
    } catch {
      setError('Güncelleme hatası');
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="header">
          <h1>TaskTracker</h1>
          <div className="stats">
            Toplam <span className="badge">{total}</span> ·
            Tamamlanan <span className="badge">{done}</span>
          </div>
        </div>

        <form className="form" onSubmit={onAdd}>
          <input
            className="input"
            value={title}
            onChange={e => { setTitle(e.target.value); if (error) setError(''); }}
            placeholder="Görev başlığı..."
            maxLength={100}
          />
          <button className="btn" type="submit" disabled={busy}>Ekle</button>
        </form>
        <p className="helper">{title.length}/100</p>

        {/* Filtre Sekmeleri */}
        <div className="tabs">
          <button
            type="button"
            className={`tab ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
            title="Tüm görevler"
          >
            Tümü
          </button>
          <button
            type="button"
            className={`tab ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
            title="Tamamlanmamış"
          >
            Aktif
          </button>
          <button
            type="button"
            className={`tab ${filter === 'done' ? 'active' : ''}`}
            onClick={() => setFilter('done')}
            title="Tamamlanan"
          >
            Tamamlanan
          </button>
        </div>

        {error && <p className="error">{error}</p>}

        {filteredTasks.length === 0 ? (
          <div className="empty">
            {filter === 'all' && 'Henüz hiç görev yok. İlk görevi ekleyin ✨'}
            {filter === 'active' && 'Tamamlanmamış görev yok.'}
            {filter === 'done' && 'Tamamlanmış görev yok.'}
          </div>
        ) : (
          <ul className="list">
            {filteredTasks.map(t => (
              <li key={t.id} className="item">
                <div className="left">
                  <input
                    type="checkbox"
                    checked={t.isDone}
                    onChange={() => onToggle(t.id)}
                  />
                  <span className={`title ${t.isDone ? 'done' : ''}`}>
                    {t.title}
                  </span>
                </div>
                <button className="del" onClick={() => onDelete(t.id)}>Sil</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
