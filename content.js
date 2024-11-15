// Conversion functions
const conversions = {
    // Length
    'm': {
      to: (val) => ({ value: val * 3.28084, unit: 'ft' }),
      from: (val) => ({ value: val / 3.28084, unit: 'm' })
    },
    'km': {
      to: (val) => ({ value: val * 0.621371, unit: 'mi' }),
      from: (val) => ({ value: val / 0.621371, unit: 'km' })
    },
    'cm': {
      to: (val) => ({ value: val * 0.393701, unit: 'in' }),
      from: (val) => ({ value: val / 0.393701, unit: 'cm' })
    },
    // Area
    'ha': {
      to: (val) => ({ value: val * 2.47105, unit: 'acres' }),
      from: (val) => ({ value: val / 2.47105, unit: 'ha' })
    },
    'm²': {
      to: (val) => ({ value: val * 10.7639, unit: 'ft²' }),
      from: (val) => ({ value: val / 10.7639, unit: 'm²' })
    },
    'sqm': {  // Added sqm conversion
      to: (val) => ({ value: val * 10.7639, unit: 'sqft' }),
      from: (val) => ({ value: val / 10.7639, unit: 'sqm' })
    },
    // Weight
    'kg': {
      to: (val) => ({ value: val * 2.20462, unit: 'lbs' }),
      from: (val) => ({ value: val / 2.20462, unit: 'kg' })
    },
    'g': {
      to: (val) => ({ value: val * 0.035274, unit: 'oz' }),
      from: (val) => ({ value: val / 0.035274, unit: 'g' })
    }
  };
  
  // Regular expression to match numbers followed by units
  const unitRegex = new RegExp(
    `(\\d+(\\.\\d+)?|\\d{1,3}(,\\d{3})*(\\.\\d+)?)(\\s*)(${Object.keys(conversions).join('|')})\\b`,
    'gi'
  );
  
  function convertText(text, toImperial) {
    return text.replace(unitRegex, (match, number, _, __, ___, space, unit) => {
      const value = parseFloat(number.replace(/,/g, ''));
      const converter = conversions[unit.toLowerCase()];
      
      if (converter) {
        const result = toImperial ? converter.to(value) : converter.from(value);
        return `${result.value.toFixed(2)}${space}${result.unit}`;
      }
      return match;
    });
  }
  
  function convertPage(toImperial) {
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      null,
      false
    );
  
    while (walker.nextNode()) {
      const node = walker.currentNode;
      const originalText = node.nodeValue;
      const newText = convertText(originalText, toImperial);
      
      if (originalText !== newText) {
        node.nodeValue = newText;
      }
    }
  }
  
  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'toggleUnits') {
      convertPage(request.isImperial);
    }
  });
  
  // Initial conversion based on stored preference
  chrome.storage.local.get(['isImperial'], function(result) {
    convertPage(result.isImperial || false);
  });