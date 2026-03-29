<script>
  import '$lib/styles/login.css';
  import '$lib/styles/app.css';
  import { goto } from '$app/navigation';
  import logo from '$lib/assets/cursed.png';
  import dino1 from '$lib/assets/dino1_colored.png';
  import dino2 from '$lib/assets/dino2_colored.png';
  import dino3 from '$lib/assets/dino3_colored.png';
  import { supabase } from '$lib/supabaseClient';

  let email = $state('');
  let password = $state('');
  let confirm = $state('');
  let error = $state('');
  let success = $state('');
  let loading = $state(false);

  async function handleRegister() {
    error = '';
    success = '';
    if (!email.trim()) { error = 'Email is required.'; return; }
    if (!password) { error = 'Password is required.'; return; }
    if (password !== confirm) { error = 'Passwords do not match.'; return; }
    if (password.length < 6) { error = 'Password must be at least 6 characters.'; return; }

    loading = true;
    const { error: err } = await supabase.auth.signUp({ email, password });
    loading = false;

    if (err) { error = err.message; return; }
    success = 'Account created! Redirecting to login...';
    setTimeout(() => goto('/login'), 2000);
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

    <!-- Register form -->
    <div class="form">
      <h1>Create Account</h1>

      <input
        type="email"
        placeholder="Email"
        bind:value={email}
        autocomplete="email"
      />

      <input
        type="password"
        placeholder="Password"
        bind:value={password}
        autocomplete="new-password"
      />

      <input
        type="password"
        placeholder="Confirm Password"
        bind:value={confirm}
        autocomplete="new-password"
        onkeydown={(e) => e.key === 'Enter' && handleRegister()}
      />

      {#if error}
        <p class="error-msg">⚠ {error}</p>
      {/if}

      {#if success}
        <p class="success-msg">✓ {success}</p>
      {/if}

      <button onclick={handleRegister} disabled={loading}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <button class="secondary" onclick={() => goto('/login')}>
        Already have an account? Sign In
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

  .success-msg {
    width: 100%;
    box-sizing: border-box;
    margin: 0;
    font-size: 13px;
    color: #00ff87;
    background: rgba(0, 255, 135, 0.08);
    border: 1px solid rgba(0, 255, 135, 0.2);
    border-radius: 8px;
    padding: 10px 14px;
  }

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