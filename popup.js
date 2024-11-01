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

// Start scan simulation and update threat history
document.getElementById('scan-button').addEventListener('click', () => {
  const status = document.getElementById('status');
  status.textContent = `Status: Scanning (${currentScanType} Scan)...`;

  // Get the current active tab's URL
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const urlToScan = tabs[0].url; // Get the URL of the active tab

    // Make API call to the backend for scanning
    fetch('http://127.0.0.1:8000/scan', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: urlToScan }),
    })
    .then(response => response.json())
    .then(data => {
      // Update status based on the response
      status.textContent = `Status: Scan Complete`; // Update status to indicate scan is complete

      // Simulate adding to Threat History
      const threatHistory = document.getElementById('threat-history');
      const entry = document.createElement('p');
      entry.textContent = `${currentScanType} Scan on ${new Date().toLocaleString()} - URL: ${urlToScan} - Prediction: ${data.prediction === 1 ? 'Malicious' : 'Safe'}`; // Include prediction and indicate status
      threatHistory.appendChild(entry);

      // Trigger alert if notifications are enabled
      if (notificationsEnabled) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icon48.png',
          title: 'Scan Complete',
          message: `Your ${currentScanType} scan has finished. URL: ${urlToScan}, Prediction: ${data.prediction === 1 ? 'Malicious' : 'Safe'}` // Include prediction in notification
        });
      }
    })
    .catch(error => {
      console.error('Error during scan:', error);
      status.textContent = "Status: Error during scanning.";
    });
  });
});

// Clear Threat History
document.getElementById('clear-history-button').addEventListener('click', () => {
  document.getElementById('threat-history').innerHTML = '<p>No threats detected yet.</p>';
});

// Report Threat Button
document.getElementById('report-button').addEventListener('click', () => {
  const description = prompt("Please enter a description for the report:");

  if (description) {
    // Get the current active tab's URL for reporting
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const urlToReport = tabs[0].url; // Assign URL within the callback

      fetch('http://127.0.0.1:8000/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlToReport, description: description }),
      })
      .then(response => response.json())
      .then(data => {
        alert(`Report submitted: ${data.message}`);
      })
      .catch(error => {
        console.error('Error during report submission:', error);
        alert("Error during report submission.");
      });
    });
  } else {
    alert("Description is required to submit a report.");
  }
});