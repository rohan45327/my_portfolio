document.getElementById("current-year").textContent = new Date().getFullYear();
document.addEventListener("DOMContentLoaded", function () {
  const sections = document.querySelectorAll(".fade-in-section");

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.3,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    observer.observe(section);
  });
  const phrases = [
    "Innovate. Design. Develop.",
    "Crafting Digital Experiences.",
    "Bringing Ideas to Life.",
    "Building The Future",
    "Compiling Digital Dreams",
    "Creating Innovations.",
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;
  const deletingSpeed = 50;
  const pauseBeforeDelete = 1500;
  const pauseBeforeTyping = 500;
  const typingTextElement = document.getElementById("hero-typing-text");

  function typeWriter() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
      // Deleting text
      typingTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Typing text
      typingTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
    }

    let typingDelay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentPhrase.length) {
      typingDelay = pauseBeforeDelete;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Finished deleting, move to next phrase
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingDelay = pauseBeforeTyping;
    }

    setTimeout(typeWriter, typingDelay);
  }
  setTimeout(typeWriter, 500);
});
function toggleProjectInfo(infoId) {
  const infoBlock = document.getElementById(infoId);
  if (infoBlock.style.display === "none" || infoBlock.style.display === "") {
    infoBlock.style.display = "flex";
  } else {
    infoBlock.style.display = "none";
  }
}
