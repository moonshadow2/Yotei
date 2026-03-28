import { writable } from 'svelte/store';

function createTask({ 
  title = '', 
  details = '', 
  priority = 'low', 
  dueDate = null, 
  dueTime = null,  // add this
  completed = false 
} = {}) {
  return {
    id: crypto.randomUUID(),
    title,
    details,
    priority,
    dueDate,
    dueTime,        // add this
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