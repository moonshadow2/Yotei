<script>
  import { tasks } from '$lib/components/tasks.js';

  const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00'];
  const priorityColor = { high: '#ff4d4d', medium: '#ffd700', low: '#00ff87' };

  function getWeekDays() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return d;
    });
  }

  function isThisWeek(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const d = new Date(dateStr + 'T00:00:00');
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1);
    startOfWeek.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);
    return d >= startOfWeek && d <= endOfWeek;
  }

  function normaliseHour(timeStr) {
    if (!timeStr) return null;
    const [h] = timeStr.split(':');
    return h.padStart(2, '0') + ':00';
  }

  function tasksAtHour(dateObj, hour) {
    const str = dateObj.toISOString().split('T')[0];
    return $tasks.filter(t => {
      if (t.dueDate !== str) return false;
      const taskHour = normaliseHour(t.dueTime);
      if (!taskHour) return hour === '08:00';
      return taskHour === hour;
    });
  }

  $: weekDays = getWeekDays();
  $: hasTasksThisWeek = $tasks.some(t => isThisWeek(t.dueDate));
</script>

<div class="view-title">This Week</div>

{#if !hasTasksThisWeek}
  <div class="empty-state">
    <p class="empty-icon">[ ]</p>
    <p>No tasks this week. Hit + to add one!</p>
  </div>
{:else}
  <div class="weekly-grid">
    <div class="week-header"></div>
    {#each weekDays as day, i}
      <div class="week-header">
        {weekDayNames[i]}<br>
        <span class="week-date">{day.getDate()}</span>
      </div>
    {/each}

    {#each hours as hour}
      <div class="hour-label">{hour}</div>
      {#each weekDays as day}
        <div class="week-cell">
          {#each tasksAtHour(day, hour) as t (t.id)}
            <div
              class="week-task {t.completed ? 'week-task-done' : ''}"
              style="border-left: 3px solid {priorityColor[t.priority]};"
            >
              {t.title}
            </div>
          {/each}
        </div>
      {/each}
    {/each}
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

  .weekly-grid {
    display: grid;
    grid-template-columns: 55px repeat(7, 1fr);
    gap: 1px;
    background-color: rgba(255,255,255,0.04);
    border-radius: 12px;
    overflow: hidden;
    font-size: 0.75rem;
  }

  .week-header {
    background-color: #111;
    padding: 0.6rem 0.4rem;
    text-align: center;
    font-weight: 600;
    color: #00ff87;
    line-height: 1.6;
  }

  .week-date { color: rgba(255,255,255,0.3); font-size: 0.65rem; }

  .hour-label {
    background-color: #0d0d0d;
    padding: 0.4rem 0.5rem;
    color: rgba(255,255,255,0.3);
    text-align: right;
    display: flex;
    align-items: flex-start;
    justify-content: flex-end;
  }

  .week-cell {
    background-color: #0f0f0f;
    min-height: 48px;
    padding: 0.25rem;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .week-task {
    background: linear-gradient(135deg, #003320, #003d4f);
    border-radius: 6px;
    padding: 0.25rem 0.4rem;
    color: #ffffff;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.7rem;
  }

  .week-task-done {
    opacity: 0.4;
    text-decoration: line-through;
  }

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
</style>