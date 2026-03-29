<script>
  import { addTask } from '$lib/components/tasks.js';

  let showModal = false;

  let title = '';
  let details = '';
  let priority = 'low';
  let dueDate = '';
  let dueTime = '';
  let endTime = '';
  let dueDateInput;
  let dueTimeInput;
  let endTimeInput;

  function handleSubmit() {
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      details: details.trim(),
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
      endTime: endTime || null,
    });

    title = '';
    details = '';
    priority = 'low';
    dueDate = '';
    dueTime = '';
    showModal = false;
  }
</script>

<!-- Backdrop -->
{#if showModal}
  <div class="modal-backdrop" on:click={() => (showModal = false)}></div>
  <div class="modal-root">
    <div class="modal-card">
      <div class="modal-header">
        <div class="modal-title">Create a Task</div>
        <button class="close-btn" on:click={() => (showModal = false)}>✕</button>
      </div>

      <div class="modal-body">
        <label class="label">Title <span class="required">*</span></label>
        <input class="input" bind:value={title} placeholder="Task title" />

        <label class="label">Details</label>
        <textarea class="input" bind:value={details} placeholder="Task details" rows="3"></textarea>

        <label class="label">Priority</label>
        <select class="input" bind:value={priority}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <div style="display:flex;gap:8px;align-items:center;margin-top:8px;">
          <div style="display:flex;gap:8px;align-items:center;margin-right:6px;">
            <button class="quick-btn" type="button" on:click={() => dueDateInput && dueDateInput.focus()} title="Pick a date">📅 Date</button>
            <button class="quick-btn" type="button" on:click={() => dueTimeInput && dueTimeInput.focus()} title="Start time">🕒 Start</button>
            <button class="quick-btn" type="button" on:click={() => endTimeInput && endTimeInput.focus()} title="End time">⏱️ End</button>
          </div>
          <div style="flex:1;">
            <label class="label">Due Date</label>
            <input class="input" type="date" bind:value={dueDate} bind:this={dueDateInput} />
          </div>
          <div style="flex:1;">
            <label class="label">Start Time</label>
            <input class="input" type="time" bind:value={dueTime} bind:this={dueTimeInput} />
          </div>
          <div style="flex:1;">
            <label class="label">End Time</label>
            <input class="input" type="time" bind:value={endTime} bind:this={endTimeInput} />
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn secondary" on:click={() => (showModal = false)}>Cancel</button>
        <button class="btn primary" on:click={handleSubmit}>Add Task</button>
      </div>
    </div>
  </div>
{/if}

<!-- Floating + Button -->
<button
  on:click={() => (showModal = true)}
  style="
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #0d6efd;
    color: white;
    font-size: 2rem;
    font-weight: 300;
    border: none;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
    padding: 0;
  "
>
  +
</button>

<style>
  .modal-backdrop { position: fixed; inset:0; background: rgba(0,0,0,0.5); z-index: 1000; }
  .modal-root { position: fixed; inset:0; display:flex; align-items:center; justify-content:center; padding:1rem; z-index: 1001; pointer-events: none; }
  .modal-card { position: relative; z-index: 1002; pointer-events: auto; width:760px; max-width:95%; background:#0d0d0d; border:1px solid rgba(0,255,135,0.08); border-radius:12px; box-shadow:0 10px 30px rgba(0,0,0,0.6); overflow:hidden; }
  .modal-header { display:flex; justify-content:space-between; align-items:center; padding:1rem 1rem; border-bottom:1px solid rgba(255,255,255,0.03); }
  .modal-title { font-weight:700; background:linear-gradient(90deg,#00ff87,#60efff); -webkit-background-clip:text; -webkit-text-fill-color:transparent; }
  .close-btn { background:none;border:none;color:rgba(255,255,255,0.6);cursor:pointer;font-size:1.1rem }
  .modal-body { padding:1rem; display:flex; flex-direction:column; gap:0.5rem }
  .label { font-size:0.8rem; color:rgba(255,255,255,0.6); margin-bottom:0.25rem }
  .required { color:#ff4d4d }
  .input { width:100%; background:#111; border:1px solid rgba(255,255,255,0.04); color:rgba(255,255,255,0.9); padding:0.5rem; border-radius:8px }
  .modal-footer { display:flex; justify-content:flex-end; gap:0.5rem; padding:0.75rem 1rem; border-top:1px solid rgba(255,255,255,0.03) }
  .btn { padding:0.5rem 0.9rem; border-radius:8px; cursor:pointer; border:1px solid rgba(255,255,255,0.06) }
  .btn.primary { background:linear-gradient(90deg,#00a86b,#00b4ff); color:#001; font-weight:700 }
  .btn.secondary { background:transparent; color:rgba(255,255,255,0.8) }

  .quick-btn {
    background: linear-gradient(90deg,#00ff87,#60efff);
    color: #001;
    border: none;
    padding: 0.35rem 0.6rem;
    border-radius: 8px;
    font-weight: 700;
    cursor: pointer;
    box-shadow: 0 6px 14px rgba(0,255,135,0.12);
  }
  .quick-btn:hover { transform: translateY(-1px); }
</style>