const THEME_KEY = "theme";

const LIGHT_THEME = { bg: "#f8fafc", text: "#0f172a", isLight: true };
const DARK_THEME = { bg: "#050b14", text: "#ffffff", isLight: false };

function getSystemTheme() {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)")?.matches;
  return prefersDark ? DARK_THEME : LIGHT_THEME;
}

function resolveTheme(theme) {
  if (theme === "light") return LIGHT_THEME;
  if (theme === "dark") return DARK_THEME;
  return getSystemTheme();
}

let lightMeteorTimeout;
let lightExplosionTimeout;
let lightCleanupTimeout;
let darkApplyTimeout;
let darkCleanupTimeout;

function clearPendingThemeAnimations() {
  clearTimeout(lightMeteorTimeout);
  clearTimeout(lightExplosionTimeout);
  clearTimeout(lightCleanupTimeout);
  clearTimeout(darkApplyTimeout);
  clearTimeout(darkCleanupTimeout);

  document.querySelectorAll(".space-overlay").forEach((el) => el.remove());
  document.documentElement.classList.remove("dark-galaxy-spin");
}

function applyThemeStyles(bg, text, isLight) {
  const animationStyle =
    "background-color 0.4s ease, color 0.4s ease, border-color 0.4s ease";

  document.body.style.setProperty("transition", animationStyle, "important");
  document.body.style.setProperty("background-color", bg, "important");
  document.body.style.setProperty("color", text, "important");

  // Global CSS variables for page-level components (single page, tabs, buttons, etc.)
  document.documentElement.style.setProperty(
    "--app-surface",
    isLight ? "#ffffff" : "#0b132a",
  );
  document.documentElement.style.setProperty(
    "--app-surface-2",
    isLight ? "#f1f5f9" : "#0f172a",
  );
  document.documentElement.style.setProperty(
    "--app-border",
    isLight ? "#e2e8f0" : "#1e293b",
  );
  document.documentElement.style.setProperty(
    "--app-muted",
    isLight ? "#64748b" : "#94a3b8",
  );
  document.documentElement.style.setProperty("--app-primary", "#2563eb");
  document.documentElement.style.setProperty("--app-primary-hover", "#1d4ed8");

  const texts = document.querySelectorAll(
    ".texts p, .texts h2, .icons i, .flex, .oneText h1, .search, .div2, .div2 input",
  );
  texts.forEach((el) => {
    el.style.setProperty("transition", animationStyle, "important");
    el.style.setProperty("color", text, "important");
  });

  const hoverElements = document.querySelectorAll(".icons i, .flex");
  hoverElements.forEach((el) => {
    el.style.setProperty(
      "transition",
      "background-color 0.2s ease, color 0.2s ease",
      "important",
    );
  });

  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    card.style.setProperty("transition", animationStyle, "important");
    if (isLight) {
      card.style.setProperty("background-color", "#ffffff", "important");
      card.style.setProperty("border-color", "#e2e8f0", "important");
      card
        .querySelectorAll(".card-title, .card-price")
        .forEach((el) => el.style.setProperty("color", "#0f172a", "important"));
    } else {
      card.style.setProperty("background-color", "#0b132a", "important");
      card.style.setProperty("border-color", "#1e293b", "important");
      card
        .querySelectorAll(".card-title, .card-price")
        .forEach((el) => el.style.setProperty("color", "#ffffff", "important"));
    }
  });

  const mediaBg = isLight ? "#ffffff" : "#050b14";
  document.querySelectorAll(".image-container").forEach((el) => {
    el.style.setProperty("background-color", mediaBg, "important");
  });
  document.querySelectorAll(".image-container img").forEach((el) => {
    el.style.setProperty("background-color", mediaBg, "important");
  });

  const inpDiv = document.querySelector(".inp");
  if (inpDiv) {
    inpDiv.style.setProperty(
      "border",
      isLight ? "1px solid #cbd5e1" : "1px solid #1e293b",
      "important",
    );
  }

  const filterBtn = document.querySelector(".filter");
  if (filterBtn) {
    filterBtn.style.setProperty(
      "border",
      isLight ? "1px solid #cbd5e1" : "1px solid #1e293b",
      "important",
    );
    filterBtn.style.setProperty("color", isLight ? "#0f172a" : "#ffffff", "important");
  }

  const themeDropdown = document.getElementById("themeDropdown");
  if (themeDropdown) {
    themeDropdown.style.setProperty("background", isLight ? "#ffffff" : "#0b132a", "important");
    themeDropdown.style.setProperty(
      "border",
      isLight ? "1px solid #e2e8f0" : "1px solid #1e293b",
      "important",
    );
    themeDropdown.querySelectorAll(".dropdown-item").forEach((item) => {
      item.style.setProperty("color", isLight ? "#0f172a" : "#ffffff", "important");
    });
  }

  hoverElements.forEach((el) => {
    el.onmouseenter = () => {
      el.style.setProperty(
        "background-color",
        isLight ? "#e2e8f0" : "#1e293b",
        "important",
      );
      el.style.setProperty("color", isLight ? "#0f172a" : "#ffffff", "important");
    };
    el.onmouseleave = () => {
      el.style.setProperty("background-color", "transparent", "important");
      el.style.setProperty("color", text, "important");
    };
  });
}

