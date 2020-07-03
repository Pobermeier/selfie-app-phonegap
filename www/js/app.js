(function () {
  const state = {
    currentColor: 0,
    paintModeActive: false,
    availColors: ['red', 'green', 'blue', 'yellow', 'white'],
    image: null,
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
    const saveToGalleryBtn = document.getElementById('save-to-gallery');
    const takePictureBtn = document.getElementById('take-picture');
    const selectedColor = document.getElementById('current-color');
    const togglepaintModeBtn = document.getElementById('toggle-paint-mode');
    const resetBtn = document.getElementById('reset-canvas');
    const paintUi = document.getElementById('paint-ui');
    const filterBtns = document.querySelectorAll('#PresetFilters button');

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

    paintUi.dataset.active = state.paintModeActive;

    filterBtns.forEach((filterBtn) => {
      filterBtn.addEventListener('click', (e) => {
        const filterPreset = e.target.dataset.preset;

        if (filterPreset === 'original') {
          Caman(imageEditor, function () {
            this.revert().render();
          });
          return;
        }

        if (state.image) {
          const img = new Image();
          img.src = state.image;
          img.onload = () => {
            drawImage(img, filterPreset);
          };
        }
      });
    });

    togglepaintModeBtn.addEventListener('click', () => {
      state.paintModeActive = !state.paintModeActive;
      paintUi.dataset.active = state.paintModeActive;
    });

    saveToGalleryBtn.addEventListener('click', () => {
      saveImageToGallery();
    });

    takePictureBtn.addEventListener('click', () => {
      cameraLoadImage();
    });

    // Draw Functionality
    imageEditor.addEventListener('touchstart', (e) => {
      e.preventDefault();
      if (state.paintModeActive) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY - canvasTop;

        paintDot(lastX, lastY);
      }
    });

    imageEditor.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (state.paintModeActive) {
        const newX = e.touches[0].clientX;
        const newY = e.touches[0].clientY - canvasTop;

        drawLine(lastX, lastY, newX, newY);

        lastX = newX;
        lastY = newY;
      }
    });

    // UI Helper Functions
    function resetColor() {
      state.currentColor = 0;
      return state.availColors[state.currentColor];
    }

    // Draw Functions
    function paintDot(x, y) {
      ctx.beginPath();
      ctx.fillStyle = state.availColors[state.currentColor];
      ctx.arc(x, y, 5, 0, Math.PI * 2, true);
      ctx.fill();
      ctx.closePath();
    }

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

    function drawImage(img, filter) {
      // Clear canvas before repaint
      // clear();

      // Draw new image with or without filter applied
      if (filter) {
        Caman(imageEditor, img.src, function () {
          this.revert();
          this[`${filter}`]().render();
        });
      } else {
        Caman(imageEditor, img.src, function () {
          this.render();
        });
      }
    }

    // Canvas Helper functions
    function cameraLoadImage() {
      if (APP) {
        const config = {
          correctOrientation: true,
          quality: 100,
          targetHeight: imageEditor.height,
          cameraDirection: Camera.Direction.FRONT,
        };

        navigator.camera.getPicture(
          (imgData) => {
            const img = new Image();
            img.src = imgData;
            state.image = img.src;
            img.onload = () => {
              drawImage(img);
            };
          },
          () => {
            alert('Error drawing image');
          },
          config,
        );
      } else {
        alert(
          'Taking a photo is only available when running the app on a mobile device.',
        );
        const img = new Image();
        img.src = './img/test.png';
        state.image = img.src;
        img.onload = () => {
          drawImage(img);
        };
      }
    }

    function saveImageToGallery() {
      if (APP) {
        window.canvas2ImagePlugin.saveImageDataToLibrary(
          () => {
            alert('Image successfully saved to gallery!');
          },
          () => {
            alert('Saving the image failed!');
          },
          imageEditor,
        );
      } else {
        alert(
          'Save to Gallery is only available when running the app on a mobile device.',
        );
      }
    }

    function resetCanvasSize() {
      imageEditor.width = window.innerWidth;
      imageEditor.height = window.innerHeight;
    }

    function clear() {
      ctx.fillStyle = '#ffffff';
      ctx.rect(0, 0, imageEditor.width, imageEditor.height);
      ctx.fill();
    }
  }
})();
