const searchInput = document.getElementById('searchInput');
const resourceGrid = document.getElementById('resourceGrid');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const toast = document.getElementById('toast');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle?.querySelector('.theme-icon');
const themeLabel = themeToggle?.querySelector('.theme-label');
const actionButtons = Array.from(document.querySelectorAll('[data-action]'));
const planCards = Array.from(document.querySelectorAll('[data-plan]'));

const resourceCards = Array.from(resourceGrid.querySelectorAll('.resource-card'));
let activeFilter = 'all';
let popularOnly = false;

function normalize(value) {
  return value.trim().toLowerCase();
}

function applyFilters() {
  const query = normalize(searchInput.value);

  resourceCards.forEach((card) => {
    const title = normalize(card.dataset.title || card.querySelector('h4')?.textContent || '');
    const tags = normalize(card.dataset.tags || '');
    const tier = card.dataset.tier || '';
    const isPopular = card.dataset.popular === 'true';
    const matchesQuery = !query || title.includes(query) || tags.includes(query);
    const matchesTier = activeFilter === 'all' || tier === activeFilter || tags.includes(activeFilter);
    const matchesPopular = !popularOnly || isPopular;

    card.classList.toggle('is-hidden', !(matchesQuery && matchesTier && matchesPopular));
    card.classList.toggle('is-popular', popularOnly && isPopular);
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

function scrollToSection(selector) {
  document.querySelector(selector)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function focusEmail(message) {
  scrollToSection('#뉴스레터');
  window.setTimeout(() => emailInput.focus(), 450);
  showToast(message);
}

function selectPlan(plan) {
  planCards.forEach((card) => card.classList.toggle('is-selected', card.dataset.plan === plan));
  focusEmail(`${plan} 멤버십 신청 안내를 받을 이메일을 남겨주세요.`);
}

function activateResource(card) {
  const title = card.dataset.title || card.querySelector('h4')?.textContent || '자료';

  if (card.dataset.tier === 'premium') {
    scrollToSection('#멤버십');
    showToast(`"${title}" 자료는 프리미엄 멤버십에서 열람할 수 있습니다.`);
    return;
  }

  focusEmail(`"${title}" 무료 자료를 받을 이메일을 입력해 주세요.`);
}

function runAction(action) {
  if (action === 'login') {
    focusEmail('현재는 이메일 기반 가입을 지원합니다. 이메일을 입력해 주세요.');
    return;
  }

  if (action === 'start-free') {
    focusEmail('무료 자료 팩을 받을 이메일을 입력해 주세요.');
    return;
  }

  if (action === 'show-popular') {
    popularOnly = true;
    activeFilter = 'all';
    searchInput.value = '';
    filterButtons.forEach((item) => item.classList.toggle('active', item.dataset.filter === 'all'));
    applyFilters();
    scrollToSection('#자료실');
    showToast('이번 주 인기 자료만 모아서 보여드립니다.');
    return;
  }

  if (action === 'start-membership') {
    selectPlan('프로');
  }
}

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    popularOnly = false;
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    applyFilters();
  });
});

searchInput.addEventListener('input', () => {
  popularOnly = false;
  applyFilters();
});

actionButtons.forEach((button) => {
  button.addEventListener('click', () => runAction(button.dataset.action));
});

resourceCards.forEach((card) => {
  card.addEventListener('click', () => activateResource(card));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      activateResource(card);
    }
  });
});

planCards.forEach((card) => {
  card.addEventListener('click', () => selectPlan(card.dataset.plan));
  card.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      selectPlan(card.dataset.plan);
    }
  });
});

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
