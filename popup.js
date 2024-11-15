document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    // Load saved state
    chrome.storage.local.get(['isImperial'], function(result) {
      toggleSwitch.checked = result.isImperial || false;
      if (result.isImperial) {
        // Only send message if it's already in imperial mode
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          if (tabs[0]) {
            chrome.tabs.sendMessage(tabs[0].id, {
              action: 'toggleUnits',
              isImperial: true
            }).catch(() => {
              // Ignore errors from tabs where content script isn't loaded
            });
          }
        });
      }
    });
    
    // Save state and trigger conversion when toggle changes
    toggleSwitch.addEventListener('change', function() {
      const isImperial = this.checked;
      chrome.storage.local.set({ isImperial });
      
      // Send message only to active tab
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (tabs[0]) {
          chrome.tabs.sendMessage(tabs[0].id, {
            action: 'toggleUnits',
            isImperial: isImperial
          }).catch(() => {
            // Ignore errors from tabs where content script isn't loaded
          });
        }
      });
    });
  });