(function () {
  'use strict';

  /* ---------------------------------------------------------------
     Dark / light mode toggle (persisted in localStorage)
  ------------------------------------------------------------------ */
  function applyThemeIcon() {
    var isDark = document.documentElement.classList.contains('dark');
    document.querySelectorAll('.theme-toggle-icon').forEach(function (el) {
      el.textContent = isDark ? '☀️' : '🌙';
    });
    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  function toggleTheme() {
    var isDark = document.documentElement.classList.toggle('dark');
    try { localStorage.setItem('nimbus-theme', isDark ? 'dark' : 'light'); } catch (e) {}
    applyThemeIcon();
  }

  document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
    btn.addEventListener('click', toggleTheme);
  });
  applyThemeIcon();

  /* ---------------------------------------------------------------
     Mobile menu
  ------------------------------------------------------------------ */
  var menuButton = document.getElementById('mobile-menu-button');
  var mobileMenu = document.getElementById('mobile-menu');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      var isOpen = !mobileMenu.classList.contains('hidden');
      mobileMenu.classList.toggle('hidden');
      menuButton.setAttribute('aria-expanded', String(!isOpen));
    });
  }

  /* ---------------------------------------------------------------
     Keyboard shortcuts
     - Cmd/Ctrl+K or "/"  -> focus search
     - Esc                -> blur search / close results & mobile menu
  ------------------------------------------------------------------ */
  var searchInput = document.getElementById('search-input');

  document.addEventListener('keydown', function (e) {
    var isTypingTarget = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable;

    // Cmd/Ctrl+K always works, even while typing elsewhere.
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchInput) searchInput.focus();
      return;
    }

    // Bare "/" only when not already typing in a field.
    if (e.key === '/' && !isTypingTarget) {
      e.preventDefault();
      if (searchInput) searchInput.focus();
      return;
    }

    if (e.key === 'Escape') {
      if (document.activeElement === searchInput) {
        searchInput.blur();
      }
      var results = document.getElementById('search-results');
      if (results) results.innerHTML = '';
      if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
        if (menuButton) menuButton.setAttribute('aria-expanded', 'false');
      }
    }
  });

  /* ---------------------------------------------------------------
     Copy-to-clipboard buttons on code blocks
     Chroma (Hugo's syntax highlighter) wraps each fenced code block in
     <div class="highlight"><pre><code>...</code></pre></div> — this adds
     a small floating button to each one. No external library needed.
  ------------------------------------------------------------------ */
  if (document.body.dataset.copyCodeButton !== 'false') {
    document.querySelectorAll('.highlight').forEach(function (block) {
      if (block.querySelector('.copy-code-btn')) return; // already added
      var codeEl = block.querySelector('pre code') || block.querySelector('pre');
      if (!codeEl) return;

      block.style.position = 'relative';

      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'copy-code-btn';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.textContent = 'Copy';

      btn.addEventListener('click', function () {
        var text = codeEl.innerText;
        navigator.clipboard.writeText(text).then(function () {
          btn.textContent = 'Copied!';
          btn.classList.add('is-copied');
          setTimeout(function () {
            btn.textContent = 'Copy';
            btn.classList.remove('is-copied');
          }, 1500);
        });
      });

      block.appendChild(btn);
    });
  }
})();
