(() => {
  'use strict';
  const menuToggle = document.getElementById('menuToggle');
  const navLinks = document.getElementById('navLinks');
  const mobileQuery = window.matchMedia('(max-width: 700px)');

  const setMenu = (open, { returnFocus = false } = {}) => {
    if (!menuToggle || !navLinks) return;
    const isOpen = Boolean(open && mobileQuery.matches);
    navLinks.classList.toggle('open', isOpen);
    menuToggle.classList.toggle('active', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'بستن منو' : 'باز کردن منو');
    document.body.classList.toggle('menu-open', isOpen);
    if (returnFocus) menuToggle.focus();
  };

  menuToggle?.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  navLinks?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('click', event => {
    if (navLinks?.classList.contains('open') && !navLinks.contains(event.target) && !menuToggle.contains(event.target)) setMenu(false);
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && navLinks?.classList.contains('open')) setMenu(false, { returnFocus: true });
    if (event.key === 'Tab' && navLinks?.classList.contains('open')) {
      const focusable = [...navLinks.querySelectorAll('a[href]')];
      if (!focusable.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
  const handleViewport = () => setMenu(false);
  mobileQuery.addEventListener?.('change', handleViewport);
  window.addEventListener('resize', handleViewport, { passive: true });

  const upload = document.getElementById('profileUpload');
  const preview = document.getElementById('profilePreview');
  let photoUrl = null;
  upload?.addEventListener('change', event => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      window.alert('لطفاً یک فایل تصویری معتبر انتخاب کنید.');
      upload.value = '';
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      window.alert('حجم تصویر باید کمتر از ۸ مگابایت باشد.');
      upload.value = '';
      return;
    }
    if (photoUrl) URL.revokeObjectURL(photoUrl);
    photoUrl = URL.createObjectURL(file);
    if (preview) preview.src = photoUrl;
  });
  window.addEventListener('pagehide', () => { if (photoUrl) URL.revokeObjectURL(photoUrl); });

  // Loader: show a real progress animation and keep the intro visible long enough to enjoy it.
  const loader = document.getElementById('loader');
  const loaderNumber = document.getElementById('loaderNumber');
  const loaderBar = document.getElementById('loaderBar');
  const loaderStartedAt = Date.now();
  const minimumLoaderTime = 3000;
  let progress = 0;
  let pageReady = document.readyState === 'complete';
  let loaderFinished = false;
  const progressTimer = window.setInterval(() => {
    if (loaderFinished) return;
    if (progress < 94) progress = Math.min(94, progress + (progress < 70 ? 1.35 : .45));
    if (loaderNumber) loaderNumber.textContent = String(Math.floor(progress));
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loader) loader.style.setProperty('--jump-height', `${12 + progress * .52}px`);
    if (pageReady && Date.now() - loaderStartedAt >= minimumLoaderTime) finishLoader();
  }, 45);
  function finishLoader() {
    if (loaderFinished) return;
    loaderFinished = true;
    window.clearInterval(progressTimer);
    if (loaderNumber) loaderNumber.textContent = '100';
    if (loaderBar) loaderBar.style.width = '100%';
    if (!loader) return;
    loader.style.setProperty('--jump-height', '64px');
    loader.classList.add('impact');
    window.setTimeout(() => loader.classList.add('hidden'), 620);
    window.setTimeout(() => loader.remove(), 1450);
  }
  if (!pageReady) window.addEventListener('load', () => { pageReady = true; }, { once: true });

  const lines = [
  'const developer = () => {',
  '  name: "Alireza jalali",',
  '  role: "Creative Developer",',
  '  vision: "Building the Future",',
  '  skills: ["React", "next.js", "javascript"],',
  '};',
  '',
  '"function createSomethingAmazing(idea) {',
  '  return idea"',
  'console.log("name,role,vision,skills");'
];
  const full = lines.join('\n');
  const target = document.getElementById('typedCode');
  const numbers = document.getElementById('lineNumbers');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const escapeHTML = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const paint = value => {
    if (!target) return;
    target.innerHTML = value.split('\n').map(line => {
      let html = escapeHTML(line);
      html = html.replace(/(&quot;.*?&quot;)/g, '<span class="tok-str">$1</span>');
      html = html.replace(/\b(const|function|return)\b/g, '<span class="tok-key">$1</span>');
      html = html.replace(/\b(alireza|buildExperience|console|log|makeItBeautiful|makeItResponsive|makeItReal)\b/g, '<span class="tok-fn">$1</span>');
      return html;
    }).join('\n');
    if (numbers) numbers.textContent = value.split('\n').map((_, index) => index + 1).join('\n');
  };
  if (reduceMotion) {
    paint(full);
  } else if (target) {
    let position = 0;
    const type = () => {
      paint(full.slice(0, position));
      if (position < full.length) {
        const delay = full.charAt(position) === '\n' ? 150 : 24;
        position += 1;
        window.setTimeout(type, delay);
      } else {
        window.setTimeout(() => { position = 0; type(); }, 3600);
      }
    };
    type();
  }

  if (!('IntersectionObserver' in window)) document.querySelectorAll('.reveal').forEach(element => element.classList.add('is-visible'));
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks?.querySelectorAll('a[href^="#"]').forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }), { rootMargin: '-35% 0px -55% 0px' });
    document.querySelectorAll('main section[id]').forEach(section => sectionObserver.observe(section));

    if (!reduceMotion) {
      const revealTargets = document.querySelectorAll('.stats,.about .copy,.about .editor,.heading,.skill,.contact>*,.ticker');
      const revealObserver = new IntersectionObserver((entries, observer) => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      }), { threshold: .12, rootMargin: '0px 0px -35px 0px' });
      revealTargets.forEach(element => { element.classList.add('reveal'); revealObserver.observe(element); });
      // Never leave content hidden if an observer is interrupted by a browser/layout edge case.
      window.setTimeout(() => revealTargets.forEach(element => element.classList.add('is-visible')), 2600);
    }
  }
})();
