<!-- src/routes/+page.svelte -->
<script>
    import '$lib/styles/login.css';
    // Don't have a database yet to store UIDs
    let userID = $state('');
    let password = $state('');

  function handleLogin() {
    console.log('Login attempted:', userID);
  }
</script>

<div class="page">
  <div class="card">

    <!-- Top bar -->
    <div class="topbar">
      <span class="site-name">Yotei</span>
      <div class="logo-box">
        <!-- Replace with: <img src={logo} alt="Logo" /> -->
        <span>Logo</span>
      </div>
    </div>

    <!-- Login form -->
    <div class="form">
      <h1>Login</h1>

      <input
        type="text"
        placeholder="userID"
        bind:value={userID}
      />

      <input
        type="password"
        placeholder="Password"
        bind:value={password}
      />
      
      <!-- Button click -->
        <button onclick={handleLogin}>Sign In</button>
        <button onclick={handleLogin}>Create Account</button>

    </div>

    <!-- Dinosaurs at the bottom 
    <div class="dinos">
      <div class="dino-placeholder green">
        <img src={dino1} alt="dino" />
      </div>
      <div class="dino-placeholder big">
        <img src={dino2} alt="dino" />
      </div>
      <div class="dino-placeholder blue">
        <img src={dino3} alt="dino" />
      </div>
    </div> -->

  </div>
</div>
