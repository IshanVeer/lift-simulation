const levelsInput = document.getElementById('levels');
const liftsInput = document.getElementById('lifts');
let lifts = [];
let levels = 0;

function handleSubmit(event) {
  event.preventDefault();
  levels = parseInt(levelsInput.value);
  const numLifts = parseInt(liftsInput.value);

  localStorage.setItem('levels', levels);
  localStorage.setItem('lifts', numLifts);

  renderLevelsAndLifts(levels, numLifts);
  setupLiftSystem(numLifts);
}

const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);

function renderLevelsAndLifts(levels, numLifts) {
  const levelContainer = document.querySelector('.level-container');
  levelContainer.innerHTML = '';

  for (let i = levels; i >= 1; i--) {
    const levelElement = document.createElement('div');
    levelElement.classList.add('levels');
    levelElement.innerHTML = `
      <div class="button-container">
        <button class="button up-button" data-level="${i}">Up +</button>
        <button class="button down-button" data-level="${i}">Down -</button>
      </div>
      <h3>Level ${i}</h3>
    `;
    levelContainer.appendChild(levelElement);
  }

  const liftContainer = document.createElement('div');
  liftContainer.classList.add('lift-container');
  levelContainer.appendChild(liftContainer);

  const maxLift = Math.min(numLifts, 5);
  const liftWidth = 80; // Width of each lift
  const gapWidth = 20; // Gap between lifts
  const totalWidth = liftContainer.offsetWidth;
  const availableWidth = totalWidth - (maxLift - 1) * gapWidth;
  const liftSpacing = availableWidth / maxLift;

  for (let i = 0; i < maxLift; i++) {
    const liftElement = document.createElement('div');
    liftElement.classList.add('lift');
    liftElement.id = `lift${i + 1}`;
    liftElement.style.left = `${i * liftSpacing}px`;
    liftContainer.appendChild(liftElement);
  }
}

function setupLiftSystem(numLifts) {
  lifts = Array.from({ length: numLifts }, (_, i) => ({
    id: i + 1,
    currentLevel: 1,
    isMoving: false,
    element: document.getElementById(`lift${i + 1}`),
  }));

  const buttons = document.querySelectorAll('.button');
  buttons.forEach((button) => {
    button.addEventListener('click', handleLiftCall);
  });
}

function handleLiftCall(event) {
  const targetLevel = parseInt(event.target.dataset.level);
  const direction = event.target.classList.contains('up-button')
    ? 'up'
    : 'down';

  const availableLift = findNearestAvailableLift(targetLevel, direction);

  if (availableLift) {
    moveLift(availableLift, targetLevel);
  }
}

function findNearestAvailableLift(targetLevel, direction) {
  return lifts
    .filter((lift) => !lift.isMoving)
    .sort((a, b) => {
      const distA = Math.abs(a.currentLevel - targetLevel);
      const distB = Math.abs(b.currentLevel - targetLevel);
      if (distA === distB) return a.id - b.id;
      return distA - distB;
    })[0];
}

function moveLift(lift, targetLevel) {
  lift.isMoving = true;
  const levelHeight = 151; // lift height + gap
  const distance = (targetLevel - lift.currentLevel) * levelHeight;
  const levelsToTravel = Math.abs(targetLevel - lift.currentLevel);
  const duration = levelsToTravel * 2; // 2 seconds per level

  lift.element.style.transition = `transform ${duration}s linear`;
  lift.element.style.transform = `translateY(${-distance}px)`;

  setTimeout(() => {
    lift.currentLevel = targetLevel;
    lift.isMoving = false;
  }, duration * 1000);
}
