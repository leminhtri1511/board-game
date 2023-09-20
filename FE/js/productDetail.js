import header from "./component/header.js";
import footer from "./component/footer.js";
import notifyModal from "./component/notifyModal.js";
import slider from "./utils/slider.js";
import utils from "./utils/utils.js";

import api from "./api/api.js";
import productAPI from "./api/productAPI.js";
import cartAPI from "./api/cartAPI.js";

const footerContainer = document.querySelector(".footer");

const productId = new URL(window.location.href).searchParams.get("product-id");

let cartAddBtn;
let cartPageBtn;
let cartProductDec;
let cartProductInc;
let cartProductQuantity;

const app = {
    product: {},
    quantity: 1,
    renderHtml() {
        document.querySelector(".product-detail").innerHTML = `
            <div class="product-detail-header border-b-solid">
                <span>Sản phẩm</span>
                <span class="product-detail-header-name">// ${this.product.Name}</span>
            </div>
            <div class="product-info">
                <div class="product-image">
                    <div class="slider slider-main n-btn">
                        <div class="slider-row">
                            <ul class="slider-list" data-col="1" data-gap="1rem">
                            ${this.product.images.length > 0 ? this.product.images.map(image => {
                                return `
                                    <li class="slider-item">
                                        <img class="slider-img" src="${image.path}" alt="">
                                    </li>
                                `
                            }).join("") : 
                                `<li class="slider-item">
                                    <img class="slider-img" src="../img/noImg.png" alt="">
                                </li>`
                            }
                            </ul>
                        </div>
                    </div>
                    <div class="slider slider-sub">
                        <div class="slider-row">
                            <ul class="slider-list" data-col="4" data-gap="1.7rem">
                                ${this.product.images.length > 0 ? this.product.images.map(image => {
                                    return `
                                        <li class="slider-item">
                                            <img class="slider-img" src="${image.path}" alt="">
                                        </li>
                                    `
                                }).join("") : 
                                    `<li class="slider-item">
                                        <img class="slider-img" src="../img/noImg.png" alt="">
                                    </li>`
                                }
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="product-info-content">
                    <span class="product-name">${this.product.Name}</span>
                    <div class="product-group product-price">
                        <span class="product-label">Giá:</span>
                        <span class="primary-text text-m-large">${utils.formatMoney(this.product.Price)} VNĐ</span>
                    </div>
                    <div class="product-group">
                        <span class="product-label">Số người chơi:</span>
                        <span>${this.product.Players || "Chưa có"}</span>
                    </div>
                    <div class="product-group">
                        <span class="product-label">Thời gian:</span>
                        <span>${this.product.Time || "Chưa có"}</span>
                    </div>
                    <div class="product-group">
                        <span class="product-label">Độ tuổi:</span>
                        <span>${this.product.AgeSuggest || "Chưa có"}</span>
                    </div>
                    <div class="product-group">
                        <span class="product-label">Thể loại:</span>
                        <ul class="product-tag-list">
                            ${this.product.categories ? this.product.categories.map(category => {
                                return `
                                    <li class="product-tag-item" data-id="${category.Id}">
                                        <span>${category.Name}</span>
                                    </li>
                                `
                            }).join("") : ""}    
                        </ul>
                    </div>
                    <div class="product-group">
                        <span class="product-label">Số lượng:</span>
                        <div class="product-quantity">
                            <div class="product-quantity-dec">
                                <span>-</span>
                            </div>
                            <input type="number" value="${this.quantity}" class="product-quantity-number">
                            <div class="product-quantity-inc">
                                <span>+</span>
                            </div>
                        </div>
                    </div>
                    <div class="product-group product-footer">
                        <button class="btn btn-sub-primary cart-add-btn">Thêm vào giỏ hàng</button>
                        <button class="btn btn-primary btn-m-long cart-page-btn">Mua ngay</button>
                    </div>
                </div>
            </div>
            <div class="product-description">
                <span class="product-description-header">Mô tả sản phẩm</span>
                <div class="product-description-content">${this.product.Description || ""}</div>
            </div>
            <div class="product-feedback">
                <div class="product-feedback-header border-b-dashed">
                    <span>Đánh giá sản phẩm</span>
                </div>
                <ul class="product-feedback-list">
                     ${this.product.feedback.map(feedback => {
                        return `
                            <li class="product-feedback-item">
                                <img src="${feedback.Avatar ? feedback.Avatar : "../img/ava001.jpg"}" alt="" class="product-feedback-avatar">
                                <div class="product-feedback-info">
                                    <div class="product-feedback-info-top">
                                        <span class="product-feedback-name">${feedback.Username}</span>
                                        <div class="product-feedback-rate">
                                            <i class="product-feedback-rate-icon ${feedback.Stars >= 1 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                            <i class="product-feedback-rate-icon ${feedback.Stars >= 2 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                            <i class="product-feedback-rate-icon ${feedback.Stars >= 3 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                            <i class="product-feedback-rate-icon ${feedback.Stars >= 4 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                            <i class="product-feedback-rate-icon ${feedback.Stars >= 5 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                        </div>
                                        <span class="product-feedback-date">${utils.formatDate(feedback.Date)}</span>
                                    </div>
                                    <div class="product-feedback-info-bottom">
                                        <span>${feedback.Comment}</span>
                                    </div>
                                    <ul class="product-feedback-image-list">
                                        ${feedback.images.map(image => {
                                            return `
                                                <li class="product-feedback-image-item">
                                                    <img src="${image.Path}" class="product-feedback-image">
                                                </li>
                                            `
                                        }).join("")}
                                    </ul>
                                </div>
                            </li>
                        `
                    }).join("")}
                </ul>
            </div>
        `
        slider.init();

        this.removeEvents();

        cartAddBtn = document.querySelector(".cart-add-btn");
        cartPageBtn = document.querySelector(".cart-page-btn");
        cartProductDec = document.querySelector(".product-quantity-dec");
        cartProductInc = document.querySelector(".product-quantity-inc");
        cartProductQuantity = document.querySelector(".product-quantity-number");

        this.handleEvents();
    },
    cartProductDecHandler() {
        if (app.quantity > 1) {
            app.quantity--;
            app.renderHtml();
        }
    },
    cartProductIncHandler() {
        if (app.quantity < app.product.RemainingAmount) {
            app.quantity++;
            app.renderHtml();
        }
    },
    cartProductQuantityHandler(e) {
        if (!e.target.value || e.target.value < 1) {
            e.target.value = 1;
        }
        if (e.target.value > app.product.RemainingAmount) {
            e.target.value = app.product.RemainingAmount;
        }
        app.quantity = e.target.value;
        app.renderHtml();
    },
    async addItemHandler() {
        let isSuccess = false;
        const token = utils.getCookie("token");
        if (!token) {
            window.location.href = `${window.location.origin}/FE/pages/login.html`;
        } else {
            let cart = JSON.parse(window.sessionStorage.cart);
            const productItem = cart.find(item => item.ProductId == app.product.Id);
            if (productItem) {
                const req = {
                    productId: productId,
                    amount: Number(productItem.Amount) + app.quantity
                }
                await cartAPI.updateCart(req, token, (res) => {
                    if (res.success) {
                        const index = cart.indexOf(productItem);
                        cart[index].Amount = Number(cart[index].Amount) + app.quantity;
                        const tmpItem = cart[index];
                        cart.splice(index, 1);
                        cart.unshift(tmpItem);
    
                        window.sessionStorage.cart = JSON.stringify(cart);
                        notifyModal.init("Thêm vào giỏ hàng thành công");
                        notifyModal.showModal();
                        app.renderHtml();
                        header.renderHtml();
                        isSuccess = true;
                    } else {
                        api.errHandler();
                    }
                });
            } else {
                const req = {
                    productId: productId,
                    amount: app.quantity
                }
                await cartAPI.addCart(req, token, (res) => {
                    if (res.success) {
                        cart.unshift({...app.product, 
                            Id: res.data.cartProductId,
                            ProductId: app.product.Id,
                            Amount: app.quantity
                        });
                        window.sessionStorage.cart = JSON.stringify(cart);
                        notifyModal.init("Thêm vào giỏ hàng thành công");
                        notifyModal.showModal();
                        app.renderHtml();
                        header.renderHtml();
                        isSuccess = true;
                    } else {
                        api.errHandler();
                    }
                });
            }
        }
        return isSuccess;
    },
    cartAddHandler() {
        app.addItemHandler();
    },
    async cartPageHandler() {
        const isSuccess = await app.addItemHandler();
        if (isSuccess) {
            window.location.href = `${window.location.origin}/FE/pages/cart.html`;
        }
    },
    removeEvents() {
        if(cartProductDec) {
            cartProductDec.removeEventListener("click", this.cartProductDecHandler);
        }
        if(cartProductInc) {
            cartProductInc.removeEventListener("click", this.cartProductIncHandler);
        }
        if(cartProductQuantity) {
            cartProductQuantity.removeEventListener("change", this.cartProductQuantityHandler);
        }
        if(cartAddBtn) {
            cartAddBtn.removeEventListener("click", this.cartAddHandler);
        }
        if(cartPageBtn) {
            cartPageBtn.removeEventListener("click", this.cartPageHandler);
        }
    },
    handleEvents() {
        if(cartProductDec) {
            cartProductDec.addEventListener("click", this.cartProductDecHandler);
        }
        if(cartProductInc) {
            cartProductInc.addEventListener("click", this.cartProductIncHandler);
        }
        if(cartProductQuantity) {
            cartProductQuantity.addEventListener("change", this.cartProductQuantityHandler);
        }
        if(cartAddBtn) {
            cartAddBtn.addEventListener("click", this.cartAddHandler);
        }
        if(cartPageBtn) {
            cartPageBtn.addEventListener("click", this.cartPageHandler);
        }
    },
    async init() {
        const req = {
            id: productId
        }
        await productAPI.getProduct(req, (res) => {
            if (res.success) {
                app.product = res.data.product;
            } else {
                api.errHandler();
            }
        });
        header.init();
        footerContainer.innerHTML = footer;
        this.renderHtml();
    },
};

export default app;
