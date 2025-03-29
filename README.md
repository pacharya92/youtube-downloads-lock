# YouTube Downloads Lock 🔒📵

This Chrome extension is a **companion productivity tool** designed to work alongside other applications and extensions to help **reclaim your time** and **cut down on endless scrolling**.

- Works best when paired with:
  - App timers like FocusMe / Freedom / StayFocusd
  - Host file edits
  - Screen time tracking

## 🧠 What It Does

This extension **removes the “Downloads Settings” button** from the YouTube Downloads page:

📍 `https://www.youtube.com/feed/downloads`

By doing this, it **prevents the user from changing or engaging YouTube’s automatic download features**, helping you stay intentional with the content you've chosen to download.

It doesn't block YouTube entirely — it simply ensures you're only accessing the **videos you've explicitly downloaded**, not falling into the algorithm's trap of infinite content.

## 🔐 How It Works

- When activated, the extension:
  - Replaces the “Downloads Settings” button with a disabled message.
  - Blocks clicks (even immediately after a page reload) for **1 full hour**.
  - Prevents race conditions by intercepting fast clicks at the browser level.
  - Continues monitoring the page in case YouTube re-renders dynamic elements.

This makes the lock **strong**, **persistent**, and **race-proof**.

## 💡 Why Use This?

You're not alone. Like many of us, you've probably found yourself stuck in a loop:

- "I'll just check one thing..."
- ...an hour later, you're down a rabbit hole of content you never meant to watch.

This extension helps you **create intentional boundaries**.

> 💬 _“In conjunction with other apps, we're regaining our day and our productivity back!”_

This extension plays a small but mighty role in your larger system of digital self-discipline.

## ✅ Requirements

- Google Chrome
- Only affects `https://www.youtube.com/feed/downloads`

## 🚀 Installation

1. Clone or download this repository.
2. Visit `chrome://extensions`
3. Enable **Developer Mode**.
4. Click **“Load Unpacked”** and select the extension folder.

## 🛠 Features Coming Soon (maybe 😉)

- ~~Visual countdown timer on the blocked button~~
- Badge icon for lock state
- Stronger enforcement using MutationObserver
- Optional auto-refresh when the lock expires

---

**Stay focused. Own your day. One blocked button at a time.**

🧠💪📵
