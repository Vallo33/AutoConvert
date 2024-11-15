document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    // Load saved state
    chrome.storage.local.get(['isImperial'], function(result) {
      toggleSwitch.checked = result.isImperial || false;
    });
    
    // Save state and trigger conversion when toggle changes
    toggleSwitch.addEventListener('change', function() {
      const isImperial = this.checked;
      chrome.storage.local.set({ isImperial });
      
      // Send message to active tab to trigger conversion
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'toggleUnits',
          isImperial: isImperial
        });
      });
    });
  });