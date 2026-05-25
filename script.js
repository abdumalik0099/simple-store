import { initTheme } from "./js/theme.js";
import initSingleRedirect from "./js/singleRedirect.js";
import { footerF } from "./js/footer.js";

const container = document.querySelector(".container");
let likedProducts = JSON.parse(localStorage.getItem("liked")) || [];
let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];

function updateNavbar() {
  const likeEl = document.getElementById("like");
  const shopEl = document.getElementById("shop");

  if (likeEl) {
    likeEl.innerText = likedProducts.length;
    likeEl.style.display = likedProducts.length > 0 ? "flex" : "none";
  }

  if (shopEl) {
    shopEl.innerText = cartProducts.length;
    shopEl.style.display = cartProducts.length > 0 ? "flex" : "none";
  }
}

updateNavbar();
initTheme({ defaultTheme: "dark", animateOnLoad: false });
initSingleRedirect({ pagePath: "./html/single.html" });
footerF();

fetch("https://fakestoreapi.com/products")
  .then((res) => res.json())
  .then((data) => {
    if (!container) return;

    data.forEach((product) => {
      const { id, image, title, price, description } = product;

      const isLiked = likedProducts.some((p) => p.id === id);
      const isAddedToCart = cartProducts.some((p) => p.id === id);

      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <div class="image-container">
          <img src="${image}" alt="${title}">
          <button class="heart-btn" data-id="${id}">
            <i class="${isLiked ? "ri-poker-hearts-fill" : "ri-heart-line"}"></i>
          </button>
          <div class="overlay">
            <button class="action-btn eye-btn" data-id="${id}">
              <i class="ri-eye-line"></i>
            </button>
            <button class="action-btn cart-add-btn" data-id="${id}">
              <i class="${isAddedToCart ? "ri-check-double-line" : "ri-shopping-cart-line"}"></i>
            </button>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-title">${title.length > 35 ? title.slice(0, 35) + "..." : title}</h3>
          <p class="card-desc">${description.length > 90 ? description.slice(0, 90) + "..." : description}</p>
          <span class="card-price">$${price.toFixed(2)}</span>
          <button class="add-to-cart-btn">Add to Cart</button>
        </div>
      `;

      const heartBtn = card.querySelector(".heart-btn");
      heartBtn.addEventListener("click", () => {
        const index = likedProducts.findIndex((p) => p.id === id);

        if (index === -1) {
          likedProducts.push(product);
          heartBtn.querySelector("i").className = "ri-poker-hearts-fill";
        } else {
          likedProducts.splice(index, 1);
          heartBtn.querySelector("i").className = "ri-heart-line";
        }

        localStorage.setItem("liked", JSON.stringify(likedProducts));
        updateNavbar();
      });

      const cartAddBtn = card.querySelector(".cart-add-btn");
      cartAddBtn.addEventListener("click", () => {
        const index = cartProducts.findIndex((p) => p.id === id);

        if (index === -1) {
          cartProducts.push(product);
          cartAddBtn.querySelector("i").className = "ri-check-double-line";
        } else {
          cartProducts.splice(index, 1);
          cartAddBtn.querySelector("i").className = "ri-shopping-cart-line";
        }

        localStorage.setItem("cart", JSON.stringify(cartProducts));
        updateNavbar();
      });

      container.appendChild(card);
    });
  });

// -----------------------------------                    -----------------------------------
// -----------------------------------  input js kodi     -----------------------------------
// -----------------------------------                    -----------------------------------
const input = document.querySelector(".inputt");
const inpDiv = document.querySelector(".inp");

if (input && inpDiv) {
  input.addEventListener("focus", () => {
    inpDiv.style.border = "2px solid #0263ff";
  });
  input.addEventListener("blur", () => {
    inpDiv.style.border = "2px solid #050b14";
  });

  input.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase().trim();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
      const title = card.querySelector(".card-title")?.textContent?.toLowerCase() || "";
      card.style.display = title.includes(query) ? "flex" : "none";
    });
  });
}

// 4. Sahifalarga o'tish mantiqlari (Navigatsiya)
const navHeart = document.getElementById("navHeart");
const navShop = document.getElementById("navShop");

navHeart?.addEventListener("click", () => {
  window.location.href = "./html/heart.html";
});

navShop?.addEventListener("click", () => {
  window.location.href = "./html/shop.html";
});



