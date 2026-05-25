import initHeartRedirect from "./heartRedirect.js";
import { initTheme } from "./theme.js";
import { footerF } from "./footer.js";

const cartItemsContainer = document.getElementById("cart-items-container");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const cartActionsBottom = document.getElementById("cart-actions");

let cartProducts = JSON.parse(localStorage.getItem("cart")) || [];
let likedProducts = JSON.parse(localStorage.getItem("liked")) || [];

function updateNavbarCount() {
  const shopNavEl = document.getElementById("shop");
  const likeNavEl = document.getElementById("like");

  if (shopNavEl) {
    shopNavEl.innerText = cartProducts.length;
    shopNavEl.style.display = cartProducts.length > 0 ? "flex" : "none";
  }
  if (likeNavEl) {
    likeNavEl.innerText = likedProducts.length;
    likeNavEl.style.display = likedProducts.length > 0 ? "flex" : "none";
  }
}

function calculateTotal(isEmpty) {
  if (!subtotalEl || !taxEl || !totalEl) return;

  if (isEmpty) {
    subtotalEl.innerText = "$0.00";
    taxEl.innerText = "$0.00";
    totalEl.innerText = "$0.00";
    return;
  }

  const subtotal = cartProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  subtotalEl.innerText = `$${subtotal.toFixed(2)}`;
  taxEl.innerText = `$${tax.toFixed(2)}`;
  totalEl.innerText = `$${total.toFixed(2)}`;
}

function renderCart() {
  if (
    !cartItemsContainer ||
    !cartActionsBottom ||
    !subtotalEl ||
    !taxEl ||
    !totalEl
  ) {
    return;
  }

  cartItemsContainer.innerHTML = "";

  if (cartProducts.length === 0) {
    cartItemsContainer.innerHTML = `<p style="color: #94a3b8; font-size: 18px; padding-top: 20px;">Savat bo'sh</p>`;
    cartActionsBottom.style.display = "none";
    calculateTotal(true);
    return;
  }

  cartActionsBottom.style.display = "flex";

  cartProducts.forEach((product, index) => {
    if (!product.quantity) product.quantity = 1;

    const itemTotal = product.price * product.quantity;

    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";

    itemDiv.innerHTML = `
      <div class="item-left">
        <img src="${product.image}" alt="${product.title}" class="item-img">
        <div class="item-details">
          <h4>${product.title.length > 30 ? product.title.slice(0, 30) + "..." : product.title}</h4>
          <div class="item-price-unit">$${product.price.toFixed(2)}</div>
          <div class="quantity-controls">
            <button class="qty-btn" onclick="changeQuantity(${index}, -1)">-</button>
            <span>${product.quantity}</span>
            <button class="qty-btn" onclick="changeQuantity(${index}, 1)">+</button>
            <button class="delete-btn" onclick="removeItem(${index})"><i class="ri-delete-bin-line"></i></button>
          </div>
        </div>
      </div>
      <div class="item-right-price">
        $${itemTotal.toFixed(2)}
      </div>
    `;
    cartItemsContainer.appendChild(itemDiv);
  });

  calculateTotal(false);
}

window.changeQuantity = (index, delta) => {
  cartProducts[index].quantity += delta;
  if (cartProducts[index].quantity < 1) cartProducts[index].quantity = 1;
  localStorage.setItem("cart", JSON.stringify(cartProducts));
  renderCart();
};

window.removeItem = (index) => {
  cartProducts.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cartProducts));
  renderCart();
  updateNavbarCount();
};

document.getElementById("clear-cart-btn")?.addEventListener("click", () => {
  cartProducts = [];
  localStorage.setItem("cart", JSON.stringify(cartProducts));
  renderCart();
  updateNavbarCount();
});

document.getElementById("continue-shopping-btn")?.addEventListener("click", () => {
  window.location.href = "../index.html";
});

initTheme();
initHeartRedirect();
footerF();

updateNavbarCount();
if (cartItemsContainer && cartActionsBottom && subtotalEl && taxEl && totalEl) {
  renderCart();
}
