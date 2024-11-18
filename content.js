// Unit conversion definitions
const UnitSystem = {
  length: {
    base: 'm',
    units: {
      'm': { toImperial: x => ({ value: x * 3.28084, unit: 'ft' }) },
      'km': { toImperial: x => ({ value: x * 0.621371, unit: 'mi' }) },
      'cm': { toImperial: x => ({ value: x * 0.393701, unit: 'in' }) },
      'mm': { toImperial: x => ({ value: x * 0.03937, unit: 'in' }) }
    }
  },
  area: {
    base: 'm²',
    units: {
      'm²': { toImperial: x => ({ value: x * 10.7639, unit: 'ft²' }) },
      'm2': { toImperial: x => ({ value: x * 10.7639, unit: 'ft²' }) },
      'sqm': { toImperial: x => ({ value: x * 10.7639, unit: 'sqft' }) },
      'ha': { toImperial: x => ({ value: x * 2.47105, unit: 'acres' }) },
      'cm²': { toImperial: x => ({ value: x * 0.155, unit: 'in²' }) },
      'cm2': { toImperial: x => ({ value: x * 0.155, unit: 'in²' }) },
      'mm²': { toImperial: x => ({ value: x * 0.00155, unit: 'in²' }) },
      'mm2': { toImperial: x => ({ value: x * 0.00155, unit: 'in²' }) }
    }
  },
  volume: {
    base: 'm³',
    units: {
      'm³': { toImperial: x => ({ value: x * 35.3147, unit: 'ft³' }) },
      'm3': { toImperial: x => ({ value: x * 35.3147, unit: 'ft³' }) },
      'm^3': { toImperial: x => ({ value: x * 35.3147, unit: 'ft³' }) },
      'cm³': { toImperial: x => ({ value: x * 0.061024, unit: 'in³' }) },
      'cm3': { toImperial: x => ({ value: x * 0.061024, unit: 'in³' }) },
      'l': { toImperial: x => ({ value: x * 0.264172, unit: 'gal' }) },
      'L': { toImperial: x => ({ value: x * 0.264172, unit: 'gal' }) },
      'ml': { toImperial: x => ({ value: x * 0.033814, unit: 'fl oz' }) }
    }
  },
  mass: {
    base: 'kg',
    units: {
      'kg': { toImperial: x => ({ value: x * 2.20462, unit: 'lbs' }) },
      'g': { toImperial: x => ({ value: x * 0.035274, unit: 'oz' }) },
      'mg': { toImperial: x => ({ value: x * 0.000035274, unit: 'oz' }) },
      't': { toImperial: x => ({ value: x * 1.10231, unit: 'ton' }) }
    }
  },
  temperature: {
    base: '°c',
    units: {
      '°c': { toImperial: x => ({ value: (x * 9) / 5 + 32, unit: '°F' }) },
      'c': { toImperial: x => ({ value: (x * 9) / 5 + 32, unit: '°F' }) } // Handle 'c' without degree symbol
    }
  },
  pressure: {
    base: 'kpa',
    units: {
      'kpa': { toImperial: x => ({ value: x * 0.145038, unit: 'psi' }) },
      'kPa': { toImperial: x => ({ value: x * 0.145038, unit: 'psi' }) },
      'mpa': { toImperial: x => ({ value: x * 145.038, unit: 'psi' }) },
      'MPa': { toImperial: x => ({ value: x * 145.038, unit: 'psi' }) }
    }
  },
  speed: {
    base: 'm/s',
    units: {
      'm/s': { toImperial: x => ({ value: x * 2.23694, unit: 'mph' }) },
      'km/h': { toImperial: x => ({ value: x * 0.621371, unit: 'mph' }) }
    }
  },
  power: {
    base: 'kw',
    units: {
      'kw': { toImperial: x => ({ value: x * 1.34102, unit: 'hp' }) },
      'kW': { toImperial: x => ({ value: x * 1.34102, unit: 'hp' }) }
    }
  },
  energy: {
    base: 'kj',
    units: {
      'kj': { toImperial: x => ({ value: x * 0.947817, unit: 'BTU' }) },
      'kJ': { toImperial: x => ({ value: x * 0.947817, unit: 'BTU' }) },
      'kcal': { toImperial: x => ({ value: x * 3.96567, unit: 'BTU' }) }
    }
  }
};

// Generate unit patterns
const unitPatterns = Object.values(UnitSystem)
  .flatMap(category => Object.keys(category.units))
  .sort((a, b) => b.length - a.length)
  .map(unit => {
    // Escape special characters and handle exponents
    const escapedUnit = unit
      .replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&') // Escape special characters
      .replace(/²/g, '(?:²|2)')
      .replace(/³/g, '(?:³|3)')
      .replace(/°/g, '(?:°)?');
    return escapedUnit;
  });

// Combined regex for all patterns
const combinedRegex = new RegExp(
  `\\b(\\d+(?:[.,]\\d+)?)(\\s*)(${unitPatterns.join('|')})(?!\\w)`,
  'gi'
);

function normalizeUnit(unit) {
  return unit
    .toLowerCase()
    .replace(/(?:\^|\s)?(?:2|²)/g, '2')
    .replace(/(?:\^|\s)?(?:3|³)/g, '3')
    .replace(/°/g, '')
    .trim();
}

function convertValue(value, unit, toImperial) {
  const normalizedUnit = normalizeUnit(unit);
  for (const category of Object.values(UnitSystem)) {
    for (const [unitKey, conversion] of Object.entries(category.units)) {
      const normalizedUnitKey = normalizeUnit(unitKey);
      if (normalizedUnit === normalizedUnitKey) {
        if (toImperial) {
          return conversion.toImperial(value);
        } else {
          return { value, unit: unitKey };
        }
      }
    }
  }
  return null;
}

function convertText(text, toImperial) {
  // Normalize text
  text = text.normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  text = text.replace(/\s+/g, ' ');

  if (!text.match(combinedRegex)) return text;

  return text.replace(combinedRegex, (match, number, space, unit) => {
    const value = parseFloat(number.replace(/,/g, '').trim());
    const result = convertValue(value, unit, toImperial);

    if (result) {
      return `${result.value.toFixed(2)}${space}${result.unit}`;
    }
    return match;
  });
}

const originalContent = new WeakMap();

function processNode(node, toImperial) {
  if (node.nodeType === Node.TEXT_NODE) {
    if (!originalContent.has(node)) {
      originalContent.set(node, node.nodeValue);
    }
    const originalText = originalContent.get(node);
    node.nodeValue = convertText(originalText, toImperial);
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    !['SCRIPT', 'STYLE', 'TEXTAREA'].includes(node.tagName)
  ) {
    Array.from(node.childNodes).forEach(child => processNode(child, toImperial));
  }
}

function convertPage(toImperial) {
  processNode(document.body, toImperial);
}

let currentMode = null;
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (currentMode !== null) {
        processNode(node, currentMode);
      }
    });
  });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleUnits') {
    currentMode = request.isImperial;
    convertPage(currentMode);
    sendResponse({ success: true });
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});
