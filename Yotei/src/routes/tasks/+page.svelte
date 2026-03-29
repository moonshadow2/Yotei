<script>
  import { tasks, deleteTask, toggleComplete } from '$lib/components/tasks.js';
  import AddTask from '$lib/components/task-plus-button.svelte';

  let sortBy = 'dueDate';

  const priorityOrder = { high: 1, medium: 2, low: 3 };

  $: sortedTasks = [...$tasks].sort((a, b) => {
    if (sortBy === 'dueDate') {
      const aDate = new Date(`${a.dueDate}T${a.dueTime || '00:00'}`);
      const bDate = new Date(`${b.dueDate}T${b.dueTime || '00:00'}`);
      return aDate - bDate;
    } else {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
  });

  $: completedCount = $tasks.filter(t => t.completed).length;
  $: progressPercent = $tasks.length ? Math.round((completedCount / $tasks.length) * 100) : 0;

  function formatDue(date, time) {
    if (!date) return 'No due date';
    return time ? `${date} at ${time}` : date;
  }

  const priorityBadge = {
    high: 'bg-danger',
    medium: 'bg-warning text-dark',
    low: 'bg-success',
  };

  const priorityBorder = {
    high: '#dc3545',
    medium: '#ffc107',
    low: '#198754',
  };
</script>

<!-- Page Background -->
<div class="page-bg">
  <div class="content-panel">

    <!-- Header -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h1 class="page-title mb-0">My Tasks</h1>
        <p class="text-muted small mb-0">{$tasks.length} total · {completedCount} completed</p>
      </div>
      <div class="btn-group shadow-sm">
        <button
          class="btn btn-sm {sortBy === 'dueDate' ? 'btn-primary' : 'btn-outline-primary'}"
          on:click={() => (sortBy = 'dueDate')}
        >
          📅 By Date
        </button>
        <button
          class="btn btn-sm {sortBy === 'priority' ? 'btn-primary' : 'btn-outline-primary'}"
          on:click={() => (sortBy = 'priority')}
        >
          🔥 By Priority
        </button>
      </div>
    </div>

    <!-- Progress Bar -->
    {#if $tasks.length > 0}
      <div class="mb-4">
        <div class="d-flex justify-content-between small text-muted mb-1">
          <span>Progress</span>
          <span>{progressPercent}%</span>
        </div>
        <div class="progress" style="height: 8px; border-radius: 99px;">
          <div
            class="progress-bar bg-success"
            style="width: {progressPercent}%; border-radius: 99px; transition: width 0.4s ease;"
            role="progressbar"
          ></div>
        </div>
      </div>
    {/if}

    <!-- Task List -->
    <div class="task-scroll">
      {#if sortedTasks.length === 0}
        <div class="empty-state">
          <p class="fs-1">📋</p>
          <p class="text-muted">No tasks yet. Hit the <strong>+</strong> button to get started!</p>
        </div>
      {:else}
        {#each sortedTasks as task (task.id)}
          <div
            class="task-card {task.completed ? 'task-completed' : ''}"
            style="border-left: 4px solid {priorityBorder[task.priority]};"
          >
            <!-- Top Row -->
            <div class="d-flex justify-content-between align-items-start">
              <div class="d-flex flex-wrap align-items-center gap-2">
                <h5 class="task-title mb-0">{task.title}</h5>
                <span class="badge {priorityBadge[task.priority]}">
                  {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                </span>
                {#if task.completed}
                  <span class="badge bg-secondary">Done</span>
                {/if}
              </div>

              <!-- Buttons -->
              <div class="d-flex gap-2 ms-2">
                <button
                  class="btn btn-sm {task.completed ? 'btn-outline-secondary' : 'btn-outline-success'}"
                  on:click={() => toggleComplete(task.id)}
                  title={task.completed ? 'Mark incomplete' : 'Mark complete'}
                >
                  {task.completed ? '↩' : '✓'}
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  on:click={() => deleteTask(task.id)}
                  title="Delete"
                >
                  🗑
                </button>
              </div>
            </div>

            <!-- Due Date -->
            <p class="task-due mt-2 mb-0">🗓 {formatDue(task.dueDate, task.dueTime)}</p>

            <!-- Collapsible Details -->
            {#if task.details}
              <div class="mt-2">
                <a
                  class="small text-decoration-none text-primary"
                  data-bs-toggle="collapse"
                  href="#details-{task.id}"
                  role="button"
                >
                  Show details ▾
                </a>
                <div class="collapse mt-2" id="details-{task.id}">
                  <div class="task-details-box">{task.details}</div>
                </div>
              </div>
            {/if}
          </div>
        {/each}
      {/if}
    </div>

  </div>
</div>

<AddTask />

<style>
  .page-bg {
    min-height: 100vh;
    background: linear-gradient(135deg, #e8eaf6 0%, #e3f2fd 100%);
    padding: 2.5rem 1rem;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }

  .content-panel {
    width: 100%;
    max-width: 700px;
    background: #ffffff;
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08);
  }

  .page-title {
    font-size: 2rem;
    font-weight: 700;
    color: #1a1a2e;
  }

  .task-scroll {
    max-height: 60vh;
    overflow-y: auto;
    padding-right: 4px;
  }

  .task-scroll::-webkit-scrollbar {
    width: 6px;
  }

  .task-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 99px;
  }

  .task-scroll::-webkit-scrollbar-thumb {
    background: #c0c0c0;
    border-radius: 99px;
  }

  .task-card {
    background: #f8f9ff;
    border-radius: 12px;
    padding: 1rem 1.25rem;
    margin-bottom: 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.07);
    transition: transform 0.15s ease, box-shadow 0.15s ease;
  }

  .task-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }

  .task-completed {
    opacity: 0.6;
    background: #f0f0f0;
  }

  .task-completed .task-title {
    text-decoration: line-through;
    color: #999;
  }

  .task-title {
    font-size: 1rem;
    font-weight: 600;
    color: #1a1a2e;
  }

  .task-due {
    font-size: 0.8rem;
    color: #6c757d;
  }

  .task-details-box {
    background: #eef0fb;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    font-size: 0.85rem;
    color: #444;
  }

  .empty-state {
    text-align: center;
    padding: 3rem 1rem;
  }
</style>

<!-- Add Task Button -->
<AddTask />