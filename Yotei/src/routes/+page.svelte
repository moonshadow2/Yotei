<script>
  import { enhance } from "$app/forms";
  export let data;
</script>

<h1>My Tasks</h1>

<!-- Create Task Form -->
<form method="POST" action="?/create" use:enhance>
  <input name="title" placeholder="New task..." required />
  <input name="due_date" type="date" />
  <select name="priority">
    <option value="low">Low</option>
    <option value="medium" selected>Medium</option>
    <option value="high">High</option>
  </select>
  <button type="submit">Add Task</button>
</form>

<!-- Task List -->
{#each data.tasks as task}
  <div>
    <form method="POST" action="?/toggle" use:enhance style="display:inline">
      <input type="hidden" name="id" value={task.id} />
      <input type="hidden" name="is_complete" value={task.is_complete} />
      <input type="checkbox" checked={task.is_complete} on:change={(e) => e.target.form.requestSubmit()} />
    </form>

    <span style="text-decoration: {task.is_complete ? 'line-through' : 'none'}">
      {task.title}
    </span>
    {#if task.due_date}<small>📅 {task.due_date}</small>{/if}
    <small>🏷 {task.priority}</small>

    <form method="POST" action="?/delete" use:enhance style="display:inline">
      <input type="hidden" name="id" value={task.id} />
      <button type="submit">🗑</button>
    </form>
  </div>
{/each}