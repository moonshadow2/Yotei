<script>
  import { goto } from '$app/navigation';
  import '$lib/styles/login.css';
  import '$lib/styles/app.css';
  import logo from '$lib/assets/cursed.png';
  import dino1 from '$lib/assets/dino1_colored.png';
  import dino2 from '$lib/assets/dino2_colored.png';
  import dino3 from '$lib/assets/dino3_colored.png';

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
        <img src={logo} alt="Logo" />
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

      <button onclick={handleLogin}>Sign In</button>
      <button onclick={() => goto('/login/register')}>Create Account</button>
    </div>

    <!-- Dinos -->
    <div class="dinos">
      <img src={dino1} alt="dinosaur" />
      <img src={dino2} alt="dinosaur" />
      <img src={dino3} alt="dinosaur" />
    </div>

  </div>
</div>