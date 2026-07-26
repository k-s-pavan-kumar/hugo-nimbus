
  const themeToggleDesktop = document.getElementById('theme-toggle');
  const themeToggleMobile = document.getElementById('theme-toggle-mobile');
  const mobileMenuBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleTheme(button) {
    if (document.documentElement.classList.contains('dark')) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      button.textContent = '🌙';
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      button.textContent = '☀️';
    }
  }

  themeToggleDesktop?.addEventListener('click', () => toggleTheme(themeToggleDesktop));
  themeToggleMobile?.addEventListener('click', () => toggleTheme(themeToggleMobile));

  // Mobile menu toggle
  mobileMenuBtn?.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
  });

  // Remember theme on reload
  if (localStorage.theme === 'dark') {
    document.documentElement.classList.add('dark');
    themeToggleDesktop.textContent = '☀️';
    themeToggleMobile.textContent = '☀️';
  }

