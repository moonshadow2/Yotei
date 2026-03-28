<script>


  import '$lib/styles/navbar.css';
  import { sidebar } from '$lib/stores/sidebar.svelte.js';

  $effect(() => {
    document.documentElement.style.setProperty(
      '--sidebar-width',
      sidebar.collapsed ? '50px' : '220px'
    );
  });
</script>

<aside class:collapsed={sidebar.collapsed}>
  <button class="toggle" onclick={() => sidebar.collapsed = !sidebar.collapsed}>
    {sidebar.collapsed ? '→' : '←'}
  </button>

  {#if !sidebar.collapsed}
    <nav class="navbar">
      <a href="/tasks">Tasks</a>
      <a href="/login">Login</a>
    </nav>
  {/if}
</aside>

