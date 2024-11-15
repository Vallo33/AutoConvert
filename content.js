// Store original text and values
const originalContent = new WeakMap();

// Conversion functions
const conversions = {
  // Length
  'm': {
    toImperial: (val) => ({ value: val * 3.28084, unit: 'ft' }),
    toMetric: (val) => ({ value: val, unit: 'm' })
  },
  'km': {
    toImperial: (val) => ({ value: val * 0.621371, unit: 'mi' }),
    toMetric: (val) => ({ value: val, unit: 'km' })
  },
  'cm': {
    toImperial: (val) => ({ value: val * 0.393701, unit: 'in' }),
    toMetric: (val) => ({ value: val, unit: 'cm' })
  },
  // Area
  'ha': {
    toImperial: (val) => ({ value: val * 2.47105, unit: 'acres' }),
    toMetric: (val) => ({ value: val, unit: 'ha' })
  },
  'm²': {
    toImperial: (val) => ({ value: val * 10.7639, unit: 'ft²' }),
    toMetric: (val) => ({ value: val, unit: 'm²' })
  },
  'sqm': {
    toImperial: (val) => ({ value: val * 10.7639, unit: 'sqft' }),
    toMetric: (val) => ({ value: val, unit: 'sqm' })
  },
  // Weight
  'kg': {
    toImperial: (val) => ({ value: val * 2.20462, unit: 'lbs' }),
    toMetric: (val) => ({ value: val, unit: 'kg' })
  },
  'g': {
    toImperial: (val) => ({ value: val * 0.035274, unit: 'oz' }),
    toMetric: (val) => ({ value: val, unit: 'g' })
  }
};

// Regular expression to match numbers followed by units
const unitRegex = new RegExp(
  `(\\d+(\\.\\d+)?|\\d{1,3}(,\\d{3})*(\\.\\d+)?)(\\s*)(${Object.keys(conversions).join('|')})\\b`,
  'gi'
);

function convertText(text, toImperial) {
  if (!text.match(unitRegex)) return text;
  
  return text.replace(unitRegex, (match, number, _, __, ___, space, unit) => {
    const value = parseFloat(number.replace(/,/g, ''));
    const converter = conversions[unit.toLowerCase()];
    
    if (converter) {
      const result = toImperial ? converter.toImperial(value) : converter.toMetric(value);
      return `${result.value.toFixed(2)}${space}${result.unit}`;
    }
    return match;
  });
}

function processNode(node, toImperial) {
  if (node.nodeType === Node.TEXT_NODE) {
    // Store original content if not already stored
    if (!originalContent.has(node)) {
      originalContent.set(node, node.nodeValue);
    }
    
    // Always use original content for conversion
    const originalText = originalContent.get(node);
    node.nodeValue = convertText(originalText, toImperial);
  } else if (node.nodeType === Node.ELEMENT_NODE && 
             !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName)) {
    Array.from(node.childNodes).forEach(child => processNode(child, toImperial));
  }
}

function convertPage(toImperial) {
  processNode(document.body, toImperial);
}

// Set up MutationObserver to watch for DOM changes
let currentMode = null; // Start as null to prevent initial conversion
const observer = new MutationObserver((mutations) => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (currentMode !== null) { // Only convert if mode has been set by toggle
        processNode(node, currentMode);
      }
    });
  });
});

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleUnits') {
    currentMode = request.isImperial;
    convertPage(currentMode);
    sendResponse({success: true});
  }
});

// Initialize observer but don't convert initially
observer.observe(document.body, {
  childList: true,
  subtree: true
});