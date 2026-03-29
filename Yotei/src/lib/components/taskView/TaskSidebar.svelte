<script>
  let { activeView = $bindable('today') } = $props();
</script>

<div class="sidebar">
  <div class="sidebar-title">Yotei</div>
  <button class="nav-btn {activeView === 'today' ? 'active' : ''}" type="button" onclick={() => activeView = 'today'}>
    Today
  </button>
  <button class="nav-btn {activeView === 'weekly' ? 'active' : ''}" type="button" onclick={() => activeView = 'weekly'}>
    Weekly
  </button>
  <button class="nav-btn {activeView === 'monthly' ? 'active' : ''}" type="button" onclick={() => activeView = 'monthly'}>
    Monthly
  </button>
  <button class="nav-btn {activeView === 'progress' ? 'active' : ''}" type="button" onclick={() => activeView = 'progress'}>
    Progress
  </button>
  <button class="nav-btn {activeView === 'workload' ? 'active' : ''}" type="button" onclick={() => activeView = 'workload'}>
    Workload
  </button>
</div>

<style>
  .sidebar {
    width: 220px;
    min-width: 220px;
    background-color: #0d0d0d;
    border-right: 1px solid rgba(0, 255, 135, 0.15);
    display: flex;
    flex-direction: column;
    padding: 2rem 1rem;
    gap: 0.5rem;
  }

  .sidebar-title {
    font-size: 1.3rem;
    font-weight: 700;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #00ff87, #60efff);
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-bottom: 2rem;
    text-align: center;
  }

  .nav-btn {
    background: none;
    border: 1px solid transparent;
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.6);
    padding: 0.75rem 1rem;
    text-align: left;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    width: 100%;
  }

  .nav-btn:hover {
    background-color: rgba(0, 255, 135, 0.05);
    color: #00ff87;
    border-color: rgba(0, 255, 135, 0.2);
  }

  .nav-btn.active {
    background-color: rgba(0, 255, 135, 0.1);
    color: #00ff87;
    border-color: rgba(0, 255, 135, 0.3);
    font-weight: 600;
  }
</style>