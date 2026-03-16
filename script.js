const wrap = document.getElementById('teamWrap');
const marquee = document.getElementById('teamMarquee');
const teamSection = document.getElementById('teamSection');

const modal = document.getElementById('teamModal');
const modalOverlay = document.getElementById('teamModalOverlay');
const modalClose = document.getElementById('teamModalClose');

const modalImage = document.getElementById('modalImage');
const modalName = document.getElementById('modalName');
const modalRole = document.getElementById('modalRole');
const modalBio = document.getElementById('modalBio');
const modalEmail = document.getElementById('modalEmail');
const modalInstagram = document.getElementById('modalInstagram');
const modalLinkedin = document.getElementById('modalLinkedin');

let currentX = 0;
let targetSpeed = 0.45; // default elegant speed
let currentSpeed = 0.45;

let dragging = false;
let startX = 0;
let lastX = 0;
let velocityX = 0;
let isHoveringWrap = false;
let isInViewportCenter = false;
let animationId = null;

function getLoopWidth() {
  return marquee.scrollWidth / 2;
}

function setSpeedMode() {
  const isMobile = window.innerWidth <= 767;

  if (dragging) {
    targetSpeed = 0;
    return;
  }

  if (isHoveringWrap) {
    targetSpeed = 0.14; // slower on desktop hover
    return;
  }

  if (isMobile) {
    targetSpeed = isInViewportCenter ? 0.12 : 0.42;
  } else {
    targetSpeed = 0.45;
  }
}

function animate() {
  currentSpeed += (targetSpeed - currentSpeed) * 0.04;
  currentX -= currentSpeed;

  if (!dragging && Math.abs(velocityX) > 0.01) {
    currentX += velocityX;
    velocityX *= 0.94;
  }

  const loopWidth = getLoopWidth();

  if (Math.abs(currentX) >= loopWidth) {
    currentX += loopWidth;
  }

  if (currentX > 0) {
    currentX -= loopWidth;
  }

  marquee.style.transform = `translate3d(${currentX}px, 0, 0)`;
  animationId = requestAnimationFrame(animate);
}

function pointerDown(clientX) {
  dragging = true;
  startX = clientX;
  lastX = clientX;
  velocityX = 0;
  wrap.classList.add('is-dragging');
  setSpeedMode();
}

function pointerMove(clientX) {
  if (!dragging) return;

  const delta = clientX - lastX;
  lastX = clientX;
  currentX += delta;
  velocityX = delta * 0.22;
}

function pointerUp() {
  dragging = false;
  wrap.classList.remove('is-dragging');
  setSpeedMode();
}

wrap.addEventListener('mouseenter', () => {
  isHoveringWrap = true;
  setSpeedMode();
});

wrap.addEventListener('mouseleave', () => {
  isHoveringWrap = false;
  setSpeedMode();
});

wrap.addEventListener('mousedown', (e) => {
  pointerDown(e.clientX);
});

window.addEventListener('mousemove', (e) => {
  pointerMove(e.clientX);
});

window.addEventListener('mouseup', () => {
  pointerUp();
});

wrap.addEventListener('touchstart', (e) => {
  if (e.touches.length > 0) {
    pointerDown(e.touches[0].clientX);
  }
}, { passive: true });

wrap.addEventListener('touchmove', (e) => {
  if (e.touches.length > 0) {
    pointerMove(e.touches[0].clientX);
  }
}, { passive: true });

wrap.addEventListener('touchend', () => {
  pointerUp();
});

wrap.addEventListener('wheel', (e) => {
  e.preventDefault();
  currentX -= e.deltaY * 0.7;
  currentX -= e.deltaX * 0.7;
}, { passive: false });

function checkViewportCenter() {
  const rect = teamSection.getBoundingClientRect();
  const viewportCenter = window.innerHeight / 2;
  const sectionCenter = rect.top + rect.height / 2;

  isInViewportCenter =
    sectionCenter > viewportCenter - rect.height * 0.35 &&
    sectionCenter < viewportCenter + rect.height * 0.35;

  setSpeedMode();
}

window.addEventListener('scroll', checkViewportCenter, { passive: true });
window.addEventListener('resize', checkViewportCenter);

function openModal(card) {
  const name = card.dataset.name || '';
  const role = card.dataset.role || '';
  const image = card.dataset.image || '';
  const bio = card.dataset.bio || '';
  const email = card.dataset.email || '#';
  const instagram = card.dataset.instagram || '#';
  const linkedin = card.dataset.linkedin || '#';

  modalImage.src = image;
  modalImage.alt = name;
  modalName.textContent = name;
  modalRole.textContent = role;
  modalBio.textContent = bio;

  modalEmail.href = email.includes('@') ? `mailto:${email}` : email;
  modalInstagram.href = instagram;
  modalLinkedin.href = linkedin;

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.team-card').forEach(card => {
  card.addEventListener('click', () => openModal(card));

  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card);
    }
  });
});

modalOverlay.addEventListener('click', closeModal);
modalClose.addEventListener('click', closeModal);

window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('is-open')) {
    closeModal();
  }
});

checkViewportCenter();
setSpeedMode();
animate();
