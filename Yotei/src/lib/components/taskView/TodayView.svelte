<script>
  import { tasks, deleteTask, toggleComplete } from '$lib/components/tasks.js';

  const priorityOrder = { high: 1, medium: 2, low: 3 };
  const priorityColor = { high: '#ff4d4d', medium: '#ffd700', low: '#00ff87' };
  const priorityBorder = { high: '#ff4d4d', medium: '#ffd700', low: '#00ff87' };

  function isToday(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const d = new Date(dateStr + 'T00:00:00');
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
  }

  function formatDue(date, time) {
    if (!date) return 'No due date';
    return time ? `${date} at ${time}` : date;
  }

  function parseTimeMinutes(t) {
    if (!t) return Infinity;
    const m = String(t).match(/(\d{1,2}):(\d{2})/);
    if (!m) return Infinity;
    return parseInt(m[1],10) * 60 + parseInt(m[2],10);
  }

  $: todayTasks = $tasks
    .filter(t => isToday(t.dueDate))
    .sort((a, b) => {
      const ta = parseTimeMinutes(a.dueTime);
      const tb = parseTimeMinutes(b.dueTime);
      if (ta !== tb) return ta - tb;
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  let selectedTask = null;

  function openTask(task) { selectedTask = task; }
  function closeTask() { selectedTask = null; }
</script>

<div class="view-title">Today's Tasks</div>

{#if todayTasks.length === 0}
  <div class="empty-state">
    <p class="empty-icon">[ ]</p>
    <p>No tasks due today. Hit + to add one!</p>
  </div>
{:else}
  {#each todayTasks as task (task.id)}
    <div on:click={() => openTask(task)} class="task-card {task.completed ? 'completed' : ''}" style="border-left: 4px solid {priorityBorder[task.priority]};">
      <div class="task-header">
        <div class="task-left">
          <button
            class="check-btn {task.completed ? 'checked' : ''}"
            on:click|stopPropagation={() => toggleComplete(task.id)}
            title="Mark complete"
          >
            {#if task.completed}
              <svg width="14" height="14" viewBox="0 0 14 14">
                <polyline points="2,7 5.5,10.5 12,3" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            {/if}
          </button>
          <span class="task-title">{task.title}</span>
        </div>
        <div class="task-right">
          <span class="priority-badge" style="background-color: {priorityColor[task.priority]}22; color: {priorityColor[task.priority]};">
            {task.priority}
          </span>
          <button class="action-btn danger" on:click|stopPropagation={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      </div>
      <span class="task-due">{formatDue(task.dueDate, task.dueTime)}</span>
      {#if task.details}
        <span class="task-description">{task.details}</span>
      {/if}
    </div>
  {/each}
{/if}

{#if selectedTask}
  <div class="modal-backdrop" on:click={closeTask}></div>
  <div class="modal-root">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">{selectedTask.title}</div>
        <button class="close-btn" on:click={closeTask}>✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex;justify-content:space-between;gap:12px;">
          <div style="flex:1"><strong>When:</strong> {formatDue(selectedTask.dueDate, selectedTask.dueTime)}{#if selectedTask.endTime} — {selectedTask.endTime}{/if}</div>
          <div style="flex:0"> <span class="priority-badge" style="background-color: {priorityColor[selectedTask.priority]}22; color: {priorityColor[selectedTask.priority]};">{selectedTask.priority}</span></div>
        </div>
        {#if selectedTask.details}
          <div style="margin-top:12px;color:rgba(255,255,255,0.8)">{selectedTask.details}</div>
        {/if}
      </div>
      <div class="modal-footer">
        <button class="btn secondary" on:click={closeTask}>Close</button>
        <button class="btn primary" on:click={() => { toggleComplete(selectedTask.id); }}>Toggle Complete</button>
      </div>
    </div>
  </div>
{/if}

<style>
  .view-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 700;
    background: linear-gradient(90deg, #00ff87, #60efff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.5rem;
  }

  .task-card {
    background-color: #111111;
    border: 1px solid rgba(0, 255, 135, 0.12);
    border-radius: 14px;
    padding: 1.25rem 1.5rem;
    margin-bottom: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    transition: border-color 0.2s ease, transform 0.15s ease;
  }

  .task-card:hover {
    border-color: rgba(0, 255, 135, 0.35);
    transform: translateY(-2px);
  }

  .task-card.completed { opacity: 0.5; }
  .task-card.completed .task-title { text-decoration: line-through; color: rgba(255,255,255,0.4); }

  .task-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
  }

  .task-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .task-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .check-btn {
    width: 22px;
    height: 22px;
    border-radius: 6px;
    border: 2px solid rgba(0, 255, 135, 0.4);
    background: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00ff87;
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .check-btn:hover {
    border-color: #00ff87;
    background-color: rgba(0, 255, 135, 0.1);
  }

  .check-btn.checked {
    background-color: rgba(0, 255, 135, 0.2);
    border-color: #00ff87;
  }

  .task-title { font-size: 1rem; font-weight: 600; color: #ffffff; }
  .task-due { font-size: 0.8rem; color: rgba(255, 255, 255, 0.45); padding-left: 2rem; }
  .task-description { font-size: 0.85rem; color: rgba(255, 255, 255, 0.45); padding-left: 2rem; }

  .priority-badge {
    font-size: 0.7rem;
    font-weight: 700;
    padding: 0.2rem 0.6rem;
    border-radius: 20px;
    text-transform: uppercase;
    letter-spacing: 1px;
    white-space: nowrap;
  }

  .action-btn {
    background: none;
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 8px;
    color: rgba(255,255,255,0.6);
    padding: 0.25rem 0.6rem;
    font-size: 0.75rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .action-btn.danger:hover { border-color: #ff4d4d; color: #ff4d4d; }

  .empty-state {
    text-align: center;
    padding: 4rem 1rem;
    color: rgba(255,255,255,0.3);
  }

  .empty-icon {
    font-size: 2rem;
    font-family: monospace;
    color: rgba(0, 255, 135, 0.3);
  }
  /* Modal styles reused from add-task modal */
  .modal-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.45); z-index: 1000; }
  .modal-root { position: fixed; inset:0; display:flex; align-items:center; justify-content:center; padding:1rem; z-index:1001; pointer-events:none }
  .modal-card { position: relative; z-index:1002; pointer-events:auto; width:640px; max-width:95%; background:#0d0d0d; border:1px solid rgba(0,255,135,0.08); border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.6); overflow:hidden; }
  .modal-header { display:flex; justify-content:space-between; align-items:center; padding:1rem 1rem; border-bottom:1px solid rgba(255,255,255,0.03); }
  .modal-title { font-weight:700; background:linear-gradient(90deg,#00ff87,#60efff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .close-btn { background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:1.1rem }
  .modal-body { padding:1rem; display:flex; flex-direction:column; gap:0.5rem }
  .modal-footer { display:flex; justify-content:flex-end; gap:0.5rem; padding:0.75rem 1rem; border-top:1px solid rgba(255,255,255,0.03) }
  .btn { padding:0.5rem 0.9rem; border-radius:8px; cursor:pointer; border:1px solid rgba(255,255,255,0.06) }
  .btn.primary { background:linear-gradient(90deg,#00a86b,#00b4ff); color:#001; font-weight:700 }
  .btn.secondary { background:transparent; color:rgba(255,255,255,0.8) }
</style>