<script>
  import { tasks } from '$lib/components/tasks.js';

  const weekDayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let startHour = 8;
  let endHour = 20;
  const priorityColor = { high: '#ff4d4d', medium: '#ffd700', low: '#00ff87' };
  const priorityBorder = { high: '#ff4d4d', medium: '#ffd700', low: '#00ff87' };

  function makeHours(s, e) {
    const arr = [];
    for (let h = s; h <= e; h++) arr.push(`${String(h).padStart(2,'0')}:00`);
    return arr;
  }

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

  function taskAtHour(dateObj, hour) {
    function formatLocalDate(d) {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
        d.getDate()
      ).padStart(2, '0')}`;
    }

    function normalizeTime(t) {
      if (!t) return null;
      const s = String(t).trim();
      // handle formats like '1:00 PM' or '01:00PM'
      const ampmMatch = s.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM|am|pm)?/);
      if (!ampmMatch) return null;
      let hh = parseInt(ampmMatch[1], 10);
      const mm = ampmMatch[2] ? parseInt(ampmMatch[2], 10) : 0;
      const ampm = ampmMatch[3];
      if (ampm) {
        const isPM = /pm/i.test(ampm);
        if (isPM && hh < 12) hh += 12;
        if (!isPM && hh === 12) hh = 0;
      }
      return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    }

    function addHour(t) {
      if (!t) return null;
      const [hh, mm] = t.split(':').map(n => parseInt(n,10));
      const d = new Date();
      d.setHours(hh, mm, 0, 0);
      d.setHours(d.getHours() + 1);
      return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`;
    }

    const dateStr = formatLocalDate(dateObj);
    const targetHour = normalizeTime(hour); // e.g. '13:00'

    function timeToMinutes(tt) {
      if (!tt) return null;
      const [hh, mm] = tt.split(':').map(n => parseInt(n,10));
      return hh * 60 + mm;
    }

    const slotStart = timeToMinutes(targetHour);
    const slotEnd = slotStart + 60;

    return $tasks.find(t => {
      if (!t.dueDate) return false;
      const due = t.dueDate;
      const dueTime = normalizeTime(t.dueTime);
      const endTime = normalizeTime(t.endTime) || addHour(normalizeTime(t.dueTime));
      if (!dueTime) return false;
      if (due !== dateStr) return false;
      const dt = timeToMinutes(dueTime);
      const et = timeToMinutes(endTime);
      // check overlap: task interval [dt, et) intersects slot [slotStart, slotEnd)
      return dt < slotEnd && et > slotStart;
    });
  }

  $: hours = makeHours(startHour, endHour);

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
  <div style="display:flex;gap:12px;align-items:center;margin-bottom:10px;">
    <div style="color:rgba(255,255,255,0.7);font-weight:600">Time Range:</div>
    <div style="display:flex;gap:6px;align-items:center;">
      <label style="color:rgba(255,255,255,0.6)">Start</label>
      <input type="number" min="0" max="23" bind:value={startHour} style="width:70px;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.04);background:#0f0f0f;color:#fff" />
      <label style="color:rgba(255,255,255,0.6)">End</label>
      <input type="number" min="0" max="23" bind:value={endHour} style="width:70px;padding:6px;border-radius:6px;border:1px solid rgba(255,255,255,0.04);background:#0f0f0f;color:#fff" />
    </div>
  </div>

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
        {@const t = taskAtHour(day, hour)}
        <div class="week-cell">
          {#if t}
            <div
              class="week-task {t.completed ? 'week-task-done' : ''}"
              style="border-left: 4px solid {priorityBorder[t.priority]};"
            >
              {t.title}
            </div>
          {/if}
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
    align-items: center;
    justify-content: flex-end;
  }

  .week-cell {
    background-color: #0f0f0f;
    min-height: 48px;
    padding: 0.25rem;
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
    height: 100%;
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