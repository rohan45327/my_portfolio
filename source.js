// ==========================================
// ROYAL MINIMALIST ENGINE - ROHAN PORTFOLIO
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initThemeSwitcher();
  initCanvas();
  init3DGlobe();
  initCustomCursor();
  initTypingEffect();
  initScrollAnimations();
  initFilters();
  initTerminal();
  initModalsAndLightboxes();
  initCopyButtons();
  initBackToTop();
  updateCurrentYear();
});

// ------------------------------------------
// 1. LIGHT / DARK (AM / PM) THEME SWITCHER
// ------------------------------------------
function initThemeSwitcher() {
  const themeBtn = document.getElementById("theme-switch");
  const savedTheme = localStorage.getItem("theme") || "dark";

  setTheme(savedTheme);

  if (themeBtn) {
    themeBtn.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const nextTheme = currentTheme === "dark" ? "light" : "dark";
      setTheme(nextTheme);
      showToast(`Switched to ${nextTheme.toUpperCase()} mode`);
    });
  }
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  const themeLabel = document.getElementById("theme-label");
  if (themeLabel) {
    themeLabel.textContent = theme === "dark" ? "PM [DARK]" : "AM [LIGHT]";
  }
}

// ------------------------------------------
// 2. CANVAS ENGINE WITH CODE VARIABLE CONSTELLATION
// ------------------------------------------
function initCanvas() {
  const container = document.getElementById("canvas-container");
  if (!container) return;

  const canvas = document.createElement("canvas");
  canvas.id = "particle-canvas";
  container.appendChild(canvas);
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: width / 2, y: height / 2, radius: 130 };

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    initParticles();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  class Particle {
    constructor() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.6;
      this.vy = (Math.random() - 0.5) * 0.6;
      this.size = Math.random() * 2 + 1;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;

      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;

      let dx = mouse.x - this.x;
      let dy = mouse.y - this.y;
      let distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < mouse.radius) {
        let force = (mouse.radius - distance) / mouse.radius;
        this.x -= (dx / distance) * force * 2;
        this.y -= (dy / distance) * force * 2;
      }
    }

    draw() {
      const isDark = document.documentElement.getAttribute("data-theme") !== "light";
      const color = isDark ? "rgba(244, 244, 246, 0.25)" : "rgba(8, 8, 10, 0.2)";

      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    }
  }

  let particles = [];
  function initParticles() {
    particles = [];
    const count = Math.min(Math.floor((width * height) / 16000), 65);
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  initParticles();

  function animate() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    const strokeColor = isDark ? "rgba(244, 244, 246, " : "rgba(8, 8, 10, ";

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();

      for (let j = i + 1; j < particles.length; j++) {
        let dx = particles[i].x - particles[j].x;
        let dy = particles[i].y - particles[j].y;
        let dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `${strokeColor}${0.08 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }
  animate();
}

// ------------------------------------------
// 3. CUSTOM CURSOR
// ------------------------------------------
function initCustomCursor() {
  const cursor = document.getElementById("cursor");
  const follower = document.getElementById("cursor-follower");
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
  });

  function renderFollower() {
    followerX += (mouseX - followerX) * 0.18;
    followerY += (mouseY - followerY) * 0.18;
    follower.style.left = `${followerX}px`;
    follower.style.top = `${followerY}px`;
    requestAnimationFrame(renderFollower);
  }
  renderFollower();

  const hoverables = document.querySelectorAll("a, button, .royal-card, .filter-btn, .theme-switch-btn, .btn-pill-primary, .btn-pill-outline");
  hoverables.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      cursor.classList.add("hovering");
      follower.classList.add("hovering");
    });
    el.addEventListener("mouseleave", () => {
      cursor.classList.remove("hovering");
      follower.classList.remove("hovering");
    });
  });
}

// ------------------------------------------
// 4. HERO TYPING MATRIX
// ------------------------------------------
function initTypingEffect() {
  const typingTextElement = document.getElementById("hero-typing-text");
  if (!typingTextElement) return;

  const phrases = [
    "Full-Stack Software Engineer",
    "AI & Speech Assistant Creator",
    "Data Analytics Explorer",
    "Computer Science CSE Undergrad",
    "Web Scraper & Automation Architect"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];
    if (isDeleting) {
      typingTextElement.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typingTextElement.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      delay = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = 400;
    }

    setTimeout(type, delay);
  }
  setTimeout(type, 500);
}

// ------------------------------------------
// 5. SCROLL OBSERVER & STAT COUNTERS
// ------------------------------------------
function initScrollAnimations() {
  const sections = document.querySelectorAll(".fade-in-section");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");

          const id = entry.target.getAttribute("id");
          if (id) {
            navLinks.forEach((link) => {
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              } else {
                link.classList.remove("active");
              }
            });
          }

          const counters = entry.target.querySelectorAll(".counter");
          counters.forEach(counter => animateCounter(counter));

          const bars = entry.target.querySelectorAll(".progress-bar-fill");
          bars.forEach(bar => {
            const targetWidth = bar.getAttribute("data-width") || "80%";
            bar.style.width = targetWidth;
          });
        }
      });
    },
    { threshold: 0.15 }
  );

  sections.forEach((sec) => observer.observe(sec));

  const header = document.querySelector("header.glass-nav");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
      header?.classList.add("scrolled");
    } else {
      header?.classList.remove("scrolled");
    }
  });
}

function animateCounter(counterEl) {
  if (counterEl.dataset.animated === "true") return;
  counterEl.dataset.animated = "true";

  const target = parseInt(counterEl.getAttribute("data-target") || "0", 10);
  const suffix = counterEl.getAttribute("data-suffix") || "";
  let count = 0;
  const duration = 1400;
  const stepTime = 30;
  const steps = duration / stepTime;
  const increment = target / steps;

  const timer = setInterval(() => {
    count += increment;
    if (count >= target) {
      counterEl.textContent = target + suffix;
      clearInterval(timer);
    } else {
      counterEl.textContent = Math.floor(count) + suffix;
    }
  }, stepTime);
}

// ------------------------------------------
// 6. CATEGORY FILTER TABS
// ------------------------------------------
function initFilters() {
  const projectBtns = document.querySelectorAll(".project-filter-btn");
  const projectCards = document.querySelectorAll(".project-card-item");

  projectBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      projectBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filter === "all" || category.includes(filter)) {
          card.style.display = "block";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "translateY(15px)";
          setTimeout(() => {
            card.style.display = "none";
          }, 250);
        }
      });
    });
  });

  const skillBtns = document.querySelectorAll(".skill-filter-btn");
  const skillCards = document.querySelectorAll(".skill-card-item");

  skillBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      skillBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filter = btn.getAttribute("data-filter");

      skillCards.forEach((card) => {
        const cat = card.getAttribute("data-skill-cat");
        if (filter === "all" || cat === filter) {
          card.style.display = "block";
          setTimeout(() => (card.style.opacity = "1"), 50);
        } else {
          card.style.opacity = "0";
          setTimeout(() => (card.style.display = "none"), 250);
        }
      });
    });
  });
}

// ------------------------------------------
// 7. MODALS & LIGHTBOX
// ------------------------------------------
function initModalsAndLightboxes() {
  const modalBackdrops = document.querySelectorAll(".modal-backdrop");
  modalBackdrops.forEach((backdrop) => {
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) {
        closeAllModals();
      }
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeAllModals();
    }
  });
}

function toggleProjectModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  if (modal.classList.contains("active")) {
    modal.classList.remove("active");
  } else {
    closeAllModals();
    modal.classList.add("active");
  }
}

function openCertLightbox(imgSrc, titleText) {
  const lightbox = document.getElementById("cert-lightbox");
  const img = document.getElementById("lightbox-img");
  const title = document.getElementById("lightbox-title");

  if (lightbox && img) {
    img.src = imgSrc;
    if (title) title.textContent = titleText || "Certification Document";
    lightbox.classList.add("active");
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-backdrop").forEach((m) => m.classList.remove("active"));
  document.querySelectorAll(".lightbox-backdrop").forEach((l) => l.classList.remove("active"));
}

// ------------------------------------------
// 8. INTERACTIVE CLI TERMINAL WIDGET
// ------------------------------------------
function initTerminal() {
  const terminalInput = document.getElementById("terminal-input");
  const terminalBody = document.getElementById("terminal-body");
  if (!terminalInput || !terminalBody) return;

  const commands = {
    help: `Available commands:
  • <span class="text-amber-400">bio</span>      : Learn about Satya Rohan
  • <span class="text-amber-400">skills</span>   : Output core tech stack summary
  • <span class="text-amber-400">projects</span> : List featured engineering projects
  • <span class="text-amber-400">certs</span>    : Display certifications
  • <span class="text-amber-400">contact</span>  : Show direct reach-out options
  • <span class="text-amber-400">hire</span>     : Quick contact callout
  • <span class="text-amber-400">clear</span>    : Clear terminal screen`,
    
    bio: `<span class="text-emerald-400">Kompella Satya Rohan</span> - 2nd Year Computer Science Engineering student. Passionate about building full-stack applications, AI assistants (V.I.R.A), DeepFake image classifiers, and web scrapers.`,

    skills: `<span class="text-cyan-400">Core Engineering Stack:</span>
  • Frontend: HTML5, CSS3, JavaScript, React.js, Tailwind
  • Backend : Python, FastAPI, Flask, SQLAlchemy, PostgreSQL
  • AI & ML : GenAI, Speech Synthesis, Prompt Engineering, Xception Models
  • Tools   : Selenium Scraping, Git/GitHub, Railway, Hugging Face`,

    projects: `<span class="text-amber-400">Featured Projects:</span>
  1. V.I.R.A Speech Assistant (Python/Flask/Railway)
  2. DeepFake Image Classifier (React/FastAPI/Xception)
  3. eCourt Causelist Scraper (Python/Selenium)
  4. Weather Check App (JavaScript/API)`,

    certs: `<span class="text-yellow-400">Certifications:</span>
  • Deloitte Data Analytics Virtual Internship
  • Tata & Forage Data Analyst Experience
  • HackerRank JavaScript Certified
  • Microsoft & LinkedIn AI Tools & Generative AI`,

    contact: `<span class="text-emerald-400">Let's Connect:</span>
  • Email   : chandujoshita47@gmail.com
  • LinkedIn: linkedin.com/in/satya-rohan-kompella-324805318
  • GitHub  : github.com/rohan45327`,

    hire: `<span class="text-amber-400 font-bold">🚀 Available for Internships & Collaborations!</span> Drop a message via the contact form or email directly at chandujoshita47@gmail.com.`
  };

  let commandHistory = [];
  let historyIdx = -1;

  terminalInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const inputVal = terminalInput.value.trim().toLowerCase();
      if (!inputVal) return;

      commandHistory.push(inputVal);
      historyIdx = commandHistory.length;

      appendTerminalLine(`<span class="terminal-prompt">rohan@portfolio:~$</span> ${inputVal}`);

      if (inputVal === "clear") {
        terminalBody.innerHTML = "";
      } else if (commands[inputVal]) {
        appendTerminalLine(commands[inputVal]);
      } else if (inputVal.startsWith("sudo")) {
        appendTerminalLine(`<span class="text-rose-400">Permission granted! Rohan is ready to be hired for your team! 🚀</span>`);
      } else {
        appendTerminalLine(`<span class="text-red-400">Command not found: ${inputVal}. Type <span class="text-amber-300">'help'</span> for available commands.</span>`);
      }

      terminalInput.value = "";
      terminalBody.scrollTop = terminalBody.scrollHeight;
    } else if (e.key === "ArrowUp") {
      if (historyIdx > 0) {
        historyIdx--;
        terminalInput.value = commandHistory[historyIdx];
      }
    } else if (e.key === "ArrowDown") {
      if (historyIdx < commandHistory.length - 1) {
        historyIdx++;
        terminalInput.value = commandHistory[historyIdx];
      } else {
        historyIdx = commandHistory.length;
        terminalInput.value = "";
      }
    }
  });

  function appendTerminalLine(htmlContent) {
    const line = document.createElement("div");
    line.className = "terminal-line";
    line.innerHTML = htmlContent;
    terminalBody.appendChild(line);
  }
}

// ------------------------------------------
// 9. ONE-CLICK COPY & UTILS
// ------------------------------------------
function initCopyButtons() {
  const copyEmailBtn = document.getElementById("copy-email-btn");
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener("click", () => {
      const email = "chandujoshita47@gmail.com";
      navigator.clipboard.writeText(email).then(() => {
        showToast("Email address copied to clipboard!");
      });
    });
  }
}

function showToast(message) {
  let container = document.querySelector(".toast-container");
  if (!container) {
    container = document.createElement("div");
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.innerHTML = `<span>✨</span> <span>${message}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function initBackToTop() {
  const btn = document.getElementById("back-to-top");
  if (!btn) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 400) {
      btn.classList.add("visible");
    } else {
      btn.classList.remove("visible");
    }
  });

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

