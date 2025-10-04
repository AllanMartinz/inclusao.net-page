// scripts.js

document.addEventListener('DOMContentLoaded', () => {
  // Accessibility Controls Elements
  const fontIncreaseBtns = [
    document.getElementById('font-increase'),
    document.getElementById('float-font-increase'),
    document.getElementById('font-increase-2'),
  ].filter(Boolean);

  const fontDecreaseBtns = [
    document.getElementById('font-decrease'),
    document.getElementById('float-font-decrease'),
    document.getElementById('font-decrease-2'),
  ].filter(Boolean);

  const contrastToggleBtns = [
    document.getElementById('contrast-toggle'),
    document.getElementById('float-contrast-toggle'),
    document.getElementById('contrast-toggle-2'),
  ].filter(Boolean);

  // Root element to adjust variables
  const htmlElement = document.documentElement;

  // Initial font size (in rem)
  let currentFontSize = parseFloat(getComputedStyle(htmlElement).fontSize) / 16 || 1;
  const minFontSize = 0.8;
  const maxFontSize = 2.0;
  const fontStep = 0.1;

  // Load saved preferences
  const savedContrast = localStorage.getItem('contrast') || 'normal';
  const savedFontSize = localStorage.getItem('fontSize');

  if (savedContrast === 'high') {
    htmlElement.classList.add('high-contrast');
  }

  if (savedFontSize) {
    const fontSizeNum = parseFloat(savedFontSize);
    if (fontSizeNum >= minFontSize && fontSizeNum <= maxFontSize) {
      htmlElement.style.fontSize = fontSizeNum + 'rem';
      currentFontSize = fontSizeNum;
    }
  }

  // Increase font function
  function increaseFont() {
    if (currentFontSize < maxFontSize) {
      currentFontSize = Math.min(currentFontSize + fontStep, maxFontSize);
      htmlElement.style.fontSize = currentFontSize.toFixed(2) + 'rem';
      localStorage.setItem('fontSize', currentFontSize);
    }
  }

  // Decrease font function
  function decreaseFont() {
    if (currentFontSize > minFontSize) {
      currentFontSize = Math.max(currentFontSize - fontStep, minFontSize);
      htmlElement.style.fontSize = currentFontSize.toFixed(2) + 'rem';
      localStorage.setItem('fontSize', currentFontSize);
    }
  }

  // Toggle contrast mode
  function toggleContrast() {
    htmlElement.classList.toggle('high-contrast');
    if (htmlElement.classList.contains('high-contrast')) {
      localStorage.setItem('contrast', 'high');
    } else {
      localStorage.setItem('contrast', 'normal');
    }
  }

  // Attach event listeners to buttons
  fontIncreaseBtns.forEach((btn) => {
    btn.addEventListener('click', increaseFont);
  });

  fontDecreaseBtns.forEach((btn) => {
    btn.addEventListener('click', decreaseFont);
  });

  contrastToggleBtns.forEach((btn) => {
    btn.addEventListener('click', toggleContrast);
  });

  // Keyboard shortcuts for accessibility
  document.addEventListener('keydown', (event) => {
    // Only act if event target is body or not input/textarea/select to avoid conflicts
    const activeElement = document.activeElement;
    if (
      activeElement &&
      (activeElement.tagName === 'INPUT' ||
        activeElement.tagName === 'TEXTAREA' ||
        activeElement.isContentEditable ||
        activeElement.tagName === 'SELECT')
    ) {
      return; // don't override keyboard shortcuts when typing
    }

    if (event.key === '+' || event.key === '=' || (event.ctrlKey && event.key === '+')) {
      // Increase font size (Ctrl + +)
      event.preventDefault();
      increaseFont();
    } else if (event.key === '-' || event.key === '_') {
      // Decrease font size
      event.preventDefault();
      decreaseFont();
    } else if (event.key.toLowerCase() === 'c') {
      // Toggle contrast on C key
      event.preventDefault();
      toggleContrast();
    }
  });
});