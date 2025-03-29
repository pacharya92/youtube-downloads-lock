// Required for service worker background in manifest V3
chrome.runtime.onInstalled.addListener(() => {
  console.log('YouTube Download Page Lockdown Cleaner Extension Installed')
})
