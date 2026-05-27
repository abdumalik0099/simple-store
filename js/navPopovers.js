function resolvePagePath(fileName) {
  const path = (window.location.pathname || "").replace(/\\/g, "/");
  const inHtmlFolder = path.includes("/html/");
  return inHtmlFolder ? `./${fileName}` : `./html/${fileName}`;
}

function getArrayFromStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getCounts() {
  const liked = getArrayFromStorage("liked");
  const cart = getArrayFromStorage("cart");
  return { likedCount: liked.length, cartCount: cart.length };
}

function buildPopover({ kind }) {
  const el = document.createElement("span");
  el.className = "nav-popover";
  el.setAttribute("data-kind", kind);

  const isWishlist = kind === "wishlist";
  const title = isWishlist ? "Wishlist" : "Cart";
  const buttonLabel = isWishlist ? "View Wishlist" : "View Cart";
  const href = resolvePagePath(isWishlist ? "heart.html" : "shop.html");

  el.innerHTML = `
    <span class="nav-popover-title">
      ${title} (<span class="nav-popover-count">0</span>)
    </span>
    <span class="nav-popover-sub">Your ${isWishlist ? "wishlist" : "cart"} is empty</span>
    <a class="nav-popover-btn" href="${href}">${buttonLabel}</a>
  `.trim();

  return el;
}

function updatePopover(el, count) {
  const countEl = el.querySelector(".nav-popover-count");
  const subEl = el.querySelector(".nav-popover-sub");
  if (countEl) countEl.textContent = String(count);
  if (subEl) {
    const kind = el.getAttribute("data-kind");
    if (count === 0) {
      subEl.textContent = `Your ${kind === "wishlist" ? "wishlist" : "cart"} is empty`;
    } else {
      subEl.textContent = `You have ${count} item${count === 1 ? "" : "s"} in your ${kind === "wishlist" ? "wishlist" : "cart"}`;
    }
  }
}

function initOne({ iconEl, kind }) {
  if (!iconEl) return;
  if (iconEl.dataset.navPopoverInit === "1") return;
  iconEl.dataset.navPopoverInit = "1";
  iconEl.classList.add("nav-popover-target");

  const popover = buildPopover({ kind });
  iconEl.appendChild(popover);

  const refresh = () => {
    const counts = getCounts();
    updatePopover(popover, kind === "wishlist" ? counts.likedCount : counts.cartCount);
  };

  refresh();
  iconEl.addEventListener("mouseenter", refresh);
}

export function initNavPopovers() {
  const likeEl = document.getElementById("like");
  const shopEl = document.getElementById("shop");

  initOne({ iconEl: likeEl?.closest("i"), kind: "wishlist" });
  initOne({ iconEl: shopEl?.closest("i"), kind: "cart" });
}
