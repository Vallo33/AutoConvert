document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    // Load saved state
    chrome.storage.local.get(['isEnabled'], function(result) {
      toggleSwitch.checked = result.isEnabled || false;
    });
    
    // Save state when toggle changes
    toggleSwitch.addEventListener('change', function() {
      chrome.storage.local.set({ isEnabled: this.checked });
    });
  });