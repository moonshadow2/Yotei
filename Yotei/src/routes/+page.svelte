<script>
  function scrollToTop(e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
</script>

<svelte:head>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700&display=swap" rel="stylesheet">
  <style>
    html {
      scroll-behavior: smooth;
      background-color: #0a0a0a;
    }
  </style>
</svelte:head>

<style>
  :global(html) {
    background-color: #0a0a0a;
  }

  .page {
    min-height: 100vh;
    background-color: #0a0a0a;
    color: #ffffff;
    font-family: 'Inter', sans-serif;
  }

  .navbar {
    background-color: rgba(10, 10, 10, 0.85) !important;
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 255, 135, 0.2);
  }
  
  .navbar-toggler {
  border-color: rgba(0, 255, 135, 0.5) !important;
}

.navbar-toggler-icon {
  filter: invert(1) sepia(1) saturate(5) hue-rotate(90deg);
}

  .navbar-brand {
    font-weight: 700;
    font-size: 1.5rem !important;
    letter-spacing: 2px;
    color: #00ff87 !important;
  }

  .nav-link {
  color: #00ff87 !important;
  font-size: 0.9rem;
  letter-spacing: 1px;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #60efff !important;
}

  .hero {
    height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: radial-gradient(ellipse at top, #003320 0%, #0a0a0a 70%);
  }

  .hero h1 {
    font-size: clamp(2.5rem, 6vw, 6rem);
    font-weight: 700;
    letter-spacing: 4px;
    margin-bottom: 1rem;
    background: linear-gradient(90deg, #00ff87, #60efff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .hero p {
    font-size: clamp(1rem, 2vw, 1.5rem);
    color: rgba(255, 255, 255, 0.5);
    margin-bottom: 3rem;
    letter-spacing: 1px;
  }

  .login-btn {
    background: linear-gradient(135deg, #00ff87, #60efff);
    border: none;
    border-radius: 50px;
    font-size: clamp(1rem, 2vw, 1.5rem);
    padding: 1.5vh 5vw;
    color: #0a0a0a;
    font-weight: 700;
    letter-spacing: 1px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-decoration: none;
  }

  .login-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 30px rgba(0, 255, 135, 0.6);
    color: #0a0a0a;
  }

  .about-section {
    background-color: #0d0d0d;
    padding: 15vh 10vw;
    border-top: 1px solid rgba(0, 255, 135, 0.15);
  }

  .about-section h2 {
    font-size: clamp(2rem, 4vw, 4rem);
    font-weight: 700;
    letter-spacing: 2px;
    background: linear-gradient(90deg, #00ff87, #60efff);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .about-section p {
    color: rgba(255, 255, 255, 0.6);
    font-size: clamp(0.9rem, 1.5vw, 1.2rem);
    line-height: 1.8;
  }

  .about-section h4 {
    color: #00ff87;
    font-weight: 600;
    font-size: clamp(1.1rem, 2vw, 1.5rem);
  }

  .feature-card {
    background-color: #111111;
    border: 1px solid rgba(0, 255, 135, 0.2);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 0 30px rgba(0, 255, 135, 0.05);
  }

  .feature-card h5 {
    color: #00ff87;
    font-weight: 600;
    margin-bottom: 1.5rem;
    font-size: clamp(1rem, 1.5vw, 1.3rem);
  }

  .list-group-item {
    background-color: transparent !important;
    border-color: rgba(0, 255, 135, 0.1) !important;
    color: rgba(255, 255, 255, 0.7);
    padding: 0.8rem 0;
    font-size: clamp(0.85rem, 1.2vw, 1rem);
  }

  .cta-btn {
    background: linear-gradient(135deg, #00ff87, #60efff);
    border: none;
    border-radius: 50px;
    font-size: clamp(1rem, 2vw, 1.5rem);
    padding: 1.5vh 4vw;
    color: #0a0a0a;
    font-weight: 700;
    letter-spacing: 1px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    text-decoration: none;
  }

  .cta-btn:hover {
    transform: scale(1.08);
    box-shadow: 0 8px 30px rgba(0, 255, 135, 0.6);
    color: #0a0a0a;
  }
</style>

<div id="top"></div>

<!-- Navbar -->
<nav class="navbar navbar-expand-lg fixed-top">
  <div class="container position-relative">
    <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
      <span class="navbar-toggler-icon"></span>
    </button>
    <a class="navbar-brand position-absolute start-50 translate-middle-x" href="/">Yotei</a>
    <div class="collapse navbar-collapse" id="navbarNav">
      <ul class="navbar-nav ms-auto">
        <li class="nav-item">
          <a class="nav-link" href="/" on:click={scrollToTop}>Home</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" href="#about">About</a>
        </li>
      </ul>
    </div>
  </div>
</nav>

<!-- Hero Section -->
<div class="hero">
  <h1>Yotei</h1>
  <p>Manage your tasks. Own your day.</p>
  <a href="/login" class="login-btn">Login</a>
</div>

<!-- About Section -->
<section id="about" class="about-section">
  <div class="container">

    <div class="text-center mb-5">
      <h2>About Yotei</h2>
      <p class="mt-2">Simplifying the way you manage your tasks</p>
    </div>

    <div class="row align-items-center">

      <div class="col-md-6">
        <h4>What is Yotei?</h4>
        <p>Yotei is a task management platform designed to help you stay organized, focused, and productive. Whether you're managing personal goals or team projects, Yotei makes it simple.</p>

        <h4 class="mt-4">Why Yotei?</h4>
        <p>We believe managing tasks should be effortless. Yotei gives you the tools to plan your day, track your progress, and get things done — all in one place.</p>
      </div>

      <div class="col-md-6">
        <div class="feature-card">
          <h5>What you can do with Yotei</h5>
          <ul class="list-group list-group-flush">
            <li class="list-group-item">✅ Create and organize tasks</li>
            <li class="list-group-item">📅 Set deadlines and reminders</li>
            <li class="list-group-item">📊 Track your progress</li>
            <li class="list-group-item">🤝 Collaborate with others</li>
            <li class="list-group-item">📱 Access from any device</li>
          </ul>
        </div>
      </div>

    </div>

    <div class="text-center mt-5">
      <p>Ready to get started?</p>
      <a href="/login" class="cta-btn">Get Started</a>
    </div>

  </div>
</section>