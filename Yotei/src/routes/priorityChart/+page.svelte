<script>
  import { tasks } from '$lib/components/tasks.js';
  import { get } from 'svelte/store';
  import '$lib/styles/priorityChart.css';

  let taskList = $state(get(tasks));
  $effect(() => tasks.subscribe(v => { taskList = v; }));

  // Page-scoped background — restored on unmount
  $effect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = '#0f1117';
    return () => { document.body.style.backgroundColor = prev; };
  });

  // Priority weight map — higher = taller bar
  const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

  // Week offset: 0 = current week, 1 = next week, etc.
  let weekOffset = $state(0);

  // Derive the 7-day window starting from the nearest Monday
  const weekDays = $derived(getWeekDays(weekOffset));
  const chartData = $derived(buildChartData(weekDays, taskList));
  const maxScore = $derived(Math.max(...chartData.map(d => d.score), 1));
  const isCurrentWeek = $derived(weekOffset === 0);

  function getWeekDays(offset) {
    const now = new Date();
    // Find Monday of current week
    const day = now.getDay(); // 0=Sun
    const diffToMonday = (day === 0 ? -6 : 1 - day);
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday + offset * 7);
    monday.setHours(0, 0, 0, 0);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      return d;
    });
  }

  function buildChartData(days, tasks) {
    return days.map(day => {
      const dayStr = toDateStr(day);
      const dayTasks = tasks.filter(t => t.dueDate === dayStr && !t.completed);
      const score = dayTasks.reduce((sum, t) => sum + (PRIORITY_WEIGHT[t.priority] ?? 1), 0);
      const breakdown = {
        high: dayTasks.filter(t => t.priority === 'high').length,
        medium: dayTasks.filter(t => t.priority === 'medium').length,
        low: dayTasks.filter(t => t.priority === 'low').length,
      };
      return { day, dayStr, score, breakdown, total: dayTasks.length };
    });
  }

  function toDateStr(date) {
    return date.toISOString().split('T')[0];
  }

  function isToday(date) {
    return toDateStr(date) === toDateStr(new Date());
  }

  const DAY_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function formatWeekLabel(days) {
    const start = days[0];
    const end = days[6];
    if (start.getMonth() === end.getMonth()) {
      return `${MONTH_SHORT[start.getMonth()]} ${start.getDate()}–${end.getDate()}, ${start.getFullYear()}`;
    }
    return `${MONTH_SHORT[start.getMonth()]} ${start.getDate()} – ${MONTH_SHORT[end.getMonth()]} ${end.getDate()}, ${end.getFullYear()}`;
  }

  function barColor(score, maxScore) {
    if (score === 0) return null;
    const ratio = score / maxScore;
    if (ratio > 0.66) return 'high';
    if (ratio > 0.33) return 'medium';
    return 'low';
  }
</script>
<div class="chart-wrap">
  <!-- Header -->
  <div class="chart-header">
    <div class="title-block">
      <span class="chart-icon">◈</span>
      <div>
        <h2 class="chart-title">Priority Outlook</h2>
        <p class="chart-subtitle">{formatWeekLabel(weekDays)}</p>
      </div>
    </div>
    <div class="nav-controls">
      <button
        class="nav-btn"
        on:click={() => weekOffset--}
        disabled={isCurrentWeek}
        title="Previous week"
      >
        ←
      </button>
      {#if !isCurrentWeek}
        <button class="now-btn" on:click={() => weekOffset = 0}>Today</button>
      {:else}
        <span class="week-badge">This Week</span>
      {/if}
      <button class="nav-btn" on:click={() => weekOffset++} title="Next week">→</button>
    </div>
  </div>

  <!-- Bar chart -->
  <div class="bars-container">
    {#each chartData as item, i}
      {@const heightPct = item.score === 0 ? 0 : Math.max(6, (item.score / maxScore) * 100)}
      {@const today = isToday(item.day)}
      {@const level = barColor(item.score, maxScore)}

      <div class="bar-col" class:today>
        <!-- Score label -->
        <div class="score-label" class:visible={item.score > 0}>
          {item.score > 0 ? item.score : ''}
        </div>

        <!-- Bar track -->
        <div class="bar-track">
          <div
            class="bar-fill"
            class:level-high={level === 'high'}
            class:level-medium={level === 'medium'}
            class:level-low={level === 'low'}
            class:empty={item.score === 0}
            style="height: {heightPct}%"
          >
            {#if item.score > 0}
              <div class="bar-shine"></div>
            {/if}
          </div>
        </div>

        <!-- Day label -->
        <div class="day-label">
          <span class="day-name">{DAY_SHORT[i]}</span>
          <span class="day-num" class:today-num={today}>{item.day.getDate()}</span>
        </div>

        <!-- Tooltip -->
        {#if item.total > 0}
          <div class="tooltip">
            <strong>{item.total} task{item.total !== 1 ? 's' : ''}</strong>
            <div class="tt-rows">
              {#if item.breakdown.high > 0}<span class="tt-high">▲ {item.breakdown.high} high</span>{/if}
              {#if item.breakdown.medium > 0}<span class="tt-med">◆ {item.breakdown.medium} medium</span>{/if}
              {#if item.breakdown.low > 0}<span class="tt-low">▼ {item.breakdown.low} low</span>{/if}
            </div>
          </div>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Legend -->
  <div class="legend">
    <span class="leg-item"><span class="leg-dot high"></span>High (×3)</span>
    <span class="leg-item"><span class="leg-dot med"></span>Medium (×2)</span>
    <span class="leg-item"><span class="leg-dot low"></span>Low (×1)</span>
    <span class="leg-note">Bar height = priority score</span>
  </div>
</div>

