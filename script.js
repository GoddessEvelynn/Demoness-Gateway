// ============================================
// EVELYNN'S GARDEN - JAVASCRIPT
// ============================================

// ============================================
// STATE & CONFIG
// ============================================

let devotion = Number(localStorage.getItem("evelynnDevotion") || 0);
let soundOn = false;

let mouseX = -50;
let mouseY = -50;
let cursorX = -50;
let cursorY = -50;
let lastTrailTime = 0;

// ============================================
// UTILITY FUNCTIONS
// ============================================

function randomFrom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

// ============================================
// INITIALIZE ON DOM READY
// ============================================

function initializeApp() {
  // ============================================
  // DOM ELEMENTS
  // ============================================
  
  const gate = document.getElementById("gate");
  const gateLine = document.getElementById("gateLine");
  const cursor = document.querySelector(".cursor");
  const statusLine = document.getElementById("statusLine");
  const devotionEl = document.getElementById("devotion");
  const ambience = document.getElementById("ambience");
  const soundToggle = document.getElementById("soundToggle");
  const ageGate = document.getElementById("ageGate");

  // ============================================
  // AGE GATE MANAGEMENT
  // ============================================

  const gateLines = [
    "You found the gate.",
    "You were meant to be here.",
    "You took your time.",
    "Curiosity suits you.",
    "The garden noticed you first."
  ];

  const quotes = [
    ""You came looking for a link. How adorable."",
    ""Devotion is prettier when it glows."",
    ""Careful. The garden remembers repeat visitors."",
    ""You may leave whenever you like. The thought will stay.""
  ];

  function enterSite() {
    console.log("enterSite called");
    localStorage.setItem("evelynnAgeVerified", "true");
    ageGate.classList.add("hidden");
  }

  function leaveSite() {
    console.log("leaveSite called");
    window.location.href = "https://www.google.com";
  }

  // Check if user already verified age
  if (localStorage.getItem("evelynnAgeVerified") === "true") {
    ageGate.classList.add("hidden");
  }

  // Initialize gate lines and quotes
  if (gateLine) {
    gateLine.textContent = randomFrom(gateLines);
  }
  const quoteEl = document.getElementById("quote");
  if (quoteEl) {
    quoteEl.textContent = randomFrom(quotes);
  }

  // ============================================
  // GARDEN & CHOICE MANAGEMENT
  // ============================================

  function enterGarden() {
    console.log("enterGarden called");
    gate.classList.add("hidden");
  }

  function updateDevotion() {
    devotionEl.textContent = "Devotion offered: " + devotion;
  }

  function addDevotion() {
    devotion += 1;
    localStorage.setItem("evelynnDevotion", devotion);
    updateDevotion();
  }

  function obey() {
    console.log("obey called");
    document.body.classList.remove("left");
    document.body.classList.add("obeyed");
    statusLine.textContent = "Good choice.";
    addDevotion();
    burstWhispers(window.innerWidth / 2, window.innerHeight / 2, ["good", "closer", "noticed", "devotion"]);
  }

  function leave() {
    console.log("leave called");
    document.body.classList.remove("obeyed");
    document.body.classList.add("left");
    statusLine.textContent = "You'll be back.";
    addDevotion();
    burstWhispers(window.innerWidth / 2, window.innerHeight / 2, ["again", "soon", "remember", "garden"]);
  }

  // Initialize devotion display
  updateDevotion();

  // ============================================
  // AUDIO MANAGEMENT
  // ============================================

  function toggleAmbience() {
    if (!soundOn) {
      ambience.volume = 0.22;

      ambience.play()
        .then(() => {
          soundOn = true;
          soundToggle.textContent = "Sound: On";
        })
        .catch(() => {
          soundOn = false;
          soundToggle.textContent = "Add ambience.mp3";
          statusLine.textContent = "Sound needs an ambience.mp3 file in your repo.";
        });
    } else {
      ambience.pause();
      soundOn = false;
      soundToggle.textContent = "Sound: Off";
    }
  }

  // ============================================
  // CUSTOM CURSOR ANIMATION
  // ============================================

  function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.24;
    cursorY += (mouseY - cursorY) * 0.24;

    if (cursor) {
      cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
    }

    requestAnimationFrame(animateCursor);
  }

  document.addEventListener("mousemove", event => {
    mouseX = event.clientX;
    mouseY = event.clientY;

    // Create trail effect on desktop
    if (window.innerWidth > 650 && event.timeStamp - lastTrailTime > 42) {
      lastTrailTime = event.timeStamp;
      makeTrail(event.clientX, event.clientY);
    }

    // Random whispers on movement (desktop only)
    if (window.innerWidth > 650 && Math.random() > 0.975) {
      makeWhisper(event.clientX + 14, event.clientY + 14, randomFrom([
        "closer", "worthy?", "stay", "noticed", "devotion", "again", "garden"
      ]));
    }
  });

  animateCursor();

  // ============================================
  // WHISPER & TRAIL EFFECTS
  // ============================================

  function makeTrail(x, y) {
    const trail = document.createElement("div");
    trail.className = "trail";
    trail.style.left = x + "px";
    trail.style.top = y + "px";
    document.body.appendChild(trail);
    setTimeout(() => trail.remove(), 520);
  }

  function makeWhisper(x, y, text) {
    const whisper = document.createElement("div");
    whisper.className = "whisper";
    whisper.textContent = text;
    whisper.style.left = x + "px";
    whisper.style.top = y + "px";
    document.body.appendChild(whisper);
    setTimeout(() => whisper.remove(), 1500);
  }

  function burstWhispers(x, y, words) {
    words.forEach((word, index) => {
      setTimeout(() => {
        makeWhisper(
          x + (Math.random() * 180 - 90),
          y + (Math.random() * 120 - 60),
          word
        );
      }, index * 120);
    });
  }

  // ============================================
  // LINK INTERACTIONS
  // ============================================

  document.querySelectorAll(".link").forEach(link => {
    link.addEventListener("mouseenter", () => {
      const rect = link.getBoundingClientRect();
      makeWhisper(rect.left + 20, rect.top - 18, randomFrom([
        "choose", "click it", "don't hesitate", "good choice", "noticed"
      ]));
    });

    link.addEventListener("click", addDevotion);
  });

  // ============================================
  // EVENT LISTENERS FOR DATA-ACTION BUTTONS
  // ============================================

  const actionMap = {
    enterSite,
    leaveSite,
    enterGarden,
    toggleAmbience,
    obey,
    leave
  };

  // Attach event listeners to all buttons with data-action
  document.querySelectorAll("[data-action]").forEach(button => {
    const action = button.getAttribute("data-action");
    if (action && actionMap[action]) {
      button.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(`Action triggered: ${action}`);
        actionMap[action]();
      });
    }
  });
}

// ============================================
// RUN WHEN DOM IS READY
// ============================================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeApp);
} else {
  // DOM is already loaded
  initializeApp();
}