function animateThemeChange(bg, text, isLight) {
  clearPendingThemeAnimations();

  if (isLight) {
    const spaceOverlay = document.createElement("div");
    spaceOverlay.className = "space-overlay";

    const meteorite = document.createElement("div");
    meteorite.className = "cinematic-meteorite";

    spaceOverlay.appendChild(meteorite);
    document.body.appendChild(spaceOverlay);

    lightMeteorTimeout = setTimeout(() => {
      meteorite.style.display = "none";

      const explosion = document.createElement("div");
      explosion.className = "cosmic-explosion";
      spaceOverlay.appendChild(explosion);

      lightExplosionTimeout = setTimeout(() => {
        applyThemeStyles(bg, text, true);
        spaceOverlay.style.backgroundColor = bg;
        explosion.remove();

        lightCleanupTimeout = setTimeout(() => {
          spaceOverlay.style.opacity = "0";
          setTimeout(() => spaceOverlay.remove(), 500);
        }, 200);
      }, 250);
    }, 550);
    return;
  }

  document.documentElement.classList.add("dark-galaxy-spin");

  darkApplyTimeout = setTimeout(() => {
    applyThemeStyles(bg, text, false);
  }, 1250);

  darkCleanupTimeout = setTimeout(() => {
    document.documentElement.classList.remove("dark-galaxy-spin");
  }, 2500);
}

function closeDropdown() {
  document.getElementById("themeDropdown")?.classList.remove("show");
}

export function initTheme({ defaultTheme = "dark", animateOnLoad = false } = {}) {
  const themeBtn = document.getElementById("themeBtn");
  const themeDropdown = document.getElementById("themeDropdown");
  const lightMode = document.getElementById("lightMode");
  const darkMode = document.getElementById("darkMode");
  const systemMode = document.getElementById("systemMode");

  let currentResolvedTheme = resolveTheme(
    localStorage.getItem(THEME_KEY) || defaultTheme,
  );

  const applyResolved = (resolved, { animate = true } = {}) => {
    if (animate) animateThemeChange(resolved.bg, resolved.text, resolved.isLight);
    else applyThemeStyles(resolved.bg, resolved.text, resolved.isLight);
  };

  const refreshThemeStyles = () => {
    applyResolved(currentResolvedTheme, { animate: false });
  };

  const setTheme = (theme, { animate = true, persist = true } = {}) => {
    if (persist) localStorage.setItem(THEME_KEY, theme);
    currentResolvedTheme = resolveTheme(theme);
    applyResolved(currentResolvedTheme, { animate });
  };

  if (themeBtn && themeDropdown) {
    themeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      themeDropdown.classList.toggle("show");
    });

    document.addEventListener("click", () => {
      themeDropdown.classList.remove("show");
    });
  }

  lightMode?.addEventListener("click", () => {
    setTheme("light", { animate: true, persist: true });
    closeDropdown();
  });
  darkMode?.addEventListener("click", () => {
    setTheme("dark", { animate: true, persist: true });
    closeDropdown();
  });
  systemMode?.addEventListener("click", () => {
    setTheme("system", { animate: true, persist: true });
    closeDropdown();
  });

  const savedTheme = localStorage.getItem(THEME_KEY) || defaultTheme;
  setTheme(savedTheme, { animate: animateOnLoad, persist: false });

  const mql = window.matchMedia?.("(prefers-color-scheme: dark)");
  const onSystemChange = () => {
    const current = localStorage.getItem(THEME_KEY) || defaultTheme;
    if (current === "system") setTheme("system", { animate: false, persist: false });
  };

  if (mql?.addEventListener) mql.addEventListener("change", onSystemChange);
  else if (mql?.addListener) mql.addListener(onSystemChange);

  if (typeof MutationObserver !== "undefined") {
    let refreshScheduled = false;
    const scheduleRefresh = () => {
      if (refreshScheduled) return;
      refreshScheduled = true;
      queueMicrotask(() => {
        refreshScheduled = false;
        refreshThemeStyles();
      });
    };

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node?.nodeType !== 1) continue;
          const element = node;
          if (
            element.classList?.contains("card") ||
            element.querySelector?.(".card")
          ) {
            scheduleRefresh();
            return;
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  return { setTheme, refreshThemeStyles };
}



