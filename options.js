document.addEventListener('DOMContentLoaded', function () {
    const scanFrequencySelect = document.getElementById('scan-frequency');
    const notificationsCheckbox = document.getElementById('notifications');
    const statusMessage = document.getElementById('status-message');

    // Load saved options
    chrome.storage.sync.get(['scanFrequency', 'notifications'], function (data) {
        scanFrequencySelect.value = data.scanFrequency || '5'; // Default to 5
        notificationsCheckbox.checked = data.notifications || false;
    });

    // Save options
    document.getElementById('save-button').addEventListener('click', function () {
        const scanFrequency = scanFrequencySelect.value;
        const notifications = notificationsCheckbox.checked;

        chrome.storage.sync.set({ scanFrequency, notifications }, function () {
            statusMessage.textContent = 'Options saved!';
            setTimeout(() => {
                statusMessage.textContent = '';
            }, 2000);
        });
    });
});
