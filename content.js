// On page load, check if a lock is active and start the cleaner if so
checkLockAndRun()
removeToggleButton()

// Add a global click blocker to catch early clicks during race conditions
addGlobalClickBlocker()

// Also respond to the custom event fired by the popup
window.addEventListener('activate-cleaner', () => {
  checkLockAndRun()
  removeToggleButton()
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
    try {
      const links = document.querySelectorAll('a[href="/account_downloads"]')

      links.forEach((link) => {
        if (!link.dataset.replaced) {
          const replacement = document.createElement('button')
          replacement.textContent = 'Currently blocking changing the download settings'
          replacement.disabled = true

          replacement.style.background = '#ccc'
          replacement.style.border = 'none'
          replacement.style.padding = '8px'
          replacement.style.borderRadius = '4px'
          replacement.style.color = '#000'
          replacement.style.fontSize = '12px'
          replacement.style.cursor = 'not-allowed'
          replacement.style.maxWidth = '240px'
          replacement.dataset.replaced = 'true'

          link.replaceWith(replacement)
        }
      })
    } catch (err) {
      console.warn('Cleaner loop failed:', err)
    }
  }, 2000)

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
      try {
        chrome.storage.local.get(['lockedUntil'], (result) => {
          const now = Date.now()
          if (result.lockedUntil && now < result.lockedUntil) {
            const target = e.target.closest('a[href="/account_downloads"]')
            if (target) {
              e.preventDefault()
              e.stopImmediatePropagation()
              alert('Settings are blocked for 1 hour.')
            }
          }
        })
      } catch (err) {
        // Silently catch the error if the context has been invalidated
        console.warn('Extension context invalidated:', err)
      }
    },
    true
  )
}

function removeToggleButton() {
  const tryRemove = () => {
    const toggleButton = document.getElementById('toggle')
    const toggleBar = document.getElementById('toggleBar')

    if (toggleButton) {
      toggleButton.remove()
      return true
    }
    if (toggleBar) {
      toggleButton.remove()
      return true
    }
    return false
  }

  if (!tryRemove()) {
    const interval = setInterval(() => {
      if (tryRemove()) {
        clearInterval(interval)
      }
    }, 500)

    setTimeout(() => clearInterval(interval), 10000) // stop after 10 seconds
  }
}
