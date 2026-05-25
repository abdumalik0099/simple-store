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
          <h2>Store</h2>
          <p>Home</p>
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
