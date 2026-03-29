<script>
  import '$lib/styles/login.css';
  import '$lib/styles/app.css';
  import { goto } from '$app/navigation';
  import logo from '$lib/assets/cursed.png';
  import dino1 from '$lib/assets/dino1_colored.png';
  import dino2 from '$lib/assets/dino2_colored.png';
  import dino3 from '$lib/assets/dino3_colored.png';

  let username = $state('');
  let password = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let loading = $state(false);

  async function handleCreate() {
    error = '';
    if (!username.trim()) { error = 'Username is required.'; return; }
    if (password.length < 6) { error = 'Password must be at least 6 characters.'; return; }
    if (password !== confirmPassword) { error = 'Passwords do not match.'; return; }

    loading = true;
    // Replace with your real account creation logic
    await new Promise(r => setTimeout(r, 1000));
    loading = false;

    goto('/login');
  }
</script>

<div class="page">
  <div class="card">

    <!-- Top bar -->
    <div class="topbar">
      <span class="site-name">Yotei</span>
      <div class="logo-box">
        <img src={logo} alt="Logo" />
      </div>
    </div>

    <!-- Create Account form -->
    <div class="form">
      <h1>Register</h1>

      <input
        type="text"
        placeholder="Username"
        bind:value={username}
        autocomplete="username"
      />

      <input
        type="password"
        placeholder="Password (min. 6 characters)"
        bind:value={password}
        autocomplete="new-password"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={confirmPassword}
        autocomplete="new-password"
      />

      {#if error}
        <p class="error-msg">⚠ {error}</p>
      {/if}

      <button onclick={handleCreate} disabled={loading}>
        {loading ? 'Creating…' : 'Create Account'}
      </button>

      <button class="secondary" onclick={() => goto('/login')}>
        Back to Login
      </button>
    </div>

    <!-- Dinos -->
    <div class="dinos">
      <img src={dino1} alt="dinosaur" />
      <img src={dino2} alt="dinosaur" />
      <img src={dino3} alt="dinosaur" />
    </div>

  </div>
</div>

<style>
  .error-msg {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    font-size: 13px;
    color: #ff5555;
    background: rgba(255, 85, 85, 0.08);
    border: 1px solid rgba(255, 85, 85, 0.2);
    border-radius: 8px;
    padding: 10px 14px;
  }

  /* Secondary button — outlined instead of filled */
  button.secondary {
    background: transparent;
    border: 1.5px solid rgba(0, 255, 135, 0.3);
    color: #00ff87;
    box-shadow: none;
  }

  button.secondary:hover {
    background: rgba(0, 255, 135, 0.06);
    box-shadow: none;
    border-color: rgba(0, 255, 135, 0.6);
  }

  button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
</style>