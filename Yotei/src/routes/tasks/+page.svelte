<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';

  let activeView = $state('today');
  let tasks = $state([]);
  let loading = $state(true);
  let showPanel = $state(false);
  let editingTask = $state(null);

  let newTitle = $state('');
  let newDueDate = $state('');
  let newPriority = $state('medium');
  let formError = $state('');
  let submitting = $state(false);

  onMount(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) { goto('/login'); return; }
    await fetchTasks();
  });

  async function fetchTasks() {
    loading = true;
    const { data, error } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
    if (!error) tasks = data ?? [];
    loading = false;
  }

  async function createTask() {
    if (!newTitle.trim()) { formError = 'Title is required.'; return; }
    submitting = true;
    formError = '';
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from('tasks').insert({
      title: newTitle.trim(),
      due_date: newDueDate || null,
      priority: newPriority,
      user_id: session.user.id,
      is_complete: false,
    });
    submitting = false;
    if (error) { formError = error.message; return; }
    resetPanel();
    await fetchTasks();
  }

  async function updateTask() {
    if (!newTitle.trim()) { formError = 'Title is required.'; return; }
    submitting = true;
    formError = '';
    const { error } = await supabase.from('tasks').update({
      title: newTitle.trim(),
      due_date: newDueDate || null,
      priority: newPriority,
    }).eq('id', editingTask.id);
    submitting = false;
    if (error) { formError = error.message; return; }
    resetPanel();
    await fetchTasks();
  }

  async function toggleTask(task) {
    await supabase.from('tasks').update({ is_complete: !task.is_complete }).eq('id', task.id);
    tasks = tasks.map(t => t.id === task.id ? { ...t, is_complete: !t.is_complete } : t);
  }

  async function deleteTask(id) {
    await supabase.from('tasks').delete().eq('id', id);
    tasks = tasks.filter(t => t.id !== id);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    goto('/login');
  }

  function openNew() {
    editingTask = null;
    newTitle = ''; newDueDate = ''; newPriority = 'medium'; formError = '';
    showPanel = true;
  }

  function openEdit(task) {
    editingTask = task;
    newTitle = task.title;
    newDueDate = task.due_date ?? '';
    newPriority = task.priority ?? 'medium';
    formError = '';
    showPanel = true;
  }

  function resetPanel() {
    showPanel = false;
    editingTask = null;
    newTitle = ''; newDueDate = ''; newPriority = 'medium'; formError = '';
  }

  function todayStr() { return new Date().toISOString().split('T')[0]; }

  function weekDays() {
    const today = new Date(); today.setHours(0,0,0,0);
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today); d.setDate(today.getDate() + i);
      return d.toISOString().split('T')[0];
    });
  }

  function monthDays() {
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    return { firstDay: new Date(year, month, 1).getDay(), daysInMonth: new Date(year, month + 1, 0).getDate(), year, month };
  }

  function dayLabel(dateStr) {
    return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  }

  function monthName(m) {
    return ['January','February','March','April','May','June','July','August','September','October','November','December'][m];
  }

  function priorityColor(p) { return p === 'high' ? '#ff5555' : p === 'medium' ? '#ffb347' : '#00ff87'; }
  function priorityLabel(p) { return p === 'high' ? '↑ High' : p === 'medium' ? '→ Med' : '↓ Low'; }

  let todayTasks = $derived(tasks.filter(t => t.due_date === todayStr()));
  let overdueTasks = $derived(tasks.filter(t => t.due_date && t.due_date < todayStr() && !t.is_complete));
  let completedCount = $derived(tasks.filter(t => t.is_complete).length);
  let completionRate = $derived(tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0);
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet">
</svelte:head>

