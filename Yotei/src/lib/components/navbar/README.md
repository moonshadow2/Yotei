# Navbar Component

## Usage
To add the navbar to any page:
```svelte
<script>
  import Navbar from '$lib/components/Navbar.svelte';
</script>

<Navbar />

<main class="page-content">
  <h1>Your Page Title</h1>
</main>

<style>
  .page-content {
    margin-left: var(--sidebar-width);
    padding: 1rem;
    transition: margin-left 0.3s ease;
  }
</style>
```

## Notes
- The sidebar width is controlled by `--sidebar-width` CSS variable
- The navbar automatically updates the margin when collapsed/expanded