const CHAT_API_URL = "http://127.0.0.1:8000";

const chatLauncher = document.getElementById("chatLauncher");
const chatWidget = document.getElementById("chatWidget");
const chatClose = document.getElementById("chatClose");
const chatMessages = document.getElementById("chatMessages");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const chatSend = document.getElementById("chatSend");
const openChatTriggers = Array.from(document.querySelectorAll(".open-chat-trigger"));

let hasBootMessage = false;
let greetingTimerId = null;

const QUICK_PROMPTS = [
  "Where is the canteen?",
  "Show me safe routes",
  "What animals are in Zone C?"
];

function setupLauncherGreeting() {
  if (!chatLauncher) {
    return;
  }

  if (!chatLauncher.querySelector(".chat-launcher-hello")) {
    const hello = document.createElement("span");
    hello.className = "chat-launcher-hello";
    hello.textContent = "Hello!";
    hello.setAttribute("aria-hidden", "true");
    chatLauncher.appendChild(hello);
  }

  const showGreeting = () => {
    if (chatWidget?.classList.contains("open")) {
      return;
    }

    chatLauncher.classList.add("show-greeting");
    window.setTimeout(() => {
      chatLauncher.classList.remove("show-greeting");
    }, 2800);
  };

  // Show shortly after load, then periodically to keep launcher feeling alive.
  window.setTimeout(showGreeting, 900);

  if (greetingTimerId) {
    window.clearInterval(greetingTimerId);
  }

  greetingTimerId = window.setInterval(showGreeting, 18000);
}

function addTypingIndicator() {
  if (!chatMessages) {
    return null;
  }

  const typing = document.createElement("div");
  typing.className = "chat-bubble bot typing-indicator";
  typing.innerHTML = "<span></span><span></span><span></span>";
  chatMessages.appendChild(typing);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return typing;
}

function sendPromptFromChip(message) {
  if (!chatInput || !chatForm) {
    return;
  }

  chatInput.value = message;
  chatForm.requestSubmit();
}

function renderQuickPrompts() {
  if (!chatMessages) {
    return;
  }

  const row = document.createElement("div");
  row.className = "chat-quick-row";

  QUICK_PROMPTS.forEach((prompt) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "chat-quick-chip";
    button.textContent = prompt;
    button.addEventListener("click", () => sendPromptFromChip(prompt));
    row.appendChild(button);
  });

  chatMessages.appendChild(row);
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
  const response = await fetch(`${CHAT_API_URL}/chat`, {
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

function bindChatForm() {
  if (!chatForm || !chatInput || !chatSend) {
    return;
  }

  if (!hasBootMessage) {
    addChatBubble("Hi! I am your WildTrack assistant. Ask me about animals, routes, safety, or park facilities.", "bot");
    renderQuickPrompts();
    hasBootMessage = true;
  }

  chatForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const message = chatInput.value.trim();
    if (!message) {
      return;
    }

    addChatBubble(message, "user");
    chatInput.value = "";
    chatSend.disabled = true;
    const typingIndicator = addTypingIndicator();

    try {
      const data = await sendChatMessage(message);
      if (typingIndicator) {
        typingIndicator.remove();
      }
      addChatBubble(data.reply || "I could not find an answer right now.", "bot");
    } catch (error) {
      if (typingIndicator) {
        typingIndicator.remove();
      }
      addChatBubble("Assistant is temporarily unavailable. Please try again.", "bot");
      console.error("Chat error:", error);
    } finally {
      chatSend.disabled = false;
      chatInput.focus();
    }
  });
}

function bindLaunchers() {
  if (chatLauncher) {
    chatLauncher.addEventListener("click", () => {
      const isOpen = chatWidget?.classList.contains("open");
      toggleChatWidget(!isOpen);
    });
  }

  if (chatClose) {
    chatClose.addEventListener("click", () => toggleChatWidget(false));
  }

  openChatTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (event) => {
      event.preventDefault();
      toggleChatWidget(true);
    });
  });
}

function initChatWidget() {
  if (!chatLauncher || !chatWidget || !chatForm) {
    return;
  }

  bindLaunchers();
  bindChatForm();
  setupLauncherGreeting();
}

initChatWidget();
