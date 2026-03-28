import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createTask({ 
  title = '', 
  details = '', 
  priority = 'low', 
  dueDate = null, 
  dueTime = null,
  completed = false 
} = {}) {
  return {
    id: crypto.randomUUID(),
    title,
    details,
    priority,
    dueDate,
    dueTime,
    completed,
    createdAt: new Date(),
  };
}

function loadTasks() {
  if (!browser) return [];
  try {
    const stored = localStorage.getItem('tasks');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks) {
  if (!browser) return;
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

export const tasks = writable(loadTasks());

tasks.subscribe(saveTasks);

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