import { writable } from 'svelte/store';

function createTask({ 
  title = '', 
  details = '', 
  priority = 'low', 
  dueDate = null, 
  dueTime = null,
  endTime = null,
  completed = false 
} = {}) {
  function pad(n){return String(n).padStart(2,'0')}

  function normalizeDate(d) {
    if (!d) return null;
    if (d instanceof Date) return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
    return String(d);
  }

  function normalizeTime(t) {
    if (!t) return null;
    const s = String(t).trim();
    const m = s.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/);
    if (!m) return null;
    let hh = parseInt(m[1], 10);
    const mm = m[2] ? parseInt(m[2], 10) : 0;
    const ampm = m[3];
    if (ampm) {
      const isPM = /pm/i.test(ampm);
      if (isPM && hh < 12) hh += 12;
      if (!isPM && hh === 12) hh = 0;
    }
    return `${pad(hh)}:${pad(mm)}`;
  }

  function addHour(t) {
    if (!t) return null;
    const [hh, mm] = t.split(':').map(n => parseInt(n,10));
    const d = new Date();
    d.setHours(hh, mm, 0, 0);
    d.setHours(d.getHours() + 1);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }

  const nd = normalizeDate(dueDate);
  const nt = normalizeTime(dueTime);
  const ne = endTime ? normalizeTime(endTime) : (nt ? addHour(nt) : null);

  return {
    id: crypto.randomUUID(),
    title,
    details,
    priority,
    dueDate: nd,
    dueTime: nt,
    endTime: ne,
    completed,
    createdAt: new Date(),
  };
}

export const tasks = writable([]);

export function addTask(taskData) {
  const task = createTask(taskData);
  tasks.update(t => [...t, task]);
}

export function deleteTask(id) {
  tasks.update(t => t.filter(task => task.id !== id));
}

export function updateTask(id, changes) {
  tasks.update(t =>
    t.map(task => task.id === id ? { ...task, ...changes } : task)
  );
}

export function toggleComplete(id) {
  tasks.update(t =>
    t.map(task => task.id === id ? { ...task, completed: !task.completed } : task)
  );
}