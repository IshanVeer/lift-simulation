// Global variables
const levelsInput = document.getElementById('levels');
const liftsInput = document.getElementById('lifts');
let lifts = [];
let levels = 0;
const levelHeight = 151;
let globalRequestQueue = []; // Global queue for handling all button clicks

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
        ${
          i !== levels
            ? `<button class="button up-button" data-level="${i}">Up +</button>`
            : ''
        }
        ${
          i !== 1
            ? `<button class="button down-button" data-level="${i}">Down -</button>`
            : ''
        }
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
    liftElement.innerHTML = `<div class="lift-interior"></div> <div class="lift-door left-door"></div> <div class="lift-door right-door"></div>`;
    liftContainer.appendChild(liftElement);
  }
}

function setupLiftSystem(numLifts) {
  lifts = Array.from({ length: numLifts }, (_, i) => ({
    id: i + 1,
    currentLevel: 1,
    isMoving: false,
    queue: [],
    element: document.getElementById(`lift${i + 1}`),
  }));

  const buttons = document.querySelectorAll('.button');
  buttons.forEach((button) => {
    button.addEventListener('click', handleLiftCall);
  });
}

function handleLiftCall(event) {
  const button = event.target;
  const targetLevel = parseInt(event.target.dataset.level);
  const direction = event.target.classList.contains('up-button')
    ? 'up'
    : 'down';

  button.disabled = true;

  // Add the request to the global queue
  globalRequestQueue.push({ targetLevel, direction });

  // Find a suitable lift to handle the requests
  assignLiftToQueue();
}

function enableButtonAtLevel(level) {
  const buttons = document.querySelectorAll(`.button[data-level="${level}"]`);
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function assignLiftToQueue() {
  if (globalRequestQueue.length === 0) return;

  // Find an idle lift to assign the next request in the global queue
  for (let lift of lifts) {
    if (!lift.isMoving && globalRequestQueue.length > 0) {
      const nextRequest = globalRequestQueue.shift(); // Get the next request
      queueLiftMovement(lift, nextRequest.targetLevel, nextRequest.direction);
      break; // Assign one request to one lift at a time
    }
  }
}

function queueLiftMovement(lift, targetLevel, direction) {
  lift.queue.push({ level: targetLevel, direction: direction });

  if (!lift.isMoving) {
    processLiftQueue(lift);
  }
}

// Animate lift doors
function animateLiftDoors(lift, action) {
  const leftDoor = lift.element.querySelector('.left-door');
  const rightDoor = lift.element.querySelector('.right-door');
  const interior = lift.element.querySelector('.lift-interior');

  if (action === 'open') {
    leftDoor.style.transform = 'translateX(-100%)';
    rightDoor.style.transform = 'translate(100%)';
    interior.style.opacity = '1';
  } else if (action === 'close') {
    leftDoor.style.transform = 'translateX(0)';
    rightDoor.style.transform = 'translateX(0)';
    interior.style.opacity = '0';
  }
}

function processLiftQueue(lift) {
  if (lift.queue.length === 0) {
    lift.isMoving = false;
    lift.direction = null;

    // After processing current queue, assign new requests to the lift
    assignLiftToQueue();
    return;
  }

  lift.isMoving = true;
  const { level: targetLevel } = lift.queue[0];

  const targetDistance = (targetLevel - 1) * levelHeight;
  const currentDistance = (lift.currentLevel - 1) * levelHeight;
  const moveDistance = targetDistance - currentDistance;

  const currentTransform = getComputedStyle(lift.element).transform;
  const matrix = new DOMMatrix(currentTransform);
  const currentY = matrix.m42;

  const newY = currentY - moveDistance;
  const duration = Math.abs(targetLevel - lift.currentLevel) * 2;

  if (lift.currentLevel === targetLevel) {
    animateLiftDoors(lift, 'open');
    setTimeout(() => {
      animateLiftDoors(lift, 'close');
      lift.queue.shift();
      enableButtonAtLevel(targetLevel);
      processLiftQueue(lift);
    }, 3000);
  } else {
    lift.element.style.transition = `transform ${duration}s linear`;
    lift.element.style.transform = `translateY(${newY}px)`;

    setTimeout(() => {
      lift.currentLevel = targetLevel;
      animateLiftDoors(lift, 'open');
      setTimeout(() => {
        animateLiftDoors(lift, 'close');
        lift.queue.shift();
        lift.isMoving = false;
        enableButtonAtLevel(targetLevel);
        processLiftQueue(lift);
      }, 3000);
    }, duration * 1000);
  }
}
