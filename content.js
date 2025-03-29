// On page load, check if a lock is active and start the cleaner if so
checkLockAndRun()

// Add a global click blocker to catch early clicks during race conditions
addGlobalClickBlocker()

// Also respond to the custom event fired by the popup
window.addEventListener('activate-cleaner', () => {
  checkLockAndRun()
})

/**
 * Checks if the cleaner is locked for the current time.
 * If yes, starts the DOM manipulation loop to replace settings buttons.
 */
function checkLockAndRun() {
  chrome.storage.local.get(['lockedUntil'], (result) => {
    const now = Date.now()
    if (result.lockedUntil && now < result.lockedUntil) {
      startCleaner()
    }
  })
}

/**
 * Main logic for replacing the "Downloads Settings" buttons.
 * This runs on a loop to handle dynamic content changes on the YouTube page.
 */
function startCleaner() {
  const interval = setInterval(() => {
    // Select all anchor tags that link to the Downloads Settings page
    const links = document.querySelectorAll('a[href="/account_downloads"]')

    links.forEach((link) => {
      // Avoid replacing the same link multiple times
      if (!link.dataset.replaced) {
        // Create a disabled button with a lock message
        const replacement = document.createElement('button')
        replacement.textContent = 'Currently blocking changing the download settings'
        replacement.disabled = true

        // Apply minimal YouTube-style button styling
        replacement.style.background = '#ccc'
        replacement.style.border = 'none'
        replacement.style.padding = '8px'
        replacement.style.borderRadius = '4px'
        replacement.style.color = '#000'
        replacement.style.fontSize = '12px'
        replacement.style.cursor = 'not-allowed'
        replacement.style.maxWidth = '240px'

        // Mark it as replaced so we don’t touch it again
        replacement.dataset.replaced = 'true'

        // Replace the original <a> link with our custom button
        link.replaceWith(replacement)
      }
    })
  }, 2000) // Re-run every 2 seconds in case YouTube re-renders the DOM

  // Optional: stop checking after 1 hour
  setTimeout(() => clearInterval(interval), 3600000)
}

/**
 * Prevents any click on the Downloads Settings link during the lock period.
 * This avoids race conditions where users click before the DOM changes.
 */
function addGlobalClickBlocker() {
  // Use capture phase to intercept clicks before YouTube handles them
  document.addEventListener(
    'click',
    (e) => {
      chrome.storage.local.get(['lockedUntil'], (result) => {
        const now = Date.now()
        if (result.lockedUntil && now < result.lockedUntil) {
          // Check if the click target or one of its parents is the settings link
          const target = e.target.closest('a[href="/account_downloads"]')
          if (target) {
            // Stop the navigation before it happens
            e.preventDefault()
            e.stopImmediatePropagation()

            // Optional user feedback
            alert('Settings are blocked for 1 hour.')
          }
        }
      })
    },
    true
  ) // Capture phase is crucial here
}
