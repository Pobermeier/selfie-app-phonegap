(function () {
  const state = {
    currentColor: 0,
    availColors: ['red', 'green', 'blue', 'yellow'],
  };

  if (APP) {
    document.addEventListener('deviceready', init);
  } else {
    document.addEventListener('DOMContentLoaded', init);
  }

  function init() {
    const imageEditor = document.getElementById('image-editor');
    const canvasTop = imageEditor.offsetTop;
    const ctx = imageEditor.getContext('2d');
    const selectedColor = document.getElementById('current-color');
    const resetBtn = document.getElementById('reset-canvas');

    let lastX;
    let lastY;

    // UI Functionality
    resetCanvasSize();

    window.addEventListener('resize', () => {
      resetCanvasSize();
    });

    selectedColor.style.backgroundColor = state.availColors[state.currentColor];

    selectedColor.addEventListener('click', () => {
      const nextColor =
        state.currentColor < state.availColors.length - 1
          ? state.availColors[++state.currentColor]
          : resetColor();
      selectedColor.style.backgroundColor = nextColor;
    });

    resetBtn.addEventListener('click', () => {
      clear();
    });

    // Draw Functionality
    imageEditor.addEventListener('touchstart', (e) => {
      lastX = e.touches[0].clientX;
      lastY = e.touches[0].clientY - canvasTop;

      paintDot(lastX, lastY);
    });

    imageEditor.addEventListener('touchmove', (e) => {
      const newX = e.touches[0].clientX;
      const newY = e.touches[0].clientY - canvasTop;

      drawLine(lastX, lastY, newX, newY);

      lastX = newX;
      lastY = newY;
    });

    function drawLine(fromx, fromy, tox, toy) {
      ctx.strokeStyle = state.availColors[state.currentColor];
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(fromx, fromy);
      ctx.lineTo(tox, toy);
      ctx.stroke();
      ctx.closePath();
    }

    // UI Helper Functions
    function resetColor() {
      state.currentColor = 0;
      return state.availColors[state.currentColor];
    }

    function clear() {
      ctx.fillStyle = '#ffffff';
      ctx.rect(0, 0, window.innerWidth, window.innerHeight);
      ctx.fill();
    }

    // Draw Functions
    function paintDot(x, y) {
      ctx.beginPath();
      ctx.fillStyle = state.availColors[state.currentColor];
      ctx.arc(x, y, 5, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
    }

    // Canvas Helper functions
    function resetCanvasSize() {
      imageEditor.width = screen.width;
      imageEditor.height = screen.height;
    }
  }
})();
