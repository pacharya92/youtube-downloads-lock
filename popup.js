document.getElementById('activate').addEventListener('click', () => {
  chrome.storage.local.get(['lockedUntil'], (result) => {
    const now = Date.now()
    if (result.lockedUntil && now < result.lockedUntil) {
      alert('Cleaner is already active. Try again later.')
      return
    }

    const oneHourLater = now + 3600000
    chrome.storage.local.set({ lockedUntil: oneHourLater })

    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => window.dispatchEvent(new Event('activate-cleaner')),
      })
    })
  })
})
