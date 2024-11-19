
// Toggle switch handler
  document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    const settingsContainer = document.getElementById('settings-container');
    
    // Load saved state
    chrome.storage.local.get(['isImperial', 'unitSettings'], function(result) {
        // Load toggle state
        toggleSwitch.checked = result.isImperial || false;
        
        // Load unit settings with defaults
        const settings = {
            speedConversion: 'mph',
            lengthConversion: 'standard',
            areaConversion: 'standard',
            volumeConversion: 'standard',
            ...result.unitSettings
        };
        
        // Set saved settings values
        document.getElementById('speedConversion').value = settings.speedConversion;
        document.getElementById('lengthConversion').value = settings.lengthConversion;
        document.getElementById('areaConversion').value = settings.areaConversion;
        document.getElementById('volumeConversion').value = settings.volumeConversion;
        
        // Show settings if toggle is on
        settingsContainer.classList.toggle('show', result.isImperial);
        
        // If imperial mode is active, apply current settings
        if (result.isImperial) {
            applySettings(settings);
        }
    });
    
    // Toggle switch handler
    toggleSwitch.addEventListener('change', function() {
        const isImperial = this.checked;
        settingsContainer.classList.toggle('show', isImperial);
        
        // Save toggle state
        chrome.storage.local.set({ isImperial });
        
        if (isImperial) {
            // Get current settings
            const settings = {
                speedConversion: document.getElementById('speedConversion').value,
                lengthConversion: document.getElementById('lengthConversion').value,
                areaConversion: document.getElementById('areaConversion').value,
                volumeConversion: document.getElementById('volumeConversion').value
            };
            applySettings(settings);
        } else {
            sendMessageToActiveTab({
                action: 'toggleUnits',
                isImperial: false
            });
        }
    });
    
    // Add change handlers for all settings
    ['speedConversion', 'lengthConversion', 'areaConversion', 'volumeConversion'].forEach(settingId => {
        document.getElementById(settingId).addEventListener('change', function() {
            if (toggleSwitch.checked) {
                const settings = {
                    speedConversion: document.getElementById('speedConversion').value,
                    lengthConversion: document.getElementById('lengthConversion').value,
                    areaConversion: document.getElementById('areaConversion').value,
                    volumeConversion: document.getElementById('volumeConversion').value
                };
                saveAndApplySettings(settings);
            }
        });
    });
  
  function saveAndApplySettings(settings) {
      chrome.storage.local.set({ unitSettings: settings }, function() {
          applySettings(settings);
      });
  }
  
  function applySettings(settings) {
      sendMessageToActiveTab({
          action: 'toggleUnits',
          isImperial: true,
          settings: settings
      });
  }
  
  function sendMessageToActiveTab(message) {
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, message).catch(() => {
                  // Ignore errors from tabs where content script isn't loaded
              });
          }
      });
  }
});