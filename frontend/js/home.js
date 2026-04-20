const API_URL = "http://127.0.0.1:8000";

const slideElements = Array.from(document.querySelectorAll(".slide"));
const dotsContainer = document.getElementById("sliderDots");
const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");

const chatLauncher = document.getElementById("chatLauncher");
const chatWidget = document.getElementById("chatWidget");
const chatClose = document.getElementById("chatClose");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");

let currentSlide = 0;
let autoplayTimer = null;
const AUTOPLAY_MS = 5500;

function renderDots() {
  if (!dotsContainer) {
    return;
  }

  dotsContainer.innerHTML = "";
  slideElements.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "dot";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.addEventListener("click", () => {
      showSlide(index);
      restartAutoplay();
    });
    dotsContainer.appendChild(dot);
  });
}

function updateSlideState() {
  const dots = Array.from(document.querySelectorAll(".dot"));

  slideElements.forEach((slide, index) => {
    const isActive = index === currentSlide;
    slide.classList.toggle("active", isActive);
    slide.setAttribute("aria-hidden", String(!isActive));
  });

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

function showSlide(index) {
  if (slideElements.length === 0) {
    return;
  }

  const total = slideElements.length;
  currentSlide = (index + total) % total;
  updateSlideState();
}

function nextSlide() {
  showSlide(currentSlide + 1);
}

function prevSlide() {
  showSlide(currentSlide - 1);
}

function startAutoplay() {
  autoplayTimer = window.setInterval(nextSlide, AUTOPLAY_MS);
}

function restartAutoplay() {
  window.clearInterval(autoplayTimer);
  startAutoplay();
}

function toggleChatWidget(open) {
  if (!chatWidget || !chatLauncher) {
    return;
  }

  chatWidget.classList.toggle("open", open);
  chatWidget.setAttribute("aria-hidden", String(!open));
  chatLauncher.setAttribute("aria-expanded", String(open));
  chatLauncher.setAttribute("aria-label", open ? "Close chat" : "Open chat");

  if (open && chatInput) {
    chatInput.focus();
  }
}

function addChatBubble(text, type) {
  if (!chatMessages) {
    return;
  }

  const bubble = document.createElement("div");
  bubble.className = `chat-bubble ${type}`;
  bubble.textContent = text;
  chatMessages.appendChild(bubble);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function sendChatMessage(message) {
  const response = await fetch(`${API_URL}/chat`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  return response.json();
}

function bindChat() {
  if (!chatForm || !chatInput || !chatSend) {
    return;
  }

  addChatBubble("Hi! I am your WildTrack assistant. Ask me about animals, routes, safety, or park facilities.", "bot");

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = chatInput.value.trim();
    if (!message) {
      return;
    }

    addChatBubble(message, "user");
    chatInput.value = "";
    chatSend.disabled = true;

    try {
      const data = await sendChatMessage(message);
      addChatBubble(data.reply || "I could not find an answer right now.", "bot");
    } catch (error) {
      addChatBubble("Assistant is temporarily unavailable. Please try again.", "bot");
      console.error("Chat error:", error);
    } finally {
      chatSend.disabled = false;
      chatInput.focus();
    }
  });
}

function init() {
  if (slideElements.length > 0) {
    renderDots();
    updateSlideState();
    startAutoplay();

    if (nextButton) {
      nextButton.addEventListener("click", () => {
        nextSlide();
        restartAutoplay();
      });
    }

    if (prevButton) {
      prevButton.addEventListener("click", () => {
        prevSlide();
        restartAutoplay();
      });
    }

    window.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        nextSlide();
        restartAutoplay();
      }

      if (event.key === "ArrowLeft") {
        prevSlide();
        restartAutoplay();
      }
    });
  }

  if (chatLauncher) {
    chatLauncher.addEventListener("click", () => {
      const isOpen = chatWidget?.classList.contains("open");
      toggleChatWidget(!isOpen);
    });
  }

  if (chatClose) {
    chatClose.addEventListener("click", () => toggleChatWidget(false));
  }

  bindChat();
}

init();