function updateCurrentYear() {
  const yearEl = document.getElementById("current-year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ------------------------------------------
// 10. INTERACTIVE 3D REVOLVING GLOBE ENGINE
// ------------------------------------------
function init3DGlobe() {
  const canvas = document.getElementById("cmd-globe-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = canvas.parentElement.clientWidth || 600);
  let height = (canvas.height = canvas.parentElement.clientHeight || 600);

  window.addEventListener("resize", () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.clientWidth || 440;
    height = canvas.height = canvas.parentElement.clientHeight || 440;
  });

  const commandsList = [
    "node.js", "npm", "gunicorn", "uvicorn", "linux",
    "sudo", "lsmod", "systemctl", "chmod +x", "grep -rn",
    "git push", "docker", "fastapi", "flask", "python3",
    "react.js", "vite", "sqlalchemy", "postgresql", "huggingface",
    "selenium", "railway", "pip install", "bash", "curl -sL",
    "ssh -i", "journalctl", "htop", "nginx", "redis"
  ];

  const tags = [];
  const N = commandsList.length;
  const R = Math.min(width, height) * 0.38;

  // Fibonacci Sphere 3D distribution
  for (let i = 0; i < N; i++) {
    const phi = Math.acos(-1 + (2 * i + 1) / N);
    const theta = Math.sqrt(N * Math.PI) * phi;
    tags.push({
      text: commandsList[i],
      x: R * Math.cos(theta) * Math.sin(phi),
      y: R * Math.sin(theta) * Math.sin(phi),
      z: R * Math.cos(phi)
    });
  }

  let angleX = 0.0008;
  let angleY = 0.0018;
  let mouseX = 0;
  let mouseY = 0;
  let isDragging = false;
  let lastMouseX = 0;
  let lastMouseY = 0;

  canvas.addEventListener("mousedown", (e) => {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = (e.clientX - rect.left - width / 2) * 0.00003;
    mouseY = (e.clientY - rect.top - height / 2) * 0.00003;

    if (isDragging) {
      const dx = e.clientX - lastMouseX;
      const dy = e.clientY - lastMouseY;
      angleY = dx * 0.0015;
      angleX = -dy * 0.0015;
      lastMouseX = e.clientX;
      lastMouseY = e.clientY;
    }
  });

  function renderGlobe() {
    ctx.clearRect(0, 0, width, height);

    const isDark = document.documentElement.getAttribute("data-theme") !== "light";
    const centerX = width / 2;
    const centerY = height / 2;

    // Draw faint revolving Earth longitude/latitude orbital lines
    ctx.save();
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.06)" : "rgba(8, 8, 10, 0.06)";
    ctx.lineWidth = 1;
    
    // Draw outer atmosphere boundary glow ring
    ctx.beginPath();
    ctx.arc(centerX, centerY, R + 8, 0, Math.PI * 2);
    ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.08)" : "rgba(8, 8, 10, 0.08)";
    ctx.stroke();

    // Equatorial orbital ring
    ctx.beginPath();
    ctx.ellipse(centerX, centerY, R + 4, R * 0.35, Math.PI / 6, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Rotation velocity
    const rotX = angleX + mouseY;
    const rotY = angleY + mouseX;

    // Rotate 3D points
    tags.forEach((tag) => {
      let cosY = Math.cos(rotY);
      let sinY = Math.sin(rotY);
      let x1 = tag.x * cosY - tag.z * sinY;
      let z1 = tag.z * cosY + tag.x * sinY;

      let cosX = Math.cos(rotX);
      let sinX = Math.sin(rotX);
      let y2 = tag.y * cosX - z1 * sinX;
      let z2 = z1 * cosX + tag.y * sinX;

      tag.x = x1;
      tag.y = y2;
      tag.z = z2;
    });

    // Sort by Z for proper 3D depth rendering
    tags.sort((a, b) => a.z - b.z);

    const focalLength = 300;

    tags.forEach((tag) => {
      const scale = focalLength / (focalLength + tag.z + R);
      const projX = centerX + tag.x;
      const projY = centerY + tag.y;

      const alpha = Math.max(0.18, Math.min(1, (tag.z + R) / (2 * R)));
      const fontSize = Math.max(10, Math.min(17, 13 * scale));

      ctx.save();
      ctx.font = `600 ${fontSize}px "Fira Code", monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      if (tag.z > 0) {
        ctx.fillStyle = isDark
          ? `rgba(244, 244, 246, ${alpha})`
          : `rgba(8, 8, 10, ${alpha})`;
        ctx.shadowColor = isDark ? "rgba(255, 255, 255, 0.4)" : "rgba(0, 0, 0, 0.2)";
        ctx.shadowBlur = 6;
      } else {
        ctx.fillStyle = isDark
          ? `rgba(142, 142, 147, ${alpha * 0.65})`
          : `rgba(100, 116, 139, ${alpha * 0.65})`;
      }

      ctx.fillText(tag.text, projX, projY);
      ctx.restore();
    });

    requestAnimationFrame(renderGlobe);
  }

  renderGlobe();
}
