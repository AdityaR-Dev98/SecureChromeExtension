// popup.js

let currentScanType = "Quick"; // Default scan type
let notificationsEnabled = false;

// Switch between main and options views
document.getElementById('options-button').addEventListener('click', () => {
  document.querySelector('.popup-content').classList.add('hidden');
  document.querySelector('.options-content').classList.remove('hidden');
  document.getElementById('scan-type').textContent = currentScanType;
});

document.getElementById('back-button').addEventListener('click', () => {
  document.querySelector('.options-content').classList.add('hidden');
  document.querySelector('.popup-content').classList.remove('hidden');
});

// Enable Notifications Toggle
document.getElementById('notifications-toggle').addEventListener('change', (event) => {
  notificationsEnabled = event.target.checked;
  if (notificationsEnabled) {
    chrome.permissions.request({ permissions: ['notifications'] }, (granted) => {
      if (granted) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png',
          title: 'Notifications Enabled',
          message: 'You will now receive threat alerts.'
        });
      } else {
        event.target.checked = false; // If permission denied, uncheck
      }
    });
  }
});

// Handle scan option selection
document.querySelectorAll('.scan-option').forEach(button => {
  button.addEventListener('click', (event) => {
    currentScanType = event.target.dataset.scan.charAt(0).toUpperCase() + event.target.dataset.scan.slice(1);
    document.getElementById('scan-type').textContent = currentScanType;
  });
});

// Start scan simulation and update threat history
document.getElementById('scan-button').addEventListener('click', () => {
  const status = document.getElementById('status');
  status.textContent = `Status: Scanning (${currentScanType} Scan)...`;

  setTimeout(() => {
    status.textContent = `Status: ${currentScanType} Scan Complete - No Threats Found!`;
    
    // Simulate adding to Threat History
    const threatHistory = document.getElementById('threat-history');
    const entry = document.createElement('p');
    entry.textContent = `${currentScanType} Scan on ${new Date().toLocaleString()} - No Threats Found`;
    threatHistory.appendChild(entry);

    // Trigger alert if notifications are enabled
    if (notificationsEnabled) {
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icon48.png',
        title: 'Scan Complete',
        message: `Your ${currentScanType} scan found no threats.`
      });
    }
  }, 2000);
});

// Clear Threat History
document.getElementById('clear-history-button').addEventListener('click', () => {
  document.getElementById('threat-history').innerHTML = '<p>No threats detected yet.</p>';
});
