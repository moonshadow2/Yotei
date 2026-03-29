<script>
  import TaskSidebar from '$lib/components/taskView/TaskSidebar.svelte';
  import TodayView from '$lib/components/taskView/TodayView.svelte';
  import WeeklyView from '$lib/components/taskView/WeeklyView.svelte';
  import MonthlyView from '$lib/components/taskView/MonthlyView.svelte';
  import ProgressView from '$lib/components/taskView/ProgressView.svelte';
  import WorkLoad from '$lib/components/taskView/WorkLoad.svelte';
  import AddTask from '$lib/components/task-plus-button.svelte';

  let activeView = $state('today');
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

  .view { display: none; }
  .view.active { display: block; }
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