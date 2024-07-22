document.addEventListener('DOMContentLoaded', function() {
  const fontFamilySelect = document.getElementById('font-family');
  const fontWeightSelect = document.getElementById('font-weight');
  const italicToggleCheckbox = document.getElementById('italic-toggle');
  const editorTextarea = document.getElementById('editor-text');
  const resetBtn = document.getElementById('reset-btn');
  const saveBtn = document.getElementById('save-btn');

  // Load Google Fonts API
  fetch('https://www.googleapis.com/webfonts/v1/webfonts?key=YOUR_API_KEY')
    .then(response => response.json())
    .then(data => {
      const fonts = data.items;
      // Populate Font Family dropdown
      fonts.forEach(font => {
        const option = document.createElement('option');
        option.textContent = font.family;
        option.value = font.family;
        fontFamilySelect.appendChild(option);
      });

      // Font Family change handler
      fontFamilySelect.addEventListener('change', () => {
        const selectedFamily = fontFamilySelect.value;
        updateFontWeights(selectedFamily);
        updateItalicAvailability(selectedFamily, fontWeightSelect.value);
        applyFontStyles();
      });

      // Font Weight change handler
      fontWeightSelect.addEventListener('change', () => {
        const selectedWeight = fontWeightSelect.value;
        updateItalicAvailability(fontFamilySelect.value, selectedWeight);
        applyFontStyles();
      });

      // Italic toggle checkbox change handler
      italicToggleCheckbox.addEventListener('change', () => {
        applyFontStyles();
      });

      // Load saved text and font settings if available
      const savedText = localStorage.getItem('editorText');
      const savedFontFamily = localStorage.getItem('fontFamily');
      const savedFontWeight = localStorage.getItem('fontWeight');
      const savedItalic = localStorage.getItem('italic');

      if (savedText) {
        editorTextarea.value = savedText;
      }

      if (savedFontFamily) {
        fontFamilySelect.value = savedFontFamily;
        updateFontWeights(savedFontFamily);
      }

      if (savedFontWeight) {
        fontWeightSelect.value = savedFontWeight;
      }

      if (savedItalic === 'true') {
        italicToggleCheckbox.checked = true;
      }

      // Apply initial font styles
      applyFontStyles();
    })
    .catch(error => console.error('Error fetching Google Fonts:', error));

  // Update Font Weight dropdown based on selected Font Family
  function updateFontWeights(fontFamily) {
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts/${encodeURIComponent(fontFamily)}?key=YOUR_API_KEY`)
      .then(response => response.json())
      .then(data => {
        const variants = data.variants;
        fontWeightSelect.innerHTML = ''; // Clear existing options

        variants.forEach(variant => {
          const option = document.createElement('option');
          option.textContent = variant;
          option.value = variant;
          fontWeightSelect.appendChild(option);
        });

        // Set default weight if not set
        if (!fontWeightSelect.value) {
          fontWeightSelect.value = 'regular';
        }
      })
      .catch(error => console.error('Error fetching font variants:', error));
  }

  // Update italic toggle checkbox availability based on selected Font Family and Weight
  function updateItalicAvailability(fontFamily, fontWeight) {
    fetch(`https://www.googleapis.com/webfonts/v1/webfonts/${encodeURIComponent(fontFamily)}?key=YOUR_API_KEY`)
      .then(response => response.json())
      .then(data => {
        const variants = data.variants;
        const isItalicAvailable = variants.includes(`${fontWeight}italic`);

        italicToggleCheckbox.disabled = !isItalicAvailable;
        if (!isItalicAvailable && italicToggleCheckbox.checked) {
          italicToggleCheckbox.checked = false;
        }
      })
      .catch(error => console.error('Error fetching font variants:', error));
  }

  // Apply selected font styles to the editor text area
  function applyFontStyles() {
    const selectedFontFamily = fontFamilySelect.value;
    const selectedFontWeight = fontWeightSelect.value;
    const isItalic = italicToggleCheckbox.checked;

    editorTextarea.style.fontFamily = selectedFontFamily;
    editorTextarea.style.fontWeight = selectedFontWeight;
    editorTextarea.style.fontStyle = isItalic ? 'italic' : 'normal';

    // Save current settings to localStorage
    localStorage.setItem('editorText', editorTextarea.value);
    localStorage.setItem('fontFamily', selectedFontFamily);
    localStorage.setItem('fontWeight', selectedFontWeight);
    localStorage.setItem('italic', isItalic);
  }

  // Reset button click handler
  resetBtn.addEventListener('click', () => {
    editorTextarea.value = '';
    fontFamilySelect.value = '';
    fontWeightSelect.innerHTML = '';
    italicToggleCheckbox.checked = false;
    localStorage.clear();
    applyFontStyles();
  });

  // Save button click handler (for demonstration purposes, you might want to implement server-side saving)
  saveBtn.addEventListener('click', () => {
    alert('Saved locally!');
  });
});
