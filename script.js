const searchInput = document.getElementById('searchInput');
const resourceGrid = document.getElementById('resourceGrid');
const filterButtons = Array.from(document.querySelectorAll('[data-filter]'));
const newsletterForm = document.getElementById('newsletterForm');
const emailInput = document.getElementById('emailInput');
const toast = document.getElementById('toast');

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

filterButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeFilter = button.dataset.filter || 'all';
    filterButtons.forEach((item) => item.classList.toggle('active', item === button));
    applyFilters();
  });
});

searchInput.addEventListener('input', applyFilters);

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

applyFilters();
