<script>
  import { tasks } from '$lib/components/tasks.js';

  function isToday(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const d = new Date(dateStr + 'T00:00:00');
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth() &&
           d.getDate() === today.getDate();
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

  function isThisMonth(dateStr) {
    if (!dateStr) return false;
    const today = new Date();
    const d = new Date(dateStr + 'T00:00:00');
    return d.getFullYear() === today.getFullYear() &&
           d.getMonth() === today.getMonth();
  }

  function percent(completed, total) {
    if (!total) return 0;
    return Math.round((completed / total) * 100);
  }

  $: todayAll   = $tasks.filter(t => isToday(t.dueDate));
  $: todayDone  = todayAll.filter(t => t.completed).length;
  $: todayPct   = percent(todayDone, todayAll.length);

  $: weekAll    = $tasks.filter(t => isThisWeek(t.dueDate));
  $: weekDone   = weekAll.filter(t => t.completed).length;
  $: weekPct    = percent(weekDone, weekAll.length);

  $: monthAll   = $tasks.filter(t => isThisMonth(t.dueDate));
  $: monthDone  = monthAll.filter(t => t.completed).length;
  $: monthPct   = percent(monthDone, monthAll.length);

  $: totalDone  = $tasks.filter(t => t.completed).length;

  $: level = totalDone >= 21 ? 5
           : totalDone >= 13 ? 4
           : totalDone >= 7  ? 3
           : totalDone >= 3  ? 2
           : 1;

  const levelNames  = ['', 'Egg', 'Hatching', 'Baby Dino', 'Teen Dino', 'Dino King'];
  const nextLevelAt = [3, 3, 7, 13, 21, null];
</script>

<div class="view-title">Progress</div>

<!-- Dino -->
<div class="dino-section">
  <div class="dino-wrap">
    {#if level === 1}
      <svg width="100" height="120" viewBox="0 0 100 120">
        <ellipse cx="50" cy="70" rx="35" ry="45" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M30 60 Q35 55 40 60" fill="none" stroke="#00ff87" stroke-width="2"/>
        <path d="M55 50 Q62 44 68 52" fill="none" stroke="#00ff87" stroke-width="2"/>
        <path d="M35 75 Q50 85 65 75" fill="none" stroke="#00ff87" stroke-width="2"/>
      </svg>

    {:else if level === 2}
      <svg width="100" height="120" viewBox="0 0 100 120">
        <ellipse cx="50" cy="70" rx="35" ry="45" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M45 30 L50 45 L42 55 L52 70" fill="none" stroke="#60efff" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M55 35 L58 50 L52 58" fill="none" stroke="#60efff" stroke-width="2" stroke-linecap="round"/>
        <circle cx="44" cy="52" r="3" fill="none" stroke="#00ff87" stroke-width="2"/>
        <circle cx="56" cy="48" r="3" fill="none" stroke="#00ff87" stroke-width="2"/>
        <circle cx="45" cy="52" r="1" fill="#00ff87"/>
        <circle cx="57" cy="48" r="1" fill="#00ff87"/>
      </svg>

    {:else if level === 3}
      <svg width="120" height="130" viewBox="0 0 120 130">
        <ellipse cx="60" cy="85" rx="32" ry="28" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <ellipse cx="60" cy="48" rx="22" ry="20" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M48 65 Q50 70 50 75" fill="none" stroke="#00ff87" stroke-width="2.5"/>
        <path d="M72 65 Q70 70 70 75" fill="none" stroke="#00ff87" stroke-width="2.5"/>
        <circle cx="52" cy="44" r="4" fill="none" stroke="#00ff87" stroke-width="2"/>
        <circle cx="68" cy="44" r="4" fill="none" stroke="#00ff87" stroke-width="2"/>
        <circle cx="53" cy="44" r="1.5" fill="#00ff87"/>
        <circle cx="69" cy="44" r="1.5" fill="#00ff87"/>
        <path d="M52 56 Q60 62 68 56" fill="none" stroke="#00ff87" stroke-width="2" stroke-linecap="round"/>
        <path d="M30 82 Q22 78 20 85" fill="none" stroke="#00ff87" stroke-width="2" stroke-linecap="round"/>
        <path d="M90 82 Q98 78 100 85" fill="none" stroke="#00ff87" stroke-width="2" stroke-linecap="round"/>
        <path d="M48 110 Q45 118 40 120" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M72 110 Q75 118 80 120" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M28 90 Q15 95 10 105 Q8 112 15 110" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
      </svg>

    {:else if level === 4}
      <svg width="130" height="150" viewBox="0 0 130 150">
        <ellipse cx="65" cy="100" rx="36" ry="32" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <ellipse cx="65" cy="52" rx="26" ry="24" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M52 73 Q54 80 54 88" fill="none" stroke="#00ff87" stroke-width="2.5"/>
        <path d="M78 73 Q76 80 76 88" fill="none" stroke="#00ff87" stroke-width="2.5"/>
        <circle cx="55" cy="47" r="5" fill="none" stroke="#00ff87" stroke-width="2"/>
        <circle cx="75" cy="47" r="5" fill="none" stroke="#00ff87" stroke-width="2"/>
        <circle cx="56" cy="47" r="2" fill="#00ff87"/>
        <circle cx="76" cy="47" r="2" fill="#00ff87"/>
        <path d="M50 41 L60 43" fill="none" stroke="#00ff87" stroke-width="2" stroke-linecap="round"/>
        <path d="M70 43 L80 41" fill="none" stroke="#00ff87" stroke-width="2" stroke-linecap="round"/>
        <path d="M54 64 Q65 70 76 64" fill="none" stroke="#00ff87" stroke-width="2" stroke-linecap="round"/>
        <path d="M65 70 L60 58 L65 62 L70 50 L72 62 L78 56 L76 68" fill="none" stroke="#60efff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M30 96 Q20 90 16 98 Q20 102 26 100" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M100 96 Q110 90 114 98 Q110 102 104 100" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M50 128 Q46 138 38 142 Q42 144 50 140" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M80 128 Q84 138 92 142 Q88 144 80 140" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M30 106 Q14 112 8 124 Q6 132 14 128 Q10 136 18 134" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
      </svg>

    {:else}
      <svg width="150" height="170" viewBox="0 0 150 170">
        <ellipse cx="75" cy="115" rx="42" ry="38" fill="none" stroke="#00ff87" stroke-width="3" stroke-linecap="round"/>
        <ellipse cx="75" cy="58" rx="32" ry="30" fill="none" stroke="#00ff87" stroke-width="3" stroke-linecap="round"/>
        <path d="M58 85 Q60 95 60 105" fill="none" stroke="#00ff87" stroke-width="3"/>
        <path d="M92 85 Q90 95 90 105" fill="none" stroke="#00ff87" stroke-width="3"/>
        <circle cx="62" cy="52" r="6" fill="none" stroke="#00ff87" stroke-width="2.5"/>
        <circle cx="88" cy="52" r="6" fill="none" stroke="#00ff87" stroke-width="2.5"/>
        <circle cx="63" cy="52" r="2.5" fill="#00ff87"/>
        <circle cx="89" cy="52" r="2.5" fill="#00ff87"/>
        <path d="M48 32 L52 18 L62 28 L75 14 L88 28 L98 18 L102 32 Z" fill="none" stroke="#60efff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <circle cx="62" cy="26" r="3" fill="none" stroke="#60efff" stroke-width="2"/>
        <circle cx="75" cy="20" r="3" fill="none" stroke="#60efff" stroke-width="2"/>
        <circle cx="88" cy="26" r="3" fill="none" stroke="#60efff" stroke-width="2"/>
        <path d="M58 72 Q75 82 92 72" fill="none" stroke="#00ff87" stroke-width="2.5" stroke-linecap="round"/>
        <path d="M64 72 L66 78" fill="none" stroke="#00ff87" stroke-width="1.5"/>
        <path d="M72 74 L74 80" fill="none" stroke="#00ff87" stroke-width="1.5"/>
        <path d="M80 74 L82 80" fill="none" stroke="#00ff87" stroke-width="1.5"/>
        <path d="M75 82 L68 65 L74 72 L75 55 L76 72 L82 65 L75 82" fill="none" stroke="#60efff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M34 110 Q20 102 15 112 Q20 118 28 115 Q24 120 30 120" fill="none" stroke="#00ff87" stroke-width="3" stroke-linecap="round"/>
        <path d="M116 110 Q130 102 135 112 Q130 118 122 115 Q126 120 120 120" fill="none" stroke="#00ff87" stroke-width="3" stroke-linecap="round"/>
        <path d="M58 148 Q52 158 42 163 Q48 166 58 160 Q54 165 60 166" fill="none" stroke="#00ff87" stroke-width="3" stroke-linecap="round"/>
        <path d="M92 148 Q98 158 108 163 Q102 166 92 160 Q96 165 90 166" fill="none" stroke="#00ff87" stroke-width="3" stroke-linecap="round"/>
        <path d="M34 120 Q16 128 8 142 Q4 152 14 148 Q8 156 18 153 Q12 162 22 158" fill="none" stroke="#00ff87" stroke-width="3" stroke-linecap="round"/>
      </svg>
    {/if}
  </div>

  <div class="dino-info">
    <div class="level-label">Level {level} — {levelNames[level]}</div>
    <div class="tasks-done">{totalDone} tasks completed</div>
    {#if level < 5}
      <div class="next-level">{nextLevelAt[level] - totalDone} more to reach level {level + 1}</div>
    {:else}
      <div class="next-level" style="color: #60efff;">Max level reached!</div>
    {/if}
  </div>
</div>

<!-- Progress Bars -->
<div class="progress-section">

  <div class="progress-block">
    <div class="progress-label">
      <span>Today</span>
      <span>{todayDone} / {todayAll.length} completed</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width: {todayPct}%;"></div>
    </div>
    <div class="progress-pct">{todayPct}%</div>
  </div>

  <div class="progress-block">
    <div class="progress-label">
      <span>This Week</span>
      <span>{weekDone} / {weekAll.length} completed</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width: {weekPct}%;"></div>
    </div>
    <div class="progress-pct">{weekPct}%</div>
  </div>

  <div class="progress-block">
    <div class="progress-label">
      <span>This Month</span>
      <span>{monthDone} / {monthAll.length} completed</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" style="width: {monthPct}%;"></div>
    </div>
    <div class="progress-pct">{monthPct}%</div>
  </div>

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

  .dino-section {
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #111111;
    border: 1px solid rgba(0, 255, 135, 0.15);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .dino-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 160px;
    filter: drop-shadow(0 0 12px rgba(0, 255, 135, 0.3));
  }

  .dino-info { display: flex; flex-direction: column; gap: 0.4rem; }

  .level-label { font-size: 1.4rem; font-weight: 700; color: #00ff87; }
  .tasks-done { font-size: 0.9rem; color: rgba(255,255,255,0.5); }
  .next-level { font-size: 0.85rem; color: rgba(0, 255, 135, 0.6); margin-top: 0.25rem; }

  .progress-section { display: flex; flex-direction: column; gap: 1.25rem; }

  .progress-block {
    background-color: #111111;
    border: 1px solid rgba(0, 255, 135, 0.12);
    border-radius: 12px;
    padding: 1.25rem 1.5rem;
  }

  .progress-label {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: rgba(255,255,255,0.6);
    margin-bottom: 0.6rem;
  }

  .progress-track {
    height: 10px;
    background-color: rgba(255,255,255,0.07);
    border-radius: 99px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #00ff87, #60efff);
    border-radius: 99px;
    transition: width 0.5s ease;
  }

  .progress-pct {
    font-size: 0.75rem;
    color: rgba(0, 255, 135, 0.6);
    margin-top: 0.4rem;
    text-align: right;
  }
</style>