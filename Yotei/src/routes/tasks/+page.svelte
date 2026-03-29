<script>
  import TaskSidebar from '$lib/components/taskView/TaskSidebar.svelte';
  import TodayView from '$lib/components/taskView/TodayView.svelte';
  import WeeklyView from '$lib/components/taskView/WeeklyView.svelte';
  import MonthlyView from '$lib/components/taskView/MonthlyView.svelte';
  import ProgressView from '$lib/components/taskView/ProgressView.svelte';
  import AddTask from '$lib/components/task-plus-button.svelte';

  let activeView = 'today';
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
</svelte:head>

<style>
  :global(html) { background-color: #0a0a0a; }

  .layout {
    display: flex;
    height: 100vh;
    font-family: 'Inter', sans-serif;
    background-color: #0a0a0a;
    color: #ffffff;
    overflow: hidden;
  }

  .main {
    flex: 1;
    overflow-y: auto;
    padding: 2rem;
  }

  .main::-webkit-scrollbar { width: 6px; }
  .main::-webkit-scrollbar-track { background: transparent; }
  .main::-webkit-scrollbar-thumb { background: rgba(0,255,135,0.2); border-radius: 99px; }
</style>

<div class="layout">
  <TaskSidebar bind:activeView />

  <div class="main">
    {#if activeView === 'today'}
      <TodayView />
    {:else if activeView === 'weekly'}
      <WeeklyView />
    {:else if activeView === 'monthly'}
      <MonthlyView />
    {:else if activeView === 'progress'}
      <ProgressView />
    {/if}
  </div>
</div>

<AddTask />