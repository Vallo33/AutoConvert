document.addEventListener('DOMContentLoaded', function() {
  const toggleSwitch = document.getElementById('toggleSwitch');
  const settingsContainer = document.getElementById('settings-container');
  
  // Load saved state
  chrome.storage.local.get(['isImperial', 'unitSettings'], function(result) {
      // Load toggle state
      toggleSwitch.checked = result.isImperial || false;
      
      // Load unit settings
      const settings = result.unitSettings || {
          speedConversion: 'mph'
      };
      
      // Set saved settings values
      document.getElementById('speedConversion').value = settings.speedConversion;
      
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
              speedConversion: document.getElementById('speedConversion').value
          };
          applySettings(settings);
      } else {
          // Send toggle off message
          sendMessageToActiveTab({
              action: 'toggleUnits',
              isImperial: false
          });
      }
  });
  
  // Settings change handlers
  document.getElementById('speedConversion').addEventListener('change', function() {
      if (toggleSwitch.checked) {
          const settings = {
              speedConversion: this.value
          };
          saveAndApplySettings(settings);
      }
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