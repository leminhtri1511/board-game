import header from "./component/header.js";
import footer from "./component/footer.js";
import voucher from "./component/voucher.js"
import notifyModal from "./component/notifyModal.js";
import modal from "./utils/modal.js";
import utils from "./utils/utils.js"

import api from "./api/api.js";
import cartAPI from "./api/cartAPI.js"

const footerContainer = document.querySelector(".footer");

let cartProductItems;
let cartProductChecks;
let cartTotalCheck;
let cartProductDeletes;
let cartProductDeleteSelected;
let cartProductDecs;
let cartProductIncs;
let cartProductQuantitys;
let cartProductsVoucherBtn;
let cartPaymentBtn;

const token = utils.getCookie("token");

const app = {
  voucher: {},
  price: {},
  productList: [],
  productSelected: [],
  renderHtml() {
    this.voucher = Object.keys(voucher.voucherSelected).length > 0 ? voucher.voucherSelected : {
      Value: 0,
    };
    this.price = utils.calculationPrice(this.productSelected, this.voucher.Value);
    document.querySelector(".cart").innerHTML = `
        <div class="cart-header border-b-solid">
            <span>Giỏ hàng</span>
        </div>
        <div class="cart-content">
        ${
          this.productList.length === 0
            ? `
            <div class="cart-empty">
                <img src="../img/cart001.png" alt="" class="cart-empty-image">
                <span>Giỏ hàng của bạn còn trống</span>
                <a href="../index.html" class="btn btn-m-long btn-primary">Mua hàng</a>
            </div>        
        `
            : `
            <div class="cart-content-header">
                <span>Sản phẩm</span>
                <span>Đơn giá</span>
                <span>Số lượng</span>
                <span>Số tiền</span>
                <span>Thao tác</span>
            </div>
            <div class="cart-products">
                <ul class="cart-products-list">
                    ${this.productList
                      .map((item) => {
                        return `
                            <li class="cart-products-item" data-id="${item.ProductId}">
                                <div class="cart-product-info">
                                    <div>
                                        <input class="cart-product-check" type="checkbox" ${
                                          this.productSelected.includes(item)
                                            ? "checked"
                                            : ""
                                        }>
                                    </div>
                                    <img src="${item.MainImage}" alt="" class="cart-product-image">
                                    <span class="cart-product-name">${item.Name}</span>
                                </div>
                                <span class="cart-product-price">${
                                  utils.formatMoney(item.Price)
                                } VNĐ</span>
                                <div class="cart-product-quantity">
                                    <div class="cart-product-quantity-dec">
                                        <span>-</span>
                                    </div>
                                    <input type="number" value="${
                                      item.Amount
                                    }" class="cart-product-quantity-number">
                                    <div class="cart-product-quantity-inc">
                                        <span>+</span>
                                    </div>
                                </div>
                                <span class="cart-product-price">${
                                  utils.formatMoney(item.Price * item.Amount)
                                } VNĐ</span>
                                <div class="cart-product-action">
                                    <span class="cart-product-delete">Xóa</span>
                                </div>
                            </li>
                        `;
                      })
                      .join("")}
                </ul>
            </div>
            <div class="cart-products-footer">
                <div class="cart-products-voucher border-b-dashed">
                    <div class="cart-products-voucher-select">
                        <img src="../img/icon_voucher_small.png" alt="">
                        <span>Nhập mã Voucher</span>
                    </div>
                </div>
                <div class="cart-products-saving-container border-b-dashed">
                    <div class="cart-products-saving">
                      ${this.voucher.Value ? `
                            <div class="cart-products-saving-voucher">-${
                              this.voucher.Value
                            }%</div>
                            ` : ""}
                        <span>-${utils.formatMoney(this.price.savingPrice)} VNĐ</span>
                    </div>
                </div>
                <div class="cart-products-footer-action">
                    <div class="cart-products-footer-left">
                        <input type="checkbox" id="select-all" ${
                          this.productSelected.length === this.productList.length
                            ? "checked"
                            : ""
                        }>
                        <label for="select-all">Chọn tất cả</label>
                        <span class="delete-selected">Xóa</span>
                    </div>
                    <div class="cart-products-footer-right">
                        <div class="cart-products-total-price">
                            <div>
                                <span class="text-middle">Tổng thanh toán (${
                                  this.productSelected.length
                                } sản phẩm): </span>
                                <span class="text-small">Tiết kiệm</span>
                            </div>
                            <div>
                                <span class="text-middle"> ${
                                  utils.formatMoney(this.price.lastPrice)
                                } VNĐ</span>
                                <span class="text-small">${
                                  utils.formatMoney(this.price.savingPrice)
                                } VNĐ</span>
                            </div>
                        </div>
                        <a href="payment.html" class="btn btn-m-long btn-primary cart-payment-btn">Thanh toán</a>
                    </div>
                </div>
            </div>
        `
        }
        </div>
    `;

    this.removeEvents();

    cartProductItems = document.querySelectorAll(".cart-product-item");
    cartProductChecks = document.querySelectorAll(".cart-product-check");
    cartTotalCheck = document.querySelector("#select-all");
    cartProductDeletes = document.querySelectorAll(".cart-product-delete");
    cartProductDeleteSelected = document.querySelector(".delete-selected");
    cartProductDecs = document.querySelectorAll(".cart-product-quantity-dec");
    cartProductIncs = document.querySelectorAll(".cart-product-quantity-inc");
    cartProductQuantitys = document.querySelectorAll(".cart-product-quantity-number");
    cartProductsVoucherBtn = document.querySelector(".cart-products-voucher-select");
    cartPaymentBtn = document.querySelector(".cart-payment-btn");

    this.handleEvents();
  },
  selectProductItem(productItem) {
    app.productList.forEach((product) => {
      if (product.ProductId == productItem.dataset.id) {
        if (!app.productSelected.includes(product)) {
          app.productSelected.push(product);
        }
      }
    });
  },
  deleteProductItem(productItem) {
    app.productList.forEach((product) => {
      if (product.ProductId == productItem.dataset.id) {
        const index = app.productSelected.indexOf(product);
        if (index != -1) app.productSelected.splice(index, 1);
      }
    });
  },
  cartTotalHandler() {
    cartProductChecks.forEach((cartProductCheck) => {
      const productItem = cartProductCheck.closest(".cart-products-item");
      if (cartTotalCheck.checked) {
        app.selectProductItem(productItem);
      } else {
        app.deleteProductItem(productItem);
      }
    });
    app.renderHtml();
  },
  productCheckHandler(e) {
    const productItem = e.target.closest(".cart-products-item");
    if (!e.target.checked) {
      app.deleteProductItem(productItem);
    } else {
      app.selectProductItem(productItem);
    }
    app.renderHtml();
  },
  productDeleteHandler(e) {
    app.productList.forEach((product) => {
      const productItem = e.target.closest(".cart-products-item");
      if (product.ProductId == productItem.dataset.id) {
        app.deleteProduct(product.Id, product.ProductId);
      }
    });
    header.renderHtml();
    app.renderHtml();
  },
  productDeleteSelectedHandler() {
    app.productSelected.forEach((product) => {
      const index = app.productList.indexOf(product);
      if (index != -1) {
        app.deleteProduct(product.Id, product.ProductId);
      }
    });
  },
  async deleteProduct(cartProductId, productId) {
    const req = {
      id: cartProductId,
    }
    await cartAPI.deleteCart(req, token, (res) => {
      if (res.success) {
          const productListIndex = app.productList.indexOf(app.productList.find(item => item.ProductId == productId));
          const productSelectedIndex = app.productSelected.indexOf(app.productSelected.find(item => item.ProductId == productId));
          if (productListIndex != -1) app.productList.splice(productListIndex, 1);
          if (productSelectedIndex != -1) app.productSelected.splice(productSelectedIndex, 1);

          utils.setSession("cart", app.productList);
      }
    }, api.errHandler, false);
    app.renderHtml();
    header.renderHtml();
    return;
  },
  async updateQuantity(productId, amount, index) {
    const req = {
      productId: productId,
      amount: amount
    }
    await cartAPI.updateCart(req, token, (res) => {
      if (res.success) {
        app.productList[index].Amount = amount;
        utils.setSession("cart", app.productList);
      } else {
        api.errHandler();
      }
    }, api.errHandler, false);
    app.renderHtml();
    header.renderHtml();
    return;
  },
  productDecHandler(e) {
    const productItem = e.target.closest(".cart-products-item");
    app.productList.forEach(async (product) => {
      if (product.ProductId == productItem.dataset.id) {
        const index = app.productList.indexOf(product);
        if (index != -1) {
          await app.updateQuantity(product.ProductId, app.productList[index].Amount - 1, index)
        }
        return;
      }
    });
  },
  productIncHandler(e) {
    const productItem = e.target.closest(".cart-products-item");
    app.productList.forEach(async (product) => {
      if (product.ProductId == productItem.dataset.id) {
        const index = app.productList.indexOf(product);
        if (index != -1) {
          if (app.productList[index].Amount < app.productList[index].RemainingAmount) {
            await app.updateQuantity(product.ProductId, app.productList[index].Amount + 1, index)
          }
          return;
        }
      }
    });
  },
  productQuantityHandler(e) {
    if (!e.target.value || e.target.value < 1) {
      e.target.value = 1;
    }
    const productItem = e.target.closest(".cart-products-item");
    app.productList.forEach(async (product) => {
      if (product.ProductId == productItem.dataset.id) {
        const index = app.productList.indexOf(product);
        if (e.target.value > app.productList[index].RemainingAmount) {
          e.target.value = app.productList[index].RemainingAmount;
        }
        if (index != -1) {
          await app.updateQuantity(product.ProductId, e.target.value, index);
        } 
        return;
      }
    });
    app.renderHtml();
  },
  cartVoucherBtnHandler(e) {
    if (document.querySelector(".voucher")) {
      const modals = Array.from(document.querySelectorAll(".modal"));
      const voucherModal = document
        .querySelector(".modal .voucher")
        .closest(".modal");
      const index = modals.indexOf(voucherModal);
      modal.showModal(index);
    } else {
      const modalHtml = `
        <div class="modal active">
        <div class="modal-overlay"></div>
          <div class="modal-body">
            <div class="voucher"></div>
          </div>
        </div>
      `;
      document.querySelector("body").innerHTML += modalHtml;
      voucher.init();
    }
    app.renderHtml();
  },
  cartPaymentHandler (e) {
    if (app.productSelected.length === 0) {
      e.preventDefault();
      notifyModal.init("Bạn chưa chọn sản phẩm nào để mua", () => header.renderHtml(), 2);
      notifyModal.showModal();
      app.renderHtml();
    } else {
      e.preventDefault();
      utils.setSession("cartSelected", {
        productList: app.productSelected,
        voucher: app.voucher,
        price: app.price,
        quantity: app.productSelected.length
      })
      window.location.href = `${window.location.origin}/FE/pages/payment.html`;
    }
  },
  removeEvents() {
    if (cartTotalCheck)
      cartTotalCheck.removeEventListener("change", this.cartTotalHandler);
    if (cartProductChecks) {
      cartProductChecks.forEach((cartProductCheck) => {
        cartProductCheck.removeEventListener(
          "change",
          this.productCheckHandler
        );
      });
    }
    if (cartProductDeletes) {
      cartProductDeletes.forEach((cartProductDelete) => {
        cartProductDelete.removeEventListener(
          "click",
          this.productDeleteHandler
        );
      });
    }
    if (cartProductDeleteSelected) {
      cartProductDeleteSelected.removeEventListener(
        "click",
        this.productDeleteSelectedHandler
      );
    }
    if (cartProductDecs) {
      cartProductDecs.forEach((cartProductDec) => {
        cartProductDec.removeEventListener("click", this.productDecHandler);
      });
    }
    if (cartProductIncs) {
      cartProductIncs.forEach((cartProductInc) => {
        cartProductInc.removeEventListener("click", this.productIncHandler);
      });
    }
    if (cartProductQuantitys) {
      cartProductQuantitys.forEach(cartProductQuantity => 
        cartProductQuantity.removeEventListener("change", this.productQuantityHandler)
      )
    }
    if (cartProductsVoucherBtn) {
      cartProductsVoucherBtn.removeEventListener(
        "click",
        this.cartVoucherBtnHandler
      );
    }
    if (cartPaymentBtn) {
      cartPaymentBtn.removeEventListener("click", this.cartPaymentHandler);
    }
  },
  handleEvents() {
    if (cartTotalCheck) {
      cartTotalCheck.addEventListener("change", this.cartTotalHandler);
    }
    if (cartProductChecks) {
      cartProductChecks.forEach((cartProductCheck) => {
        cartProductCheck.addEventListener("change", this.productCheckHandler);
      });
    }
    if (cartProductDeletes) {
      cartProductDeletes.forEach((cartProductDelete) => {
        cartProductDelete.addEventListener("click", this.productDeleteHandler);
      });
    }
    if (cartProductDeleteSelected) {
      cartProductDeleteSelected.addEventListener(
        "click",
        this.productDeleteSelectedHandler
      );
    }
    if (cartProductDecs) {
      cartProductDecs.forEach((cartProductDec) => {
        cartProductDec.addEventListener("click", this.productDecHandler);
      });
    }
    if (cartProductIncs) {
      cartProductIncs.forEach((cartProductInc) => {
        cartProductInc.addEventListener("click", this.productIncHandler);
      });
    }
    if (cartProductQuantitys) {
      cartProductQuantitys.forEach(cartProductQuantity =>
        cartProductQuantity.addEventListener("change", this.productQuantityHandler)
      )
    }
    if (cartProductsVoucherBtn) {
      cartProductsVoucherBtn.addEventListener("click", this.cartVoucherBtnHandler);
    }
    if(cartPaymentBtn) {
      cartPaymentBtn.addEventListener("click", this.cartPaymentHandler);
    }
  },
  init() {
    header.init();
    footerContainer.innerHTML = footer;
    this.productList = utils.getSession("cart");
    this.productSelected = [];
    this.renderHtml();
  },
};

export default app;
