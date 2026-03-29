<script>
  import { addTask } from '$lib/components/tasks.js';

  let showModal = false;

  let title = '';
  let details = '';
  let priority = 'low';
  let dueDate = '';
  let dueTime = '';

  function handleSubmit() {
    if (!title.trim()) return;

    addTask({
      title: title.trim(),
      details: details.trim(),
      priority,
      dueDate: dueDate || null,
      dueTime: dueTime || null,
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
  <div class="modal-backdrop fade show" on:click={() => (showModal = false)}></div>
{/if}

<!-- Modal -->
{#if showModal}
  <div class="modal fade show d-block" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">

        <div class="modal-header">
          <h5 class="modal-title">Create a Task</h5>
          <button type="button" class="btn-close" on:click={() => (showModal = false)}></button>
        </div>

        <div class="modal-body">
          <div class="mb-3">
            <label class="form-label">Title <span class="text-danger">*</span></label>
            <input class="form-control" bind:value={title} placeholder="Task title" />
          </div>

          <div class="mb-3">
            <label class="form-label">Details</label>
            <textarea class="form-control" bind:value={details} placeholder="Task details" rows="3"></textarea>
          </div>

          <div class="mb-3">
            <label class="form-label">Priority</label>
            <select class="form-select" bind:value={priority}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div class="mb-3">
            <label class="form-label">Due Date</label>
            <input class="form-control" type="date" bind:value={dueDate} />
          </div>

          <div class="mb-3">
            <label class="form-label">Due Time</label>
            <input class="form-control" type="time" bind:value={dueTime} />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" on:click={() => (showModal = false)}>Cancel</button>
          <button class="btn btn-primary" on:click={handleSubmit}>Add Task</button>
        </div>

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