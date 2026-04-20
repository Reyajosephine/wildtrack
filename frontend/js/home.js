const slideElements = Array.from(document.querySelectorAll(".slide"));
const dotsContainer = document.getElementById("sliderDots");
const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");

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

}

init();
