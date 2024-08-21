document.addEventListener('DOMContentLoaded', function () {
  const upButtons = document.querySelectorAll('#up-button');
  const downButtons = document.querySelectorAll('#down-button');
  const lifts = document.querySelectorAll('#lift');
  const levels = document.querySelectorAll('.level-container');
  const levelHeight = 120; // 100px for level height + 20px for margin

  // adding event listner to each up button
  upButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (index > 0) {
        // Ensure we're not at the top level
        const targetLevel = levels[index - 1]; // The level above the clicked button
        moveLift(targetLevel, index - 1, 'up');
      }
    });
  });
  // ading event listener to each down button
  downButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (index < levels.length - 1) {
        // Ensure we're not at the bottom level
        const targetLevel = levels[index + 1]; // The level below the clicked button
        moveLift(targetLevel, index + 1, 'down');
      }
    });
  });

  function moveLift(targetLevel, targetIndex, direction) {
    const availableLift = Array.from(lifts).find((lift) => !lift.dataset.inUse);

    if (availableLift) {
      const currentLevel = availableLift.closest('.level-container');
      const currentIndex = Array.from(levels).indexOf(currentLevel);
      const levelDifference =
        direction === 'up'
          ? currentIndex - targetIndex
          : targetIndex - currentIndex;

      availableLift.dataset.inUse = 'true';
      availableLift.style.transition = 'transform 1s';
      availableLift.style.transform = `translateY(${
        direction === 'up'
          ? -levelHeight * levelDifference
          : levelHeight * levelDifference
      }px)`;
    }
  }
});
