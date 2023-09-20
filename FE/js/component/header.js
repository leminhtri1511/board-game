import utils from "../utils/utils.js";

const originUrl = `${window.origin}/FE`;

const product = {
  image: "pd001.jpg",
  name: "Catan US",
  price: "1.600.000 VNĐ",
};

let cartBtn;
let logoutBtn;

let user = utils.getCookie("token") ? utils.getSession("user") : {};

const header = {
  productList: [],
  renderHtml() {
    // Get cart from session
    if (!utils.getSession("cart")) {
      utils.setSession("cart", []);
    } else {
      this.productList = [...utils.getSession("cart")];
    }

    document.querySelector(".header").innerHTML = `
      <div class="header-nav">
            <a href="${originUrl}/index.html" class="header-logo-link">
                <img src="${originUrl}/img/logo.png" alt="" class="logo">
            </a>
            <ul class="header-nav-list">
                <li class="header-nav-item">
                    <a href="${originUrl}/index.html" class="header-nav-link">Trang chủ</a>
                </li>
                <li class="header-nav-item">
                    <a href="${originUrl}/pages/about_us.html" class="header-nav-link">Về chúng tôi</a>
                </li>
            </ul>
        </div>
        <div class="header-btn">
              <div class="header-cart">
                  <i class="fa-solid fa-cart-shopping"></i>
                  <div class="header-cart-products">
                      ${
                        this.productList.length > 0
                          ? `
                              <div class="header-cart-products-header">
                                  <span>Sản phẩm mới thêm</span>
                              </div>
                              <ul class="header-cart-products-list">
                                  ${this.productList.map((item, index) => {
                                    if (index < 3)
                                    return `
                                      <li class="header-cart-products-item" data-id="${item.Id}">
                                          <div class="header-cart-products-item-left">
                                              <img src="${item.MainImage ? item.MainImage : `${originUrl}/img/noImg.png`}" alt="" class="header-cart-products-image">
                                              <span class="header-cart-products-name">${item.Name}</span>
                                          </div>
                                          <span class="header-cart-products-price">${utils.formatMoney(item.Price)} VNĐ</span>
                                      </li>`;
                                  }).join("")}
                              </ul>
                              <div class="header-cart-products-footer">
                                  <button class="btn btn-long btn-primary">Xem giỏ hàng</button>
                              </div>
                          `
                          : `
                          <div class="header-cart-products-text">Chưa có sản phẩm</div>
                      `
                      }
                  </div>
              </div>
          </a>
          <div class="header-authentication">
              ${
                Object.keys(user).length !== 0
                  ? `
                  <div class="header-user">
                      <span class="header-user-name">${user.Username}</span>
                      <img src="${user.Avatar ? `${user.Avatar}` : `${originUrl}/img/ava001.jpg`}"
                    }" class="header-user-avatar"></img>
                      <ul class="header-user-list">
                          <li class="header-user-item">
                              <a href="${originUrl}/pages/account.html?page=0" class="header-user-link">Tài khoản của tôi</a> 
                          </li>
                          <li class="header-user-item">
                              <a href="${originUrl}/pages/account.html?page=3" class="header-user-link">Lịch sử mua hàng</a>
                          </li>
                          <li class="header-user-item">
                              <a href="${originUrl}/pages/login.html" class="header-user-link header-logout">Đăng xuất</a>
                          </li>
                      </ul>
                  </div>
              `
                  : `
                  <a href="${originUrl}/pages/register.html" class="btn btn-transparent header-register">Đăng ký</a>
                  <a href="${originUrl}/pages/login.html" class="btn btn-black header-login">Đăng nhập</a>
              `
              }
        </div>
    `

    this.removeEvents();

    cartBtn = document.querySelector(".header-cart");
    logoutBtn = document.querySelector(".header-logout");

    this.handleEvents();
  },
  logoutHandler() {
    utils.removeCookie("token");
    utils.removeItemSession("user");
    utils.removeItemSession("cart");
  },
  cartBtnHandler(e) {
    e.preventDefault();
    if (e.target.closest("i")) {
      window.location.href = `${originUrl}/pages/cart.html`;
    } else if (e.target.closest(".header-cart-products-item")) {
      window.location.href = `${originUrl}/pages/product_detail.html?product-id=${e.target.closest(".header-cart-products-item").dataset.id}`;
    } else if (e.target.closest(".header-cart-products-footer .btn")) {
      window.location.href = `${originUrl}/pages/cart.html`;
    }
  },
  removeEvents() {
    if (cartBtn) {
      cartBtn.removeEventListener("click", this.cartBtnHandler);
    }
    if (logoutBtn) {
      logoutBtn.removeEventListener("click", this.logoutHandler);
    }
  },
  handleEvents() {
    if (cartBtn) {
      cartBtn.addEventListener("click", this.cartBtnHandler);
    }
    if (logoutBtn) {
      logoutBtn.addEventListener("click", this.logoutHandler);
    }
  },
  init() {
    this.productList = [];
    this.renderHtml();
  },
};

export default header;
