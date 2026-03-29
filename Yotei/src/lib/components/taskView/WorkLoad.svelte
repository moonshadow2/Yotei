<script>
  import { tasks } from '$lib/components/tasks.js';
  import { get } from 'svelte/store';

  let taskList = $state(get(tasks));
  $effect(() => tasks.subscribe(v => { taskList = v; }));

  const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };
  let weekOffset = $state(0);

  const weekDays    = $derived(getWeekDays(weekOffset));
  const chartData   = $derived(buildChartData(weekDays, taskList));
  const maxScore    = $derived(Math.max(...chartData.map(d => d.score), 1));
  const isCurrentWeek = $derived(weekOffset === 0);

  function getWeekDays(offset) {
    const now = new Date();
    const day = now.getDay();
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

  function buildChartData(days, list) {
    return days.map(day => {
      const dayStr = toDateStr(day);
      const dayTasks = list.filter(t => t.dueDate === dayStr && !t.completed);
      const score = dayTasks.reduce((sum, t) => sum + (PRIORITY_WEIGHT[t.priority] ?? 1), 0);
      const breakdown = {
        high:   dayTasks.filter(t => t.priority === 'high').length,
        medium: dayTasks.filter(t => t.priority === 'medium').length,
        low:    dayTasks.filter(t => t.priority === 'low').length,
      };
      return { day, dayStr, score, breakdown, total: dayTasks.length };
    });
  }

  function toDateStr(date) { return date.toISOString().split('T')[0]; }
  function isToday(date)   { return toDateStr(date) === toDateStr(new Date()); }

  const DAY_SHORT   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const MONTH_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

  function formatWeekLabel(days) {
    const s = days[0], e = days[6];
    return s.getMonth() === e.getMonth()
      ? `${MONTH_SHORT[s.getMonth()]} ${s.getDate()}–${e.getDate()}, ${s.getFullYear()}`
      : `${MONTH_SHORT[s.getMonth()]} ${s.getDate()} – ${MONTH_SHORT[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
  }

  function barColor(score, max) {
    if (score === 0) return null;
    const r = score / max;
    return r > 0.66 ? 'high' : r > 0.33 ? 'medium' : 'low';
  }
</script>

<!-- View header matches the pattern of other views -->
<div class="view-title">Priority Chart</div>

<div class="chart-wrap">
  <!-- Header -->
  <div class="chart-header">
    <p class="chart-subtitle">{formatWeekLabel(weekDays)}</p>
    <div class="nav-controls">
      <button class="nav-btn" onclick={() => weekOffset--} disabled={isCurrentWeek} title="Previous week">←</button>
      {#if !isCurrentWeek}
        <button class="now-btn" onclick={() => weekOffset = 0}>Today</button>
      {:else}
        <span class="week-badge">This Week</span>
      {/if}
      <button class="nav-btn" onclick={() => weekOffset++} title="Next week">→</button>
    </div>
  </div>

  <!-- Bar chart -->
  <div class="bars-container">
    {#each chartData as item, i}
      {@const heightPct = item.score === 0 ? 0 : Math.max(6, (item.score / maxScore) * 100)}
      {@const today = isToday(item.day)}
      {@const level = barColor(item.score, maxScore)}

      <div class="bar-col" class:today>
        <div class="score-label" class:visible={item.score > 0}>
          {item.score > 0 ? item.score : ''}
        </div>

        <div class="bar-track">
          <div
            class="bar-fill"
            class:level-high={level === 'high'}
            class:level-medium={level === 'medium'}
            class:level-low={level === 'low'}
            class:empty={item.score === 0}
            style="height: {heightPct}%"
          >
            {#if item.score > 0}<div class="bar-shine"></div>{/if}
          </div>
        </div>

        <div class="day-label">
          <span class="day-name">{DAY_SHORT[i]}</span>
          <span class="day-num" class:today-num={today}>{item.day.getDate()}</span>
        </div>

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

<style>
  /* ── View title — matches other views ── */
  .view-title {
    font-size: clamp(1.5rem, 3vw, 2.2rem);
    font-weight: 700;
    background: linear-gradient(90deg, #00ff87, #60efff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 1.5rem;
  }

  /* ── Chart card ── */
  .chart-wrap {
    background: #111111;
    border: 1px solid rgba(0, 255, 135, 0.2);
    border-radius: 16px;
    padding: 20px 24px 18px;
    font-family: 'Inter', sans-serif;
    color: #ffffff;
    position: relative;
    overflow: visible;
  }

  /* ── Header ── */
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 24px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .chart-subtitle {
    margin: 0;
    font-size: 12px;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.03em;
  }

  .nav-controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav-btn {
    background: #1a1a1a;
    border: 1px solid rgba(0, 255, 135, 0.2);
    color: rgba(255, 255, 255, 0.6);
    width: 30px;
    height: 30px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .nav-btn:hover:not(:disabled) {
    background: rgba(0, 255, 135, 0.08);
    border-color: rgba(0, 255, 135, 0.5);
    color: #00ff87;
  }

  .nav-btn:disabled { opacity: 0.3; cursor: not-allowed; }

  .now-btn {
    background: rgba(0, 255, 135, 0.08);
    border: 1px solid rgba(0, 255, 135, 0.3);
    color: #00ff87;
    padding: 0 12px;
    height: 30px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 11px;
    font-family: inherit;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    transition: all 0.15s ease;
  }

  .now-btn:hover {
    background: rgba(0, 255, 135, 0.15);
    border-color: #00ff87;
    box-shadow: 0 0 16px rgba(0, 255, 135, 0.2);
  }

  .week-badge {
    background: transparent;
    border: 1px solid rgba(0, 255, 135, 0.1);
    color: rgba(255, 255, 255, 0.25);
    padding: 0 10px;
    height: 30px;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    display: flex;
    align-items: center;
  }

  /* ── Bars ── */
  .bars-container {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    gap: 6px;
    height: 180px;
    align-items: end;
  }

  .bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 100%;
    position: relative;
    cursor: default;
  }

  .bar-col:hover .tooltip {
    opacity: 1;
    transform: translateX(-50%) translateY(-4px);
    pointer-events: auto;
  }

  .score-label {
    font-size: 10px;
    font-weight: 700;
    color: rgba(255,255,255,0.2);
    height: 16px;
    display: flex;
    align-items: center;
    letter-spacing: 0.05em;
  }

  .score-label.visible { color: rgba(255,255,255,0.6); }

  .bar-track {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    padding: 0 3px;
  }

  .bar-fill {
    width: 100%;
    border-radius: 5px 5px 2px 2px;
    position: relative;
    overflow: hidden;
    transition: height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .bar-fill.empty {
    background: rgba(255,255,255,0.05);
    height: 3px !important;
    border-radius: 3px;
  }

  .bar-fill.level-high   { background: linear-gradient(180deg, #00ff87, #00c863); box-shadow: 0 0 16px rgba(0,255,135,0.4); }
  .bar-fill.level-medium { background: linear-gradient(180deg, #60efff, #00c8d4); box-shadow: 0 0 12px rgba(96,239,255,0.3); }
  .bar-fill.level-low    { background: linear-gradient(180deg, rgba(0,255,135,0.4), rgba(0,200,100,0.2)); }

  .bar-shine {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255,255,255,0.15) 0%, transparent 100%);
    border-radius: 5px 5px 0 0;
  }

  /* Today column glow */
  .bar-col.today .bar-track::before {
    content: '';
    position: absolute;
    inset: -4px 0 -28px;
    background: rgba(0, 255, 135, 0.03);
    border-radius: 6px;
    border: 1px solid rgba(0, 255, 135, 0.15);
    pointer-events: none;
  }

  /* ── Day labels ── */
  .day-label {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1px;
    margin-top: 8px;
  }

  .day-name {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: rgba(255,255,255,0.25);
    font-weight: 600;
  }

  .day-num {
    font-size: 12px;
    color: rgba(255,255,255,0.45);
    font-weight: 500;
  }

  .today-num { color: #00ff87; font-weight: 700; }

  /* ── Tooltip ── */
  .tooltip {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: #1a1a1a;
    border: 1px solid rgba(0,255,135,0.2);
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 11px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
    z-index: 10;
    color: rgba(255,255,255,0.8);
    box-shadow: 0 8px 24px rgba(0,255,135,0.1);
  }

  .tooltip strong { display: block; font-size: 12px; color: #fff; margin-bottom: 5px; }
  .tt-rows { display: flex; flex-direction: column; gap: 2px; }
  .tt-high { color: #00ff87; }
  .tt-med  { color: #60efff; }
  .tt-low  { color: rgba(0,255,135,0.5); }

  /* ── Legend ── */
  .legend {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
    padding-top: 14px;
    border-top: 1px solid rgba(0,255,135,0.08);
    flex-wrap: wrap;
  }

  .leg-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: rgba(255,255,255,0.35);
    letter-spacing: 0.04em;
  }

  .leg-dot {
    width: 8px; height: 8px;
    border-radius: 2px;
    display: inline-block;
  }

  .leg-dot.high { background: #00ff87; box-shadow: 0 0 6px rgba(0,255,135,0.6); }
  .leg-dot.med  { background: #60efff; box-shadow: 0 0 6px rgba(96,239,255,0.5); }
  .leg-dot.low  { background: rgba(0,255,135,0.35); }

  .leg-note {
    margin-left: auto;
    font-size: 10px;
    color: rgba(255,255,255,0.15);
    font-style: italic;
  }
</style>