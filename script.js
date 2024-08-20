document.addEventListener('DOMContentLoaded', function () {
  const upButtons = document.querySelectorAll('.button:first-child');
  const lifts = document.querySelectorAll('.lift');
  const levels = document.querySelectorAll('.level-container');

  upButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (index > 0) {
        // Ensure we're not at the top level
        const targetLevel = levels[index - 1]; // The level above the clicked button
        const availableLift = Array.from(lifts).find(
          (lift) => !lift.style.transform
        );

        if (availableLift) {
          const currentLevel = availableLift.closest('.level-container');
          const currentIndex = Array.from(levels).indexOf(currentLevel);
          const levelDifference = currentIndex - (index - 1);

          availableLift.style.transition = 'transform 1s';
          availableLift.style.transform = `translateY(${
            -100 * levelDifference
          }%)`;
        }
      }
    });
  });
});
