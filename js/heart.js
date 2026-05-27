import initHeartRedirect from "./heartRedirect.js";
import { initTheme } from "./theme.js";
import initSingleRedirect from "./singleRedirect.js";
import { footerF } from "./footer.js";
import { initNavPopovers } from "./navPopovers.js";



initTheme();
initHeartRedirect();
initSingleRedirect({ pagePath: "./single.html" });
footerF();
initNavPopovers();






// LocalStorage'dan ma'lumotlarni yuklab olish
let likedProducts = JSON.parse(localStorage.getItem("liked")) || [];
const container = document.querySelector(".container");

// Sarlavha va navbarni yangilash funksiyasi
function updateNavbarAndHeader() {
  const likeEl = document.getElementById("like");
  const wishlistCountEl = document.getElementById("wishlist-count");

  // Navbar raqamini yangilash
  if (likeEl) {
    likeEl.innerText = likedProducts.length;
    likeEl.style.display = likedProducts.length > 0 ? "flex" : "none";
  }

  // Sarlavhadagi "2 items" matnini yangilash
  if (wishlistCountEl) {
    if (likedProducts.length > 0) {
      wishlistCountEl.innerText = `(${likedProducts.length} items)`;
      wishlistCountEl.style.display = "inline";
    } else {
      wishlistCountEl.innerText = "";
      wishlistCountEl.style.display = "none";
    }
  }
}

// Boshlang'ich yangilash
updateNavbarAndHeader();

// Mahsulotlarni ekranga chiqarish
function renderLikedProducts() {
  container.innerHTML = ""; 

  if (likedProducts.length === 0) {
    container.innerHTML = `<h2 style="color:var(--app-muted); text-align:center; margin-top:50px;">Layk bosilganlar yo'q</h2>`;
    return;
  }

  likedProducts.forEach((product) => {
    const { id, image, title, price } = product;

    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="image-container">
        <img src="${image}" alt="${title}">
        <button class="heart-btn" data-id="${id}">
          <i class="ri-poker-hearts-fill"></i>
        </button>
        <div class="overlay">
          <button class="action-btn eye-btn" data-id="${id}">
            <i class="ri-eye-line"></i>
          </button>
        </div>
      </div>
      <div class="card-info">
        <h3 class="card-title">${title.length > 35 ? title.slice(0, 35) + "..." : title}</h3>
        <span class="card-price">$${price.toFixed(2)}</span>
        
        <div class="card-action-buttons">
          <button class="add-to-cart-btn-main">
            <i class="ri-shopping-cart-line"></i> Add to Cart
          </button>
          <button class="cart-remove-btn" data-id="${id}">
            <i class="ri-delete-bin-line"></i>
          </button>
        </div>
      </div>
    `;

    // O'chirish (Wishlistdan) va sahifani yangilash
    card.querySelector(".cart-remove-btn").addEventListener("click", () => {
      likedProducts = likedProducts.filter((p) => p.id !== id);
      localStorage.setItem("liked", JSON.stringify(likedProducts));
      renderLikedProducts(); 
      updateNavbarAndHeader(); // Endi sarlavha ham yangilanadi
    });

    container.appendChild(card);
  });
}

renderLikedProducts();



