export function navbarF(container) {
  const navbarEl =
    container ||
    document.getElementById("navbar") ||
    document.getElementById("navbarr");

  if (!navbarEl) return null;

  const nav = document.createElement("div");
  nav.classList.add("nav", "container1");
  nav.innerHTML = `
  <div class="texts">
          <h2 class="logo" onclick="window.location.href='../index.html'" style="cursor: pointer;">Store</h2>
          <p onclick="window.location.href='../index.html'">Home</p>
          <p>Products</p>
          <p>Categories</p>
        </div>
        <div class="icons">
          <div class="theme-switcher" style="position: relative">
            <i class="ri-sun-line" id="themeBtn" style="cursor: pointer"></i>
            <div class="dropdown-menu" id="themeDropdown">
              <div class="dropdown-item" id="lightMode">Light</div>
              <div class="dropdown-item" id="darkMode">Dark</div>
              <div class="dropdown-item" id="systemMode">System</div>
            </div>
          </div>

          <i class="ri-heart-line" id="navHeart"><p id="like">0</p></i>
          <i class="ri-shopping-cart-line" id="navShop"><p id="shop">0</p></i>
          <div class="flex"><i class="ri-user-line"></i>Login</div>
        </div>`
        
  navbarEl.appendChild(nav);
  return nav;
}

export function modal() {
  const btn = document.querySelector(".flex"); // Sizning asl tugmangiz
  const container = document.querySelector(".container");
  const searchDiv = document.querySelector(".search");
  const modalDiv = document.querySelector(".modal");
  const oneText = document.querySelector(".oneTextt");
  const savedEmail = localStorage.getItem("userEmail");

  // 1. Agar foydalanuvchi kirgan bo'lsa, tugmani yashirib, avatar qo'yamiz
  if (savedEmail && btn) {
    btn.style.display = "none"; // Asl tugmani yashiramiz
    const avatar = document.createElement("div");
    avatar.textContent = savedEmail[0].toUpperCase();
    avatar.style.cssText = "width: 40px; height: 40px; background: #2563eb; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; font-weight: bold; margin-left: 10px;";
    
    // Avatarni tugmaning ota elementi ichiga qo'shamiz
    btn.parentNode.appendChild(avatar);

    // Avatar bosilsa tizimdan chiqish
    avatar.addEventListener("click", () => {
      localStorage.removeItem("userEmail");
      location.reload();
    });
  }

  // 2. Agar elementlar yo'q bo'lsa, funksiyani to'xtatamiz
  if (!btn || !container || !searchDiv || !modalDiv || !oneText) return;

  // 3. Login hodisasi (faqat btn bo'lsa ishlaydi)
  btn.addEventListener("click", () => {
    container.style.display = "none";
    searchDiv.style.display = "none";
    modalDiv.style.display = "flex";
    oneText.textContent = "< Orqaga";
    
    modalDiv.innerHTML = `
      <div class="login-card">
        <h2>Login</h2>
        <p>Enter your email to continue</p>
        <label>Email</label>
        <input type="email" id="userEmail" placeholder="your@email.com">
        <label>Password</label>
        <input type="password" placeholder="********">
        <button id="loginBtn">Login</button>
      </div>
    `;

    document.getElementById("loginBtn").addEventListener("click", () => {
      const email = document.getElementById("userEmail").value;
      if (email) {
        localStorage.setItem("userEmail", email);
        location.reload();
      }
    });
  });

  // 4. Orqaga qaytish
  oneText.addEventListener("click", () => {
    container.style.display = "";
    searchDiv.style.display = "";
    modalDiv.style.display = "none";
    oneText.textContent = "Online Store";
  });
}

// Funksiyani ishga tushiramiz
modal();