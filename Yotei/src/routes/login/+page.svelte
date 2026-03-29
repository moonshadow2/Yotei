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
  let error = $state('');
  let loading = $state(false);

  async function handleLogin() {
    error = '';
    if (!email.trim()) { error = 'Email is required.'; return; }
    if (!password) { error = 'Password is required.'; return; }

    loading = true;
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    loading = false;

    if (err) { error = err.message; return; }
    goto('/tasks');
  }
</script>

<div class="page">
  <div class="card">

    <div class="topbar">
      <span class="site-name">Yotei</span>
      <div class="logo-box">
        <img src={logo} alt="Logo" />
      </div>
    </div>

    <div class="form">
      <h1>Login</h1>

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
        autocomplete="current-password"
        onkeydown={(e) => e.key === 'Enter' && handleLogin()}
      />

      {#if error}
        <p class="error-msg">⚠ {error}</p>
      {/if}

      <button onclick={handleLogin} disabled={loading}>
        {loading ? 'Signing in…' : 'Sign In'}
      </button>

      <button class="secondary" onclick={() => goto('/login/register')}>
        Create Account
      </button>
    </div>

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