<script>
  import '$lib/styles/login.css';
  import '$lib/styles/app.css';
  import { goto } from '$app/navigation';
  import { user, editUser, deleteUser } from '$lib/components/user.js';
  import logo from '$lib/assets/cursed.png';
  import dino1 from '$lib/assets/dino1_colored.png';
  import dino2 from '$lib/assets/dino2_colored.png';
  import dino3 from '$lib/assets/dino3_colored.png';

  let newUsername = $state('');
  let newPassword = $state('');
  let confirmPassword = $state('');
  let error = $state('');
  let success = $state('');
  let showUsernameField = $state(false);
  let showPasswordFields = $state(false);

  function toggleUsername() {
    showUsernameField = !showUsernameField;
    if (!showUsernameField) newUsername = '';
    error = ''; success = '';
  }

  function togglePassword() {
    showPasswordFields = !showPasswordFields;
    if (!showPasswordFields) { newPassword = ''; confirmPassword = ''; }
    error = ''; success = '';
  }

  function handleEdit() {
    error = '';
    success = '';

    if (!newUsername.trim() && !newPassword.trim()) {
      error = 'Enter a new username or password to update.';
      return;
    }

    if (newPassword && newPassword.length < 6) {
      error = 'Password must be at least 6 characters.';
      return;
    }

    if (newPassword && newPassword !== confirmPassword) {
      error = 'Passwords do not match.';
      return;
    }

    const changes = {};
    if (newUsername.trim()) changes.username = newUsername.trim();
    if (newPassword.trim()) changes.password = newPassword.trim();

    editUser(changes);
    success = 'Account updated successfully.';
    newUsername = '';
    newPassword = '';
    confirmPassword = '';
  }

  function handleDelete() {
    deleteUser();
    goto('/');
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

    <!-- Settings form -->
    <div class="form">
      <h1>Settings</h1>

      <!-- Change Username -->
      <button class="secondary" onclick={toggleUsername}>
        {showUsernameField ? '✕ Cancel' : '✎ Change Username'}
      </button>
      {#if showUsernameField}
        <div class="expand">
          <input
            type="text"
            placeholder="New Username"
            bind:value={newUsername}
            autocomplete="username"
          />
          <button onclick={handleEdit}>Save Username</button>
        </div>
      {/if}

      <!-- Change Password -->
      <button class="secondary" onclick={togglePassword}>
        {showPasswordFields ? '✕ Cancel' : '✎ Change Password'}
      </button>
      {#if showPasswordFields}
        <div class="expand">
          <input
            type="password"
            placeholder="New Password (min. 6 characters)"
            bind:value={newPassword}
            autocomplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            bind:value={confirmPassword}
            autocomplete="new-password"
          />
          <button onclick={handleEdit}>Save Password</button>
        </div>
      {/if}

      {#if error}
        <p class="error-msg">⚠ {error}</p>
      {/if}

      {#if success}
        <p class="success-msg">✓ {success}</p>
      {/if}

      <button class="secondary" onclick={() => goto('/login')}>
        Back
      </button>

      <div class="divider"></div>

      <button class="danger" onclick={handleDelete}>
        Delete Account
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
    background: rgba(0, 255, 135, 0.06);
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
    border-color: rgba(0, 255, 135, 0.6);
    box-shadow: none;
  }

  .divider {
    width: 100%;
    height: 1px;
    background: rgba(255, 255, 255, 0.07);
    margin: 4px 0;
  }

  button.danger {
    background: transparent;
    border: 1.5px solid rgba(255, 85, 85, 0.35);
    color: #ff5555;
    box-shadow: none;
  }

  .expand {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 10px;
    animation: slideDown 0.2s ease;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  button.danger:hover {
    background: rgba(255, 85, 85, 0.08);
    border-color: rgba(255, 85, 85, 0.7);
    box-shadow: 0 8px 24px rgba(255, 85, 85, 0.2);
  }
</style>