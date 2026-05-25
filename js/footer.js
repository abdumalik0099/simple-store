export function footerF(container) {
  const footerEl =
    container || document.getElementById("footer") || document.querySelector("footer");

  if (!footerEl) return null;

  footerEl.innerHTML = `
    <div class="footer container1">
      <div class="qator1">
        <h2>Store</h2>
        <ul>
          <li>Your one-stop shop for all your shopping <br> needs. Quality products, competitive <br> prices, and exceptional service.</li>
        </ul>
        <div class="fle">
          <i class="ri-facebook-fill"></i>
          <i class="ri-instagram-line"></i>
          <i class="ri-twitter-line"></i>
          <i class="ri-youtube-line"></i>
        </div>
      </div>
      <div class="qator2">
        <h2>Shop</h2>
        <ul>
          <li>All Products</li>
          <li>Categories</li>
          <li>Wishlist</li>
          <li>Cart</li>
        </ul>
      </div>
      <div class="qator3">
        <h2>Account</h2>
        <ul>
          <li>Login</li>
          <li>Register</li>
          <li>My Account</li>
          <li>Order History</li>
        </ul>
      </div>
      <div class="qator4">
        <h2>Contact</h2>
        <ul>
          <li><i class="ri-map-pin-line"></i> 123 Shopping Street, Retail City, 10001</li>
          <li><i class="ri-phone-line"></i> (123) 456-7890</li>
          <li><i class="ri-mail-send-line"></i> info@store.com</li>
        </ul>
      </div>
    </div>
    <div class="px2"></div>
    <div class="buttonFooter container1">
      <div class="leftFooter">© 2023 Store. All rights reserved.</div>
      <div class="rightFooter">Privacy Policy &nbsp;&nbsp;&nbsp; Terms of Service &nbsp;&nbsp;&nbsp; Shipping Policy</div>
    </div>
  `.trim();

  return footerEl;
}
