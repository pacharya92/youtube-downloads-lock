const statusEl = document.getElementById('status')
const activateBtn = document.getElementById('activate')

// Check lock status on popup load
chrome.storage.local.get(['lockedUntil'], (result) => {
  updateCountdown(result.lockedUntil)
})

// Button to activate lock
activateBtn.addEventListener('click', () => {
  const now = Date.now()
  const lockedUntil = now + 3600000 // 1 hour from now

  chrome.storage.local.set({ lockedUntil }, () => {
    updateCountdown(lockedUntil)

    // Also activate the content script logic
    chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: () => {
          window.dispatchEvent(new Event('activate-cleaner'))
        },
      })
    })
  })
})

function updateCountdown(lockedUntil) {
  if (!lockedUntil) {
    statusEl.textContent = 'Lock not active.'
    return
  }

  const interval = setInterval(() => {
    const now = Date.now()
    const remaining = lockedUntil - now

    if (remaining <= 0) {
      clearInterval(interval)
      statusEl.textContent = 'Lock not active.'
      return
    }

    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)

    statusEl.textContent = `Lock active: ${minutes}m ${seconds}s remaining`
  }, 1000)
}
