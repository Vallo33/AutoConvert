let currentSettings = {
  speedConversion: 'standard',
  lengthConversion: 'standard',
  areaConversion: 'standard',
  volumeConversion: 'standard'
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'toggleUnits') {
      currentMode = request.isImperial;
      // Update settings if they're included in the message
      if (request.settings) {
          currentSettings = {
              ...currentSettings,
              ...request.settings
          };
      }
      convertPage(currentMode);
      sendResponse({ success: true });
  }
});

// Unit conversion definitions
const UnitSystem = {
  length: {
      base: 'm',
      units: {
          'm': {
              toImperial: x => {
                  switch(currentSettings.lengthConversion) {
                      case 'feet': return { value: x * 3.28084, unit: 'ft' };
                      case 'yards': return { value: x * 1.09361, unit: 'yd' };
                      case 'inches': return { value: x * 39.3701, unit: 'in' };
                      case 'miles': return { value: x * 0.000621371, unit: 'mi' };
                      default: return { value: x * 3.28084, unit: 'ft' }; // standard
                  }
              }
          },
          'km': {
              toImperial: x => {
                  switch(currentSettings.lengthConversion) {
                      case 'feet': return { value: x * 3280.84, unit: 'ft' };
                      case 'yards': return { value: x * 1093.61, unit: 'yd' };
                      case 'inches': return { value: x * 39370.1, unit: 'in' };
                      case 'miles': return { value: x * 0.621371, unit: 'mi' };
                      default: return { value: x * 0.621371, unit: 'mi' }; // standard
                  }
              }
          },
          'cm': {
              toImperial: x => {
                  switch(currentSettings.lengthConversion) {
                      case 'feet': return { value: x * 0.0328084, unit: 'ft' };
                      case 'yards': return { value: x * 0.0109361, unit: 'yd' };
                      case 'inches': return { value: x * 0.393701, unit: 'in' };
                      case 'miles': return { value: x * 0.00000621371, unit: 'mi' };
                      default: return { value: x * 0.393701, unit: 'in' }; // standard
                  }
              }
          },
          'mm': {
              toImperial: x => {
                  switch(currentSettings.lengthConversion) {
                      case 'feet': return { value: x * 0.00328084, unit: 'ft' };
                      case 'yards': return { value: x * 0.00109361, unit: 'yd' };
                      case 'inches': return { value: x * 0.0393701, unit: 'in' };
                      case 'miles': return { value: x * 6.21371e-7, unit: 'mi' };
                      default: return { value: x * 0.0393701, unit: 'in' }; // standard
                  }
              }
          }
      }
  },
  area: {
      base: 'm²',
      units: {
          'm²': {
              toImperial: x => {
                  switch(currentSettings.areaConversion) {
                      case 'feet2': return { value: x * 10.7639, unit: 'ft²' };
                      case 'yards2': return { value: x * 1.19599, unit: 'yd²' };
                      case 'inches2': return { value: x * 1550.0031, unit: 'in²' };
                      default: return { value: x * 10.7639, unit: 'ft²' }; // standard
                  }
              }
          },
          'm2': {
              toImperial: x => {
                  switch(currentSettings.areaConversion) {
                      case 'feet2': return { value: x * 10.7639, unit: 'ft²' };
                      case 'yards2': return { value: x * 1.19599, unit: 'yd²' };
                      case 'inches2': return { value: x * 1550.0031, unit: 'in²' };
                      default: return { value: x * 10.7639, unit: 'ft²' }; // standard
                  }
              }
          },
          'sqm': {
              toImperial: x => {
                  switch(currentSettings.areaConversion) {
                      case 'feet2': return { value: x * 10.7639, unit: 'ft²' };
                      case 'yards2': return { value: x * 1.19599, unit: 'yd²' };
                      case 'inches2': return { value: x * 1550.0031, unit: 'in²' };
                      default: return { value: x * 10.7639, unit: 'sqft' }; // standard
                  }
              }
          },
          'ha': { toImperial: x => ({ value: x * 2.47105, unit: 'acres' }) }, // Keep acres as standard
          'cm²': {
              toImperial: x => {
                  switch(currentSettings.areaConversion) {
                      case 'feet2': return { value: x * 0.00107639, unit: 'ft²' };
                      case 'yards2': return { value: x * 0.000119599, unit: 'yd²' };
                      case 'inches2': return { value: x * 0.155, unit: 'in²' };
                      default: return { value: x * 0.155, unit: 'in²' }; // standard
                  }
              }
          },
          'cm2': {
              toImperial: x => {
                  switch(currentSettings.areaConversion) {
                      case 'feet2': return { value: x * 0.00107639, unit: 'ft²' };
                      case 'yards2': return { value: x * 0.000119599, unit: 'yd²' };
                      case 'inches2': return { value: x * 0.155, unit: 'in²' };
                      default: return { value: x * 0.155, unit: 'in²' }; // standard
                  }
              }
          },
          'mm²': {
              toImperial: x => {
                  switch(currentSettings.areaConversion) {
                      case 'feet2': return { value: x * 0.0000107639, unit: 'ft²' };
                      case 'yards2': return { value: x * 0.00000119599, unit: 'yd²' };
                      case 'inches2': return { value: x * 0.00155, unit: 'in²' };
                      default: return { value: x * 0.00155, unit: 'in²' }; // standard
                  }
              }
          },
          'mm2': {
              toImperial: x => {
                  switch(currentSettings.areaConversion) {
                      case 'feet2': return { value: x * 0.0000107639, unit: 'ft²' };
                      case 'yards2': return { value: x * 0.00000119599, unit: 'yd²' };
                      case 'inches2': return { value: x * 0.00155, unit: 'in²' };
                      default: return { value: x * 0.00155, unit: 'in²' }; // standard
                  }
              }
          }
      }
  },
  volume: {
      base: 'm³',
      units: {
          'm³': {
              toImperial: x => {
                  switch(currentSettings.volumeConversion) {
                      case 'feet3': return { value: x * 35.3147, unit: 'ft³' };
                      case 'yards3': return { value: x * 1.30795, unit: 'yd³' };
                      case 'inches3': return { value: x * 61023.7, unit: 'in³' };
                      case 'gallons': return { value: x * 264.172, unit: 'gal' };
                      default: return { value: x * 35.3147, unit: 'ft³' }; // standard
                  }
              }
          },
          'm3': {
              toImperial: x => {
                  switch(currentSettings.volumeConversion) {
                      case 'feet3': return { value: x * 35.3147, unit: 'ft³' };
                      case 'yards3': return { value: x * 1.30795, unit: 'yd³' };
                      case 'inches3': return { value: x * 61023.7, unit: 'in³' };
                      case 'gallons': return { value: x * 264.172, unit: 'gal' };
                      default: return { value: x * 35.3147, unit: 'ft³' }; // standard
                  }
              }
          },
          'm^3': {
              toImperial: x => {
                  switch(currentSettings.volumeConversion) {
                      case 'feet3': return { value: x * 35.3147, unit: 'ft³' };
                      case 'yards3': return { value: x * 1.30795, unit: 'yd³' };
                      case 'inches3': return { value: x * 61023.7, unit: 'in³' };
                      case 'gallons': return { value: x * 264.172, unit: 'gal' };
                      default: return { value: x * 35.3147, unit: 'ft³' }; // standard
                  }
              }
          },
          'cm³': {
              toImperial: x => {
                  switch(currentSettings.volumeConversion) {
                      case 'feet3': return { value: x * 0.0000353147, unit: 'ft³' };
                      case 'yards3': return { value: x * 0.00000130795, unit: 'yd³' };
                      case 'inches3': return { value: x * 0.061024, unit: 'in³' };
                      case 'gallons': return { value: x * 0.000264172, unit: 'gal' };
                      default: return { value: x * 0.061024, unit: 'in³' }; // standard
                  }
              }
          },
          'cm3': {
              toImperial: x => {
                  switch(currentSettings.volumeConversion) {
                      case 'feet3': return { value: x * 0.0000353147, unit: 'ft³' };
                      case 'yards3': return { value: x * 0.00000130795, unit: 'yd³' };
                      case 'inches3': return { value: x * 0.061024, unit: 'in³' };
                      case 'gallons': return { value: x * 0.000264172, unit: 'gal' };
                      default: return { value: x * 0.061024, unit: 'in³' }; // standard
                  }
              }
          },
          'l': { toImperial: x => ({ value: x * 0.264172, unit: 'gal' }) }, // Keep standard
          'L': { toImperial: x => ({ value: x * 0.264172, unit: 'gal' }) }, // Keep standard
          'ml': { toImperial: x => ({ value: x * 0.033814, unit: 'fl oz' }) } // Keep standard
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
        'm/s': {
            toImperial: x => {
                switch(currentSettings.speedConversion) {
                    case 'mph': return { value: x * 2.23694, unit: 'mph' };
                    case 'ftps': return { value: x * 3.28084, unit: 'ft/s' };
                    case 'knots': return { value: x * 1.94384, unit: 'knots' };
                    default: return { value: x * 2.23694, unit: 'mph' }; // standard
                }
            }
        },
        'km/h': {
            toImperial: x => {
                switch(currentSettings.speedConversion) {
                    case 'mph': return { value: x * 0.621371, unit: 'mph' };
                    case 'ftps': return { value: x * 0.911344, unit: 'ft/s' };
                    case 'knots': return { value: x * 0.539957, unit: 'knots' };
                    default: return { value: x * 0.621371, unit: 'mph' }; // standard
                }
            }
        }
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

function formatNumber(value) {
  // If the absolute value is very small (less than 0.01) and not zero, use scientific notation
  if (Math.abs(value) < 0.01 && value !== 0) {
    // Convert to scientific notation with 2 significant figures
    const exp = Math.floor(Math.log10(Math.abs(value)));
    const mantissa = value / Math.pow(10, exp);
    return `${mantissa.toFixed(1)}e${exp}`;  // Changed from ×10^ to e
  }
  // Otherwise use fixed notation with 2 decimal places
  return value.toFixed(2);
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
      return `${formatNumber(result.value)}${space}${result.unit}`;  // Changed this line
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