<div class="app">

  <!-- ── Sidebar ── -->
  <aside class="sidebar">
    <div class="sidebar-logo">
      <span class="logo-text">Yotei</span>
      <span class="logo-dot"></span>
    </div>
    <nav class="sidebar-nav">
      {#each [['today','Today','◈'],['weekly','Weekly','◫'],['monthly','Monthly','▦'],['progress','Progress','◉']] as [id, label, icon]}
        <button class="nav-item" class:active={activeView === id} onclick={() => activeView = id}>
          <span class="nav-icon">{icon}</span>
          <span>{label}</span>
        </button>
      {/each}
    </nav>
    <div class="sidebar-stats">
      <div class="stat"><span class="stat-num">{tasks.length}</span><span class="stat-label">Total</span></div>
      <div class="stat"><span class="stat-num">{completedCount}</span><span class="stat-label">Done</span></div>
      <div class="stat"><span class="stat-num">{overdueTasks.length}</span><span class="stat-label">Overdue</span></div>
    </div>
    <button class="logout-btn" onclick={handleLogout}>Sign out</button>
  </aside>

  <!-- ── Main ── -->
  <main class="main">
    <header class="topbar">
      <div class="topbar-left">
        <h1 class="view-title">
          {activeView === 'today' ? 'Today' : activeView === 'weekly' ? 'This Week' : activeView === 'monthly' ? 'Monthly' : 'Progress'}
        </h1>
        <span class="view-date">{new Date().toLocaleDateString('en-US', { weekday:'long', month:'long', day:'numeric' })}</span>
      </div>
      <button class="add-btn" onclick={openNew}><span>+</span> New Task</button>
    </header>

    <div class="content-area">

      <!-- ── TODAY ── -->
      {#if activeView === 'today'}
        <div class="view-content">
          {#if overdueTasks.length > 0}
            <section class="task-section">
              <h2 class="section-title overdue">⚠ Overdue <span class="count">{overdueTasks.length}</span></h2>
              {#each overdueTasks as task}{@render taskCard(task)}{/each}
            </section>
          {/if}
          <section class="task-section">
            <h2 class="section-title">Due Today <span class="count">{todayTasks.length}</span></h2>
            {#if loading}<div class="empty">Loading…</div>
            {:else if todayTasks.length === 0}<div class="empty">Nothing due today 🎉</div>
            {:else}{#each todayTasks as task}{@render taskCard(task)}{/each}{/if}
          </section>
          <section class="task-section">
            <h2 class="section-title">All Tasks <span class="count">{tasks.length}</span></h2>
            {#if tasks.length === 0}<div class="empty">No tasks yet — add one!</div>
            {:else}{#each tasks as task}{@render taskCard(task)}{/each}{/if}
          </section>
        </div>

      <!-- ── WEEKLY ── -->
      {:else if activeView === 'weekly'}
        <div class="view-content">
          <div class="weekly-grid">
            {#each weekDays() as day}
              {@const dayTasks = tasks.filter(t => t.due_date === day)}
              {@const isToday = day === todayStr()}
              <div class="day-column" class:today={isToday}>
                <div class="day-header">
                  <span class="day-name">{new Date(day+'T00:00:00').toLocaleDateString('en-US',{weekday:'short'})}</span>
                  <span class="day-num" class:today-num={isToday}>{new Date(day+'T00:00:00').getDate()}</span>
                </div>
                <div class="day-tasks">
                  {#if dayTasks.length === 0}<div class="day-empty">—</div>
                  {:else}
                    {#each dayTasks as task}
                      <div class="mini-task" class:done={task.is_complete}>
                        <button class="mini-check" onclick={() => toggleTask(task)}>{task.is_complete ? '✓' : ''}</button>
                        <span class="mini-title">{task.title}</span>
                        <span class="mini-priority" style="color:{priorityColor(task.priority)}">●</span>
                      </div>
                    {/each}
                  {/if}
                </div>
              </div>
            {/each}
          </div>
        </div>

      <!-- ── MONTHLY ── -->
      {:else if activeView === 'monthly'}
        <div class="view-content">
          {#if true}
            {@const { firstDay, daysInMonth, year, month } = monthDays()}
            <h2 class="month-title">{monthName(month)} {year}</h2>
            <div class="calendar">
              {#each ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'] as d}
                <div class="cal-header">{d}</div>
              {/each}
              {#each Array(firstDay) as _}<div class="cal-cell empty"></div>{/each}
              {#each Array(daysInMonth) as _, i}
                {@const dayNum = i + 1}
                {@const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(dayNum).padStart(2,'0')}`}
                {@const dayTasks = tasks.filter(t => t.due_date === dateStr)}
                {@const isToday = dateStr === todayStr()}
                <div class="cal-cell" class:cal-today={isToday} class:has-tasks={dayTasks.length > 0}>
                  <span class="cal-num">{dayNum}</span>
                  <div class="cal-dots">
                    {#each dayTasks.slice(0,3) as task}
                      <span class="cal-dot" style="background:{priorityColor(task.priority)}"></span>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          {/if}
        </div>

      <!-- ── PROGRESS ── -->
      {:else if activeView === 'progress'}
        <div class="view-content">
          <div class="progress-grid">
            <div class="progress-card big">
              <span class="prog-label">Completion Rate</span>
              <div class="ring-wrap">
                <svg viewBox="0 0 120 120" class="ring">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="12"/>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#00ff87" stroke-width="12"
                    stroke-dasharray="{314 * completionRate / 100} 314"
                    stroke-linecap="round" transform="rotate(-90 60 60)"/>
                </svg>
                <span class="ring-num">{completionRate}%</span>
              </div>
            </div>
            <div class="progress-card"><span class="prog-label">Total</span><span class="prog-big">{tasks.length}</span></div>
            <div class="progress-card"><span class="prog-label">Completed</span><span class="prog-big" style="color:#00ff87">{completedCount}</span></div>
            <div class="progress-card"><span class="prog-label">Remaining</span><span class="prog-big" style="color:#ffb347">{tasks.length - completedCount}</span></div>
            <div class="progress-card"><span class="prog-label">Overdue</span><span class="prog-big" style="color:#ff5555">{overdueTasks.length}</span></div>
          </div>
          <h2 class="section-title" style="margin-top:2rem">By Priority</h2>
          {#each [['high','High Priority'],['medium','Medium Priority'],['low','Low Priority']] as [p, label]}
            {@const count = tasks.filter(t => t.priority === p).length}
            {@const done = tasks.filter(t => t.priority === p && t.is_complete).length}
            <div class="priority-bar-row">
              <span class="pbar-label" style="color:{priorityColor(p)}">{label}</span>
              <div class="pbar-track"><div class="pbar-fill" style="width:{count ? (done/count*100) : 0}%; background:{priorityColor(p)}"></div></div>
              <span class="pbar-num">{done}/{count}</span>
            </div>
          {/each}
        </div>
      {/if}

      <!-- ── SLIDE-IN PANEL ── -->
      {#if showPanel}
        <div class="panel-backdrop" onclick={resetPanel}></div>
        <div class="panel">
          <div class="panel-header">
            <h2>{editingTask ? 'Edit Task' : 'New Task'}</h2>
            <button class="panel-close" onclick={resetPanel}>✕</button>
          </div>
          <div class="panel-body">
            <label class="field-label">Title *</label>
            <input
              class="field-input"
              type="text"
              placeholder="What needs to be done?"
              bind:value={newTitle}
              onkeydown={(e) => e.key === 'Enter' && (editingTask ? updateTask() : createTask())}
            />

            <label class="field-label">Due Date</label>
            <input class="field-input" type="date" bind:value={newDueDate} />

            <label class="field-label">Priority</label>
            <select class="field-input" bind:value={newPriority}>
              <option value="low">↓ Low</option>
              <option value="medium">→ Medium</option>
              <option value="high">↑ High</option>
            </select>

            {#if formError}
              <p class="form-error">⚠ {formError}</p>
            {/if}

            <div class="panel-actions">
              <button class="btn-cancel" onclick={resetPanel}>Cancel</button>
              <button class="btn-submit" onclick={editingTask ? updateTask : createTask} disabled={submitting}>
                {submitting ? 'Saving…' : editingTask ? 'Save Changes' : 'Add Task'}
              </button>
            </div>
          </div>
        </div>
      {/if}

    </div>
  </main>
</div>

<!-- ── TASK CARD SNIPPET ── -->
{#snippet taskCard(task)}
  <div class="task-card" class:completed={task.is_complete}>
    <button class="check-btn" onclick={() => toggleTask(task)} class:checked={task.is_complete}>
      {#if task.is_complete}✓{/if}
    </button>
    <div class="task-body">
      <span class="task-title" class:done-title={task.is_complete}>{task.title}</span>
      <div class="task-meta">
        {#if task.due_date}<span class="meta-chip">📅 {dayLabel(task.due_date)}</span>{/if}
        <span class="meta-chip priority-chip" style="color:{priorityColor(task.priority)};border-color:{priorityColor(task.priority)}40">
          {priorityLabel(task.priority)}
        </span>
      </div>
    </div>
    <div class="task-actions">
      <button class="action-btn edit" onclick={() => openEdit(task)}>✎</button>
      <button class="action-btn del" onclick={() => deleteTask(task.id)}>✕</button>
    </div>
  </div>
{/snippet}

<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }

  :global(html, body) {
    background: #080808;
    color: #e8e8e8;
    font-family: 'Syne', sans-serif;
    height: 100%;
    overflow: hidden;
  }

  .app { display: flex; height: 100vh; background: #080808; }

  /* ── Sidebar ── */
  .sidebar {
    width: 220px; min-width: 220px;
    background: #0e0e0e;
    border-right: 1px solid rgba(255,255,255,0.06);
    display: flex; flex-direction: column;
    padding: 2rem 1.2rem; gap: 2rem;
  }
  .sidebar-logo { display: flex; align-items: center; gap: 8px; padding-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .logo-text { font-size: 1.4rem; font-weight: 800; letter-spacing: -0.5px; color: #fff; }
  .logo-dot { width: 8px; height: 8px; border-radius: 50%; background: #00ff87; box-shadow: 0 0 8px #00ff87; }
  .sidebar-nav { display: flex; flex-direction: column; gap: 4px; flex: 1; }
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 10px 12px; border-radius: 10px; border: none;
    background: transparent; color: rgba(255,255,255,0.4);
    font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 600;
    cursor: pointer; transition: all 0.15s; text-align: left;
  }
  .nav-item:hover { background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8); }
  .nav-item.active { background: rgba(0,255,135,0.1); color: #00ff87; }
  .nav-icon { font-size: 1rem; width: 20px; text-align: center; }
  .sidebar-stats { display: flex; justify-content: space-between; padding: 1rem 0; border-top: 1px solid rgba(255,255,255,0.06); border-bottom: 1px solid rgba(255,255,255,0.06); }
  .stat { display: flex; flex-direction: column; align-items: center; gap: 2px; }
  .stat-num { font-family: 'DM Mono', monospace; font-size: 1.2rem; font-weight: 500; color: #fff; }
  .stat-label { font-size: 0.65rem; color: rgba(255,255,255,0.35); text-transform: uppercase; letter-spacing: 0.05em; }
  .logout-btn {
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.35); border-radius: 8px; padding: 8px;
    font-family: 'Syne', sans-serif; font-size: 0.8rem; cursor: pointer; transition: all 0.15s;
  }
  .logout-btn:hover { border-color: #ff5555; color: #ff5555; }

  /* ── Main ── */
  .main { flex: 1; display: flex; flex-direction: column; overflow: hidden; }
  .topbar {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.8rem 2.5rem 1.2rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .topbar-left { display: flex; flex-direction: column; gap: 2px; }
  .view-title { font-size: 1.8rem; font-weight: 800; letter-spacing: -0.5px; color: #fff; }
  .view-date { font-size: 0.78rem; color: rgba(255,255,255,0.35); font-family: 'DM Mono', monospace; }
  .add-btn {
    display: flex; align-items: center; gap: 8px;
    background: #00ff87; color: #000; border: none; border-radius: 10px;
    padding: 10px 20px; font-family: 'Syne', sans-serif; font-size: 0.9rem; font-weight: 700;
    cursor: pointer; transition: all 0.15s;
  }
  .add-btn:hover { background: #00e87a; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(0,255,135,0.3); }
  .add-btn span { font-size: 1.2rem; line-height: 1; }

  /* ── Content area: view + panel side by side ── */
  .content-area { flex: 1; display: flex; overflow: hidden; position: relative; }

  .view-content {
    flex: 1; overflow-y: auto; padding: 2rem 2.5rem;
    scrollbar-width: thin; scrollbar-color: rgba(0,255,135,0.2) transparent;
  }

  /* ── Task Sections ── */
  .task-section { margin-bottom: 2.5rem; }
  .section-title {
    font-size: 0.75rem; font-weight: 700; text-transform: uppercase;
    letter-spacing: 0.1em; color: rgba(255,255,255,0.35);
    margin-bottom: 1rem; display: flex; align-items: center; gap: 8px;
  }
  .section-title.overdue { color: #ff5555; }
  .count { background: rgba(255,255,255,0.08); border-radius: 20px; padding: 2px 8px; font-size: 0.7rem; color: rgba(255,255,255,0.5); }
  .empty { color: rgba(255,255,255,0.2); font-size: 0.9rem; padding: 2rem 0; text-align: center; font-family: 'DM Mono', monospace; }

  /* ── Task Card ── */
  .task-card {
    display: flex; align-items: center; gap: 14px;
    background: #111; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 14px 16px; margin-bottom: 8px; transition: all 0.15s;
  }
  .task-card:hover { border-color: rgba(255,255,255,0.15); background: #141414; }
  .task-card.completed { opacity: 0.5; }
  .check-btn {
    width: 22px; height: 22px; min-width: 22px; border-radius: 6px;
    border: 1.5px solid rgba(255,255,255,0.2); background: transparent;
    color: #00ff87; font-size: 0.75rem; cursor: pointer;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .check-btn.checked { background: #00ff87; border-color: #00ff87; color: #000; font-weight: 700; }
  .check-btn:hover { border-color: #00ff87; }
  .task-body { flex: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0; }
  .task-title { font-size: 0.95rem; font-weight: 600; color: #fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .task-title.done-title { text-decoration: line-through; color: rgba(255,255,255,0.3); }
  .task-meta { display: flex; gap: 6px; flex-wrap: wrap; }
  .meta-chip {
    font-size: 0.7rem; font-family: 'DM Mono', monospace;
    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
    border-radius: 6px; padding: 2px 7px; color: rgba(255,255,255,0.5);
  }
  .task-actions { display: flex; gap: 6px; opacity: 0; transition: opacity 0.15s; }
  .task-card:hover .task-actions { opacity: 1; }
  .action-btn {
    width: 28px; height: 28px; border-radius: 7px;
    border: 1px solid rgba(255,255,255,0.1); background: transparent;
    color: rgba(255,255,255,0.4); cursor: pointer; font-size: 0.8rem;
    display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .action-btn.edit:hover { border-color: #00ff87; color: #00ff87; }
  .action-btn.del:hover { border-color: #ff5555; color: #ff5555; }

  /* ── Weekly ── */
  .weekly-grid { display: grid; grid-template-columns: repeat(7, 1fr); gap: 10px; }
  .day-column {
    background: #111; border: 1px solid rgba(255,255,255,0.07);
    border-radius: 12px; padding: 12px 10px;
    display: flex; flex-direction: column; gap: 8px; min-height: 400px;
  }
  .day-column.today { border-color: rgba(0,255,135,0.3); background: rgba(0,255,135,0.04); }
  .day-header { display: flex; flex-direction: column; align-items: center; gap: 4px; padding-bottom: 8px; border-bottom: 1px solid rgba(255,255,255,0.06); }
  .day-name { font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.35); font-weight: 700; }
  .day-num { font-family: 'DM Mono', monospace; font-size: 1.1rem; color: rgba(255,255,255,0.6); }
  .day-num.today-num { color: #00ff87; }
  .day-tasks { display: flex; flex-direction: column; gap: 4px; }
  .day-empty { text-align: center; color: rgba(255,255,255,0.1); font-size: 0.8rem; margin-top: 1rem; }
  .mini-task { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.04); border-radius: 6px; padding: 6px 8px; }
  .mini-task.done { opacity: 0.4; }
  .mini-check { width: 16px; height: 16px; min-width: 16px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.2); background: transparent; color: #00ff87; font-size: 0.6rem; cursor: pointer; display: flex; align-items: center; justify-content: center; }
  .mini-title { font-size: 0.72rem; flex: 1; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; color: rgba(255,255,255,0.7); }
  .mini-priority { font-size: 0.5rem; }

  /* ── Monthly ── */
  .month-title { font-size: 1.2rem; font-weight: 700; margin-bottom: 1.5rem; color: #fff; }
  .calendar { display: grid; grid-template-columns: repeat(7, 1fr); gap: 6px; }
  .cal-header { text-align: center; font-size: 0.65rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.25); padding: 8px 0; }
  .cal-cell { background: #111; border: 1px solid rgba(255,255,255,0.06); border-radius: 8px; padding: 8px; min-height: 70px; display: flex; flex-direction: column; gap: 4px; }
  .cal-cell.empty { background: transparent; border-color: transparent; }
  .cal-cell.cal-today { border-color: rgba(0,255,135,0.4); background: rgba(0,255,135,0.05); }
  .cal-cell.has-tasks { border-color: rgba(255,255,255,0.12); }
  .cal-num { font-family: 'DM Mono', monospace; font-size: 0.8rem; color: rgba(255,255,255,0.5); }
  .cal-today .cal-num { color: #00ff87; font-weight: 700; }
  .cal-dots { display: flex; gap: 3px; flex-wrap: wrap; margin-top: auto; }
  .cal-dot { width: 6px; height: 6px; border-radius: 50%; }

  /* ── Progress ── */
  .progress-grid { display: grid; grid-template-columns: 1fr 1fr 1fr 1fr; gap: 12px; }
  .progress-card { background: #111; border: 1px solid rgba(255,255,255,0.07); border-radius: 14px; padding: 1.5rem; display: flex; flex-direction: column; gap: 8px; }
  .progress-card.big { grid-row: span 2; align-items: center; justify-content: center; }
  .prog-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.3); font-weight: 700; }
  .prog-big { font-family: 'DM Mono', monospace; font-size: 2.5rem; font-weight: 500; color: #fff; }
  .ring-wrap { position: relative; width: 120px; height: 120px; display: flex; align-items: center; justify-content: center; }
  .ring { width: 120px; height: 120px; }
  .ring-num { position: absolute; font-family: 'DM Mono', monospace; font-size: 1.4rem; color: #fff; }
  .priority-bar-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
  .pbar-label { font-size: 0.8rem; font-weight: 600; width: 110px; }
  .pbar-track { flex: 1; height: 6px; background: rgba(255,255,255,0.07); border-radius: 99px; overflow: hidden; }
  .pbar-fill { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
  .pbar-num { font-family: 'DM Mono', monospace; font-size: 0.75rem; color: rgba(255,255,255,0.4); width: 40px; text-align: right; }

  /* ── Slide-in Panel ── */
  .panel-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 10;
  }
  .panel {
    position: absolute;
    top: 0; right: 0; bottom: 0;
    width: 380px;
    background: #0e0e0e;
    border-left: 1px solid rgba(255,255,255,0.1);
    display: flex; flex-direction: column;
    z-index: 20;
    animation: slideIn 0.2s ease;
  }
  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }
  .panel-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 1.4rem 1.6rem;
    border-bottom: 1px solid rgba(255,255,255,0.06);
    flex-shrink: 0;
  }
  .panel-header h2 { font-size: 1.1rem; font-weight: 700; color: #fff; }
  .panel-close {
    background: transparent; border: none; color: rgba(255,255,255,0.4);
    font-size: 1rem; cursor: pointer; width: 28px; height: 28px;
    border-radius: 6px; display: flex; align-items: center; justify-content: center; transition: all 0.15s;
  }
  .panel-close:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .panel-body { padding: 1.6rem; display: flex; flex-direction: column; gap: 14px; overflow-y: auto; flex: 1; }
  .field-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: rgba(255,255,255,0.4); }
  .field-input {
    width: 100%; background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
    padding: 10px 12px; color: #fff; font-family: 'Syne', sans-serif;
    font-size: 0.9rem; outline: none; transition: border-color 0.15s; margin-top: 4px;
  }
  .field-input:focus { border-color: rgba(0,255,135,0.5); }
  .field-input option { background: #111; }
  .form-error { font-size: 0.8rem; color: #ff5555; background: rgba(255,85,85,0.08); border: 1px solid rgba(255,85,85,0.2); border-radius: 8px; padding: 8px 12px; }
  .panel-actions { display: flex; gap: 10px; justify-content: flex-end; margin-top: 4px; }
  .btn-cancel {
    background: transparent; border: 1px solid rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.5); border-radius: 8px; padding: 10px 20px;
    font-family: 'Syne', sans-serif; font-size: 0.9rem; cursor: pointer; transition: all 0.15s;
  }
  .btn-cancel:hover { border-color: rgba(255,255,255,0.3); color: #fff; }
  .btn-submit {
    background: #00ff87; border: none; color: #000; border-radius: 8px;
    padding: 10px 24px; font-family: 'Syne', sans-serif; font-size: 0.9rem;
    font-weight: 700; cursor: pointer; transition: all 0.15s;
  }
  .btn-submit:hover:not(:disabled) { background: #00e87a; }
  .btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
</style>

<div class="layout">
  <TaskSidebar bind:activeView />

  <div class="main">
    <div class="view" class:active={activeView === 'today'}>
      <TodayView />
    </div>
    <div class="view" class:active={activeView === 'weekly'}>
      <WeeklyView />
    </div>
    <div class="view" class:active={activeView === 'monthly'}>
      <MonthlyView />
    </div>
    <div class="view" class:active={activeView === 'progress'}>
      <ProgressView />
<<<<<<< HEAD
    {:else if activeView === 'workload'}
      <WorkLoad />
    {/if}
=======
    </div>
>>>>>>> a10602d7aead499f2db52c1bf02bd61ec7217d31
  </div>
</div>

<AddTask />