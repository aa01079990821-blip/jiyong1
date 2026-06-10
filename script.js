const searchInput = document.getElementById('searchInput');
const resourceGrid = document.getElementById('resourceGrid');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const toast = document.getElementById('toast');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeLabel = themeToggle?.querySelector('.theme-label');

const resourceCards = Array.from(resourceGrid.querySelectorAll('.resource-card'));
let activeFilter = 'all';

function normalize(value) {
  return value.trim().toLowerCase();
}

function applyFilters() {
  const query = normalize(searchInput.value);

  resourceCards.forEach((card) => {
    const title = normalize(card.dataset.title || card.querySelector('h4')?.textContent || '');
    const tags = normalize(card.dataset.tags || '');
    const tier = card.dataset.tier || '';
    const matchesQuery = !query || title.includes(query) || tags.includes(query);
    const matchesTier = activeFilter === 'all' || tier === activeFilter || tags.includes(activeFilter);

    card.classList.toggle('is-hidden', !(matchesQuery && matchesTier));
  });
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');

  window.clearTimeout(showToast.hideTimer);
  showToast.hideTimer = window.setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function applyTheme(theme) {
  const isDark = theme === 'dark';

  document.documentElement.dataset.theme = theme;
  themeToggle?.setAttribute('aria-pressed', String(isDark));
  themeToggle?.setAttribute('aria-label', isDark ? '화이트 모드로 전환' : '다크 모드로 전환');

  if (themeIcon) {
    themeIcon.textContent = isDark ? '☀' : '☾';
  }

  if (themeLabel) {
    themeLabel.textContent = isDark ? '화이트' : '다크';
  }
}

function getCurrentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    applyFilters();
  });
});

searchInput.addEventListener('input', applyFilters);

themeToggle?.addEventListener('click', () => {
  const nextTheme = getCurrentTheme() === 'dark' ? 'light' : 'dark';
  localStorage.setItem('theme', nextTheme);
  applyTheme(nextTheme);
});

newsletterForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = emailInput.value.trim();

  if (!email) {
    showToast('이메일 주소를 입력해 주세요.');
    emailInput.focus();
    return;
  }

  showToast(`"${email}" 주소로 무료 자료 안내를 신청했습니다.`);
  newsletterForm.reset();
});

applyTheme(getCurrentTheme());
applyFilters();
