import header from "./component/header.js";
import footer from "./component/footer.js";
import address from "./component/address.js";
import modal from "./utils/modal.js";
import utils from "./utils/utils.js"
import addressAPI from "./api/addressAPI.js";
import api from "./api/api.js";
import orderAPI from "./api/orderAPI.js";
import notifyModal from "./component/notifyModal.js";

const footerContainer = document.querySelector(".footer");
const token = utils.getCookie("token");
const userId = utils.getSession("user").Id;

let cartAddressChange;
let cartAddressCloseBtn;
let cartAddressApplyBtn;
let cartAddressDefaultBtns;
let cartAddressChecks;
let cartAddressDeleteBtns;
let cartAddressUpdateBtns;
let cartAddressNewBtn;
let cartOrderBtn;

let cartSelected;

const date = new Date();
const beginDate = new Date();
const endDate = new Date();
beginDate.setDate(date.getDate() + 10);
endDate.setDate(date.getDate() + 15);

const app = {
    addressList: [],
    addressChange: false,
    addressSelected: {},
    renderHtml() {
        document.querySelector(".cart").innerHTML = `
            <div class="cart-header border-b-solid">
                <span>Thanh toán</span>
            </div>
            <div class="cart-address">
                <div class="cart-address-header border-b-dashed">
                    <div>
                        <i class="fa-solid fa-location-dot"></i>
                        <span>Địa chỉ nhận hàng</span>
                    </div>
                ${this.addressChange ? `
                    <button class="btn btn-long btn-white cart-address-new">
                        <i class="fa-solid fa-plus"></i>
                        Thêm địa chỉ mới
                    </button> 
                ` : ``}
                </div>
                <div class="cart-address-content">
                    ${this.addressChange ? `
                        <ul class="cart-address-list">
                            ${this.addressList.map(item => {
                                return `
                                    <li class="cart-address-item" data-id="${item.Id}">
                                        <div class="cart-address-info">
                                            <input type="checkbox" class="cart-address-check" ${item.Id == this.addressSelected.Id ? "checked" : ""}>
                                            <div>
                                                <span class="cart-address-name">${item.Fullname}</span>
                                                <span>(+84) ${item.Phone}</span>
                                            </div>
                                            <span class="cart-address-address">${item.Address}</span>
                                        </div>
                                        <div class="cart-address-action">
                                            ${item.IsDefault ? `
                                                <span>Mặc định</span>
                                            ` : `
                                                <span class="primary-text cart-address-default-btn">Đặt làm mặc định</span>
                                            `}
                                            <span class="cart-address-update">Sửa</span>
                                            <span class="cart-address-delete">Xóa</span>
                                        </div>
                                    </li>
                                `
                            }).join("")}
                        </ul>
                        <div class="cart-address-content-footer">
                            <button class="btn btn-white btn-long cart-address-close">Trở lại</button>
                            <button class="btn btn-primary btn-long cart-address-apply">Hoàn thành</button>
                        </div>  
                        ` : `
                            <ul class="cart-address-list">
                                <li class="cart-address-item">
                                    ${Object.keys(this.addressSelected).length !== 0 ? `
                                        <div class="cart-address-info">
                                            <div>
                                                <span class="cart-address-name">${this.addressSelected.Fullname}</span>
                                                <span>(+84) ${this.addressSelected.Phone}</span>
                                            </div>
                                            <span class="cart-address-address">${this.addressSelected.Address}</span>
                                        </div>
                                    ` : `
                                        <span>Không có</span>
                                    `}
                                    <div class="cart-address-action">
                                        ${this.addressSelected.IsDefault ? `
                                            <span>Mặc định</span>
                                        ` : ""}
                                        <span class="text-primary cart-address-change">Thay đổi</span>
                                    </div>
                                </li>
                            </ul> 
                        `}
                </div>
            </div>
            <div class="cart-content payment">
                <div class="cart-content-header">
                    <span>Sản phẩm</span>
                    <span>Đơn giá</span>
                    <span>Số lượng</span>
                    <span>Số tiền</span>
                </div>
                <div class="cart-products">
                    <ul class="cart-products-list">
                        ${cartSelected.productList.map(item => {
                            return `
                                <li class="cart-products-item">
                                    <div class="cart-product-info">
                                        <img src="${item.MainImage}" alt="" class="cart-product-image">
                                        <span class="cart-product-name">${item.Name}</span>
                                    </div>
                                    <span class="cart-product-price">${utils.formatMoney(item.Price)} VNĐ</span>
                                    <span class="cart-product-quantity">${item.Amount}</span>
                                    <span class="cart-product-price">${utils.formatMoney(item.Price * item.Amount)} VNĐ</span>
                                </li>
                            `
                        }).join("")}
                    </ul>
                </div>
                <div class="cart-products-footer">
                    <div class="cart-products-footer-note border-b-dashed">
                        <span>Hình thức thanh toán</span>
                        <div>
                            <span>Thanh toán khi nhận hàng</span>
                            <span>Nhận hàng ngày ${utils.getFormattedDate(beginDate)} - ${utils.getFormattedDate(endDate)}</span>
                        </div>
                    </div>
                    <div class="cart-products-footer-money border-b-dashed">
                        <div>
                            <div>
                                <span>Tổng tiền hàng:</span>
                            </div>
                            <div>
                                <span>${utils.formatMoney(cartSelected.price.totalPrice)} VNĐ</span>
                            </div>
                            <div>
                                <span>Voucher:</span>
                            </div>
                            <div>
                                <div class="cart-products-saving-voucher">-${cartSelected.voucher.Value}%</div>
                            </div>
                            <div>
                                <span>Phí vận chuyển:</span>
                            </div>
                            <div>
                                <span>33.000 VNĐ</span>
                            </div>
                            <div>
                                <span>Tổng thanh toán (${cartSelected.quantity} sản phẩm):</span>
                            </div>
                            <div>
                                <span class="primary-text text-middle">${utils.formatMoney(cartSelected.price.lastPrice + 33000)} VNĐ</span>
                            </div>
                        </div>
                    </div>
                    <div class="cart-products-footer-action">
                        <button class="btn btn-m-long btn-primary cart-order-btn">Đặt hàng</button>
                    </div>
                </div>
            </div>
        `
        
        this.removeEvents();

        cartAddressChange = document.querySelector(".cart-address-change");
        cartAddressCloseBtn = document.querySelector(".cart-address-close");
        cartAddressApplyBtn = document.querySelector(".cart-address-apply");
        cartAddressDefaultBtns = document.querySelectorAll(".cart-address-default-btn");
        cartAddressChecks = document.querySelectorAll(".cart-address-check");
        cartAddressDeleteBtns = document.querySelectorAll(".cart-address-delete");
        cartAddressUpdateBtns = document.querySelectorAll(".cart-address-update");
        cartAddressNewBtn = document.querySelector(".cart-address-new");
        cartOrderBtn = document.querySelector(".cart-order-btn");

        this.handleEvents();
    },
    cartAddressChangeBtnHandler() {
        app.addressChange = true;
        app.renderHtml();
    },
    cartAddressCloseHandler() {
        app.addressChange = false;
        app.renderHtml();  
    },
    cartAddressApplyHandler() {
        app.addressChange = false;
        app.renderHtml();
    },
    cartAddressCheckHandler(e) {
        const addressItem = e.target.closest(".cart-address-item");
        app.addressList.forEach(item => {
            if (item.Id == addressItem.dataset.id) {
                app.addressSelected = {...item};
            }
        })
        app.renderHtml();
    },
    async cartAddressDefaultBtnHandler(e) {
        const addressItem = e.target.closest(".cart-address-item");
        const adr = app.addressList.find(item => item.Id == addressItem.dataset.id);

        const req = {
            userId: userId,
            addressId: adr.Id,
            isDefault: !adr.IsDefault
        }
        await addressAPI.updateAddress(req, token, (res) => {
            if (res.success) {
                app.addressList.forEach((item, index) => {
                    if (item.IsDefault == true)
                        app.addressList[index].IsDefault = false;
                    if (item.Id == addressItem.dataset.id)
                        app.addressList[index].IsDefault = true;
                    })
                if (Object.keys(app.addressSelected).length !== 0) {
                    if (addressItem.dataset.id == app.addressSelected.Id)
                        app.addressSelected.IsDefault = true;
                    else 
                        app.addressSelected.IsDefault = false;
                }
            } else {
                api.errHandler();
            }
            app.renderHtml();
        })
    },
    async cartAddressDeleteHandler(e) {
        const addressItem = e.target.closest(".cart-address-item");

        if (addressItem) {
            const req = {
                userId: userId,
                addressId: addressItem.dataset.id 
            }
            await addressAPI.deleteAddress(req, token, (res) => {
                if (res.success) {
                    app.addressList = [...app.addressList.filter(item => item.Id != addressItem.dataset.id)];
                    if (addressItem.dataset.id == app.addressSelected.Id) {
                        app.addressSelected = {};
                    }
                    app.renderHtml();
                } else {
                    api.errHandler();
                }
            })
        }

    },
    cartAddressUpdateHandler(e) {
        const addressItem = e.target.closest(".cart-address-item");
        const item = app.addressList.find(item => item.Id == addressItem.dataset.id);
        if (document.querySelector(".address")) {
            const modals = Array.from(document.querySelectorAll(".modal"));
            const addressModal = document.querySelector(".modal .address").closest(".modal");
            const index = modals.indexOf(addressModal);
            modal.showModal(index);
        } else {
            const modalHtml = `
                <div class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-body">
                    <div class="address"></div>
                </div>
                </div>
            `;
            document.querySelector("body").innerHTML += modalHtml;
        }
        address.init(item.Id, item.Fullname, item.Phone, item.Address, item.IsDefault);
        app.renderHtml();
    },
    cartAddressNewHandler() {
        if (document.querySelector(".address")) {
            const modals = Array.from(document.querySelectorAll(".modal"));
            const addressModal = document.querySelector(".modal .address").closest(".modal");
            const index = modals.indexOf(addressModal);
            modal.showModal(index);
        } else {
            const modalHtml = `
                <div class="modal active">
                <div class="modal-overlay"></div>
                <div class="modal-body">
                    <div class="address"></div>
                </div>
                </div>
            `;
            document.querySelector("body").innerHTML += modalHtml;
        }
        address.init();
        app.renderHtml();
    },
    async cartOrderHandler() {
        if (Object.keys(app.addressSelected).length !== 0) {
            let req = {
                userId: userId, 
                userAddressId: app.addressSelected.Id, 
                ship: 33000, 
                value: cartSelected.price.lastPrice + 33000, 
                listProduct: JSON.stringify(cartSelected.productList)
            }
            if (cartSelected.voucher.Id) {
                req = {
                    ...req,
                    voucherId: cartSelected.voucher.Id
                }
            }
            await orderAPI.addOrder(req, token, (res) => {
                if (res.success) {
                    let cart = utils.getSession("cart");
                    cartSelected.productList.forEach(product => {
                        cart = cart.filter(item => item.Id !== product.Id);
                    })
                    utils.setSession("cart", cart);
                    utils.setSession("cartSelected", []);
                    notifyModal.init("Đặt hàng thành công", () => {
                        window.location.href = `${window.location.origin}/FE/index.html`;
                    })
                    notifyModal.showModal();
                } else {
                    api.errHandler();
                }
            })    
        } else {
            notifyModal.init("Vui lòng chọn địa chỉ nhận hàng", () => {}, 2);
        }
    },
    removeEvents() {
        if (cartAddressChange) {
            cartAddressChange.removeEventListener("click", this.cartAddressChangeBtnHandler);
        }
        if (cartAddressCloseBtn) {
            cartAddressCloseBtn.removeEventListener("click", this.cartAddressCloseHandler);
        }
        if (cartAddressApplyBtn) {
            cartAddressApplyBtn.removeEventListener("click", this.cartAddressApplyHandler);
        }
        if (cartAddressDefaultBtns) {
            cartAddressDefaultBtns.forEach(cartAddressDefaultBtn => {
                cartAddressDefaultBtn.removeEventListener("click", this.cartAddressDefaultBtnHandler);
            })
        }
        if (cartAddressChecks) {
            cartAddressChecks.forEach(cartAddressCheck => {
                cartAddressCheck.removeEventListener("click", this.cartAddressCheckHandler);
            })
        }
        if (cartAddressDeleteBtns) {
            cartAddressDeleteBtns.forEach(cartAddressDeleteBtns => {
                cartAddressDeleteBtns.removeEventListener("click", this.cartAddressDeleteHandler);
            })
        }
        if (cartAddressUpdateBtns) {
            cartAddressUpdateBtns.forEach(cartAddressUpdateBtns => {
                cartAddressUpdateBtns.removeEventListener("click", this.cartAddressUpdateHandler);
            })
        }
        if (cartAddressNewBtn) {
            cartAddressNewBtn.removeEventListener("click", this.cartAddressNewHandler);
        }
        if (cartOrderBtn) {
            cartOrderBtn.removeEventListener("click", this.cartOrderHandler);
        }
    },
    handleEvents() {
        if (cartAddressChange) {
            cartAddressChange.addEventListener("click", this.cartAddressChangeBtnHandler);
        }
        if (cartAddressCloseBtn) {
            cartAddressCloseBtn.addEventListener("click", this.cartAddressCloseHandler);
        }
        if (cartAddressApplyBtn) {
            cartAddressApplyBtn.addEventListener("click", this.cartAddressApplyHandler);
        }
        if (cartAddressDefaultBtns) {
            cartAddressDefaultBtns.forEach(cartAddressDefaultBtn => {
                cartAddressDefaultBtn.addEventListener("click", this.cartAddressDefaultBtnHandler);
            })
        }
        if (cartAddressChecks) {
            cartAddressChecks.forEach(cartAddressCheck => {
                cartAddressCheck.addEventListener("click", this.cartAddressCheckHandler);
            })
        }
        if (cartAddressDeleteBtns) {
            cartAddressDeleteBtns.forEach(cartAddressDeleteBtns => {
                cartAddressDeleteBtns.addEventListener("click", this.cartAddressDeleteHandler);
            })
        }
        if (cartAddressUpdateBtns) {
            cartAddressUpdateBtns.forEach(cartAddressUpdateBtns => {
                cartAddressUpdateBtns.addEventListener("click", this.cartAddressUpdateHandler);
            })
        }
        if (cartAddressNewBtn) {
            cartAddressNewBtn.addEventListener("click", this.cartAddressNewHandler);
        }
        if (cartOrderBtn) {
            cartOrderBtn.addEventListener("click", this.cartOrderHandler);
        }
    },
    async init() {
        if (utils.getCookie("token")) {
            cartSelected = utils.getSession("cartSelected");
            header.init();
            footerContainer.innerHTML = footer;

            const req = {
                userId: userId
            }
            await addressAPI.getListAddress(req, token, (res) => {
                if (res.success) {
                    app.addressList = [...res.data.address];
                } else {
                    api.errHandler();
                }
            })

            const defaultAddress = this.addressList.find(item => item.IsDefault == true);
            this.addressSelected = defaultAddress || {};
            this.renderHtml();
        } else {
            window.location.href = `${window.location.origin}/FE/pages/login.html`
        }
    },
};

export default app;
