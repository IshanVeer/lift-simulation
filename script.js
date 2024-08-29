// Global variables
const levelsInput = document.getElementById('levels');
const liftsInput = document.getElementById('lifts');
let lifts = [];
let levels = 0;
const levelHeight = 151;

// form handler
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

// Renders levels and lift according to the data entered in the form
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
    direction: null,
    queue: [],
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

  const availableLift = findSuitableLift(targetLevel, direction);

  if (availableLift) {
    queueLiftMovement(availableLift, targetLevel, direction);
  }
}

function findSuitableLift(targetLevel, direction) {
  // First, check if Lift 1 is available
  if (!lifts[0].isMoving) {
    return lifts[0];
  }

  // Then, find the nearest available lift
  return lifts
    .filter(
      (lift) =>
        !lift.isMoving || (lift.isMoving && lift.direction === direction)
    )
    .sort((a, b) => {
      const distA = Math.abs(a.currentLevel - targetLevel);
      const distB = Math.abs(b.currentLevel - targetLevel);
      if (distA === distB) return a.id - b.id;
      return distA - distB;
    })[0];
}

function queueLiftMovement(lift, targetLevel, direction) {
  lift.queue.push({ level: targetLevel, direction: direction });

  if (!lift.isMoving) {
    processLiftQueue(lift);
  }
}

function processLiftQueue(lift) {
  if (lift.queue.length === 0) {
    lift.isMoving = false;
    lift.direction = null;
    return;
  }

  lift.isMoving = true;
  const { level: targetLevel, direction } = lift.queue[0];
  lift.direction = direction;

  const distance = (targetLevel - lift.currentLevel) * levelHeight;
  const levelsToTravel = Math.abs(targetLevel - lift.currentLevel);
  const duration = levelsToTravel * 2; // 2 seconds per level

  lift.element.style.transition = `transform ${duration}s linear`;
  lift.element.style.transform = `translateY(${-distance}px)`;

  setTimeout(() => {
    lift.currentLevel = targetLevel;
    lift.queue.shift();
    processLiftQueue(lift);
  }, duration * 1000);
}
