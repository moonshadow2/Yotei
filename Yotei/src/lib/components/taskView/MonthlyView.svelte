<script>
  import { tasks } from '$lib/components/tasks.js';

  const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  const priorityColor = { high: '#ff4d4d', medium: '#ffd700', low: '#00ff87' };

  function getDaysInMonth() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const offset = firstDay === 0 ? 6 : firstDay - 1;
    return { daysInMonth, offset, year, month };
  }

  function parseDueDate(dateVal) {
    if (!dateVal) return null;
    if (typeof dateVal === 'string') return new Date(dateVal + 'T00:00:00');
    return new Date(dateVal);
  }

  function tasksForMonthDay(day) {
    const { year, month } = getDaysInMonth();
    return $tasks.filter(t => {
      const d = parseDueDate(t.dueDate);
      if (!d) return false;
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  }

  $: ({ daysInMonth, offset, month, year } = getDaysInMonth());
  $: today = new Date();
</script>

<div class="view-title">{monthNames[month]} {year}</div>

<div class="month-grid">
  {#each weekDayNames as d}
    <div class="month-day-header">{d}</div>
  {/each}

  {#each Array(offset) as _}
    <div class="month-cell empty"></div>
  {/each}

  {#each Array.from({ length: daysInMonth }, (_, i) => i + 1) as day}
    {@const isTodayCell = day === today.getDate() && month === today.getMonth() && year === today.getFullYear()}
    <div class="month-cell {isTodayCell ? 'today' : ''}">
      <div class="month-date {isTodayCell ? 'today-num' : ''}">{day}</div>
      {#each tasksForMonthDay(day) as task}
        <div class="month-task-dot" style="color: {priorityColor[task.priority]};">
          - {task.title}
        </div>
      {/each}
    </div>
  {/each}
</div>

<style>
  .view-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 700;
    background: linear-gradient(90deg, #00ff87, #60efff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.5rem;
  }

  .month-grid {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 5px;
  }

  .month-day-header {
    text-align: center;
    font-size: 0.75rem;
    color: #00ff87;
    font-weight: 600;
    padding: 0.4rem 0;
  }

  .month-cell {
    background-color: #111111;
    border: 1px solid rgba(255,255,255,0.05);
    border-radius: 10px;
    min-height: 75px;
    padding: 0.35rem;
    transition: border-color 0.2s ease;
  }

  .month-cell:hover { border-color: rgba(0, 255, 135, 0.2); }
  .month-cell.today { border-color: rgba(0, 255, 135, 0.4); }
  .month-cell.empty { background: transparent; border: none; }

  .month-date {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.35);
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  .month-date.today-num { color: #00ff87; }

  .month-task-dot {
    font-size: 0.62rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>