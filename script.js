const levelsInput = document.getElementById('levels');
const liftsInput = document.getElementById('lifts');

function handleSubmit(event) {
  event.preventDefault(); // Prevent form submission
  const levels = parseInt(levelsInput.value);
  const lifts = parseInt(liftsInput.value);

  // Store the levels and lifts data for later use
  localStorage.setItem('levels', levels);
  localStorage.setItem('lifts', lifts);

  // Render the levels and lifts based on the stored data
  renderLevelsAndLifts(levels, lifts);
}

// Attach the event listener to the form
const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);

function renderLevelsAndLifts(levels, lifts) {
  const levelContainer = document.querySelector('.level-container');

  // Remove existing level containers if any
  levelContainer.innerHTML = '';

  // Create level containers based on the specified number of levels
  for (let i = levels; i >= 1; i--) {
    const levelElement = document.createElement('div');
    levelElement.classList.add('levels');

    // Add buttons and level number to the level container
    levelElement.innerHTML = `
      <div class="button-container">
        <button class="button" id="up-button">Up +</button>
        <button class="button" id="down-button">Down -</button>
      </div>
      <h3>Level ${i}</h3>
    `;

    levelContainer.appendChild(levelElement);
  }

  // Create the lift element
  for (let i = 0; i < lifts; i++) {
    const liftElement = document.createElement('div');
    liftElement.classList.add('lift');
    liftElement.id = `lift${i + 1}`; // Assign unique IDs
    levelContainer.appendChild(liftElement);
  }
}
