<script>
  import { tasks } from '$lib/components/tasks.js';

  // Priority weight map — higher = taller bar
  const PRIORITY_WEIGHT = { high: 3, medium: 2, low: 1 };

  // Week offset: 0 = current week, 1 = next week, etc.
  let weekOffset = $state(0);

  // Derive the 7-day window starting from the nearest Monday
  const weekDays = $derived(getWeekDays(weekOffset));
  const chartData = $derived(buildChartData(weekDays, $tasks));
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

<style>
  :global(body) {
    background-color: #0b0d14;
  }
  .chart-wrap {
    background: #0f1117;
    border: 1px solid #1e2130;
    border-radius: 16px;
    padding: 24px 28px 20px;
    font-family: 'DM Mono', 'Fira Code', monospace;
    color: #c8cfe0;
    position: relative;
    overflow: visible;
  }

  /* ── Header ── */
  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
    gap: 12px;
    flex-wrap: wrap;
  }

  .title-block {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .chart-icon {
    font-size: 22px;
    color: #5b8dee;
    line-height: 1;
  }

  .chart-title {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: #e4e9f5;
    text-transform: uppercase;
  }

  .chart-subtitle {
    margin: 2px 0 0;
    font-size: 11px;
    color: #4a5168;
    letter-spacing: 0.03em;
  }

  /* ── Nav controls ── */
  .nav-controls {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav-btn {
    background: #1a1e2e;
    border: 1px solid #252a3d;
    color: #8892a4;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s ease;
  }

  .nav-btn:hover:not(:disabled) {
    background: #222740;
    border-color: #3d4460;
    color: #c8cfe0;
  }

  .nav-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .now-btn {
    background: #1a2240;
    border: 1px solid #2d3d6e;
    color: #5b8dee;
    padding: 0 12px;
    height: 32px;
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
    background: #1e2d55;
    border-color: #4060aa;
  }

  .week-badge {
    background: #0d1520;
    border: 1px solid #1a2535;
    color: #3a4158;
    padding: 0 10px;
    height: 32px;
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
    height: 160px;
    align-items: end;
    padding-bottom: 0;
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
    transform: translateY(-4px);
    pointer-events: auto;
  }

  .score-label {
    font-size: 10px;
    font-weight: 700;
    color: #4a5168;
    height: 16px;
    display: flex;
    align-items: center;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }

  .score-label.visible {
    color: #7a869e;
  }

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
    min-height: 2px;
  }

  .bar-fill.empty {
    background: #15182a;
    border-radius: 3px;
    height: 3px !important;
    opacity: 0.5;
  }

  .bar-fill.level-high {
    background: linear-gradient(180deg, #ff6b6b 0%, #e03535 100%);
    box-shadow: 0 0 12px rgba(224, 53, 53, 0.35);
  }

  .bar-fill.level-medium {
    background: linear-gradient(180deg, #ffb347 0%, #e08020 100%);
    box-shadow: 0 0 10px rgba(224, 128, 32, 0.3);
  }

  .bar-fill.level-low {
    background: linear-gradient(180deg, #5b8dee 0%, #3a68d8 100%);
    box-shadow: 0 0 10px rgba(91, 141, 238, 0.25);
  }

  .bar-shine {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%);
    border-radius: 5px 5px 0 0;
  }

  /* Today highlight */
  .bar-col.today .bar-track {
    position: relative;
  }

  .bar-col.today .bar-track::before {
    content: '';
    position: absolute;
    inset: -4px 0 -28px;
    background: rgba(91, 141, 238, 0.04);
    border-radius: 6px;
    border: 1px solid rgba(91, 141, 238, 0.1);
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
    color: #3a4158;
    font-weight: 600;
  }

  .day-num {
    font-size: 12px;
    color: #4a5575;
    font-weight: 500;
  }

  .today-num {
    color: #5b8dee;
    font-weight: 700;
  }

  /* ── Tooltip ── */
  .tooltip {
    position: absolute;
    bottom: calc(100% + 4px);
    left: 50%;
    transform: translateX(-50%) translateY(0);
    background: #1a1e2e;
    border: 1px solid #252a3d;
    border-radius: 8px;
    padding: 8px 10px;
    font-size: 11px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.15s ease, transform 0.15s ease;
    z-index: 10;
    color: #c8cfe0;
    box-shadow: 0 8px 24px rgba(0,0,0,0.4);
  }

  .tooltip strong {
    display: block;
    font-size: 12px;
    color: #e4e9f5;
    margin-bottom: 5px;
  }

  .tt-rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .tt-high { color: #ff6b6b; }
  .tt-med  { color: #ffb347; }
  .tt-low  { color: #5b8dee; }

  /* ── Legend ── */
  .legend {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 18px;
    padding-top: 14px;
    border-top: 1px solid #181c2a;
    flex-wrap: wrap;
  }

  .leg-item {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: #4a5168;
    letter-spacing: 0.04em;
  }

  .leg-dot {
    width: 8px;
    height: 8px;
    border-radius: 2px;
    display: inline-block;
  }

  .leg-dot.high { background: #e03535; }
  .leg-dot.med  { background: #e08020; }
  .leg-dot.low  { background: #3a68d8; }

  .leg-note {
    margin-left: auto;
    font-size: 10px;
    color: #2a2f42;
    font-style: italic;
    letter-spacing: 0.03em;
  }
</style>