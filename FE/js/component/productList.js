import notifyModal from "./notifyModal.js";
import utils from "../utils/utils.js"

import api from "../api/api.js";
import productAPI from "../api/productAPI.js";

let firstPageBtn;
let lastPageBtn;
let previousPageBtn;
let nextPageBtn;
let productPaginationList;
let searchInput;
let searchIcon;
let filterSelect;

const productList = {
  count: 0,
  pageActive: 1,
  totalPage: 1,
  key: "",
  filter: 0,
  category: "",
  productLst: [],
  async renderHtml() {
    const req = {
      filter: this.filter,
      key: this.key,
      category: this.category,
      page: this.pageActive,
      pageSize: 10
    }
    await productAPI.getListProduct(req, (res) => {
      if (res.success) {
          productList.productLst = [...res.data.products];
          productList.totalPage = res.data.count % req.pageSize 
              ? Math.floor(res.data.count / req.pageSize) + 1
              : res.data.count / req.pageSize ;
          productList.count = res.data.count;
      } else {
          api.errHandler();
      }
    });

    document.querySelector(".products").innerHTML = `
      <div class="products-header">
            <div class="products-heading">
                <span>Sản phẩm</span>
                <span class="products-heading-sub">
                  ${this.key ? `//Tìm kiếm` : ""}
                </span>
                <span class="products-quantity">//${this.count}</span>
            </div>
            <div class="products-search">
                <input type="text" class="products-search-input" value="${this.key}">
                <i class="fa-solid fa-magnifying-glass products-search-icon"></i>
            </div>
        </div>
        <div class="products-sub-header">
            <div class="products-filter">
                <span class="products-filter-heading">Sắp xếp theo</span>
                <select name="" id="" class="products-filter-select">
                    <option value="0" class="products-filter-option" ${this.filter === 0 ? "selected" : ""}>Mới nhất</option>
                    <option value="1" class="products-filter-option" ${this.filter === 1 ? "selected" : ""}>Giá thấp</option>
                    <option value="2" class="products-filter-option" ${this.filter === 2 ? "selected" : ""}>Giá cao</option>
                </select>
            </div>
            <div class="products-pagination">
                <button class="products-pagination-first products-pagination-btn">
                    <i class="fa-solid fa-backward"></i>
                </button>
                <button class="products-pagination-previous products-pagination-btn">
                    <i class="fa-solid fa-caret-left"></i>
                </button>
                <ul class="products-pagination-list">
                </ul>
                <button class="products-pagination-next products-pagination-btn">
                    <i class="fa-solid fa-caret-right"></i>
                </button>
                <button class="products-pagination-last products-pagination-btn">
                    <i class="fa-solid fa-forward"></i>
                </button>
            </div>
        </div>
        ${this.productLst.length > 0 ? 
          `<div class="products-list">
            ${this.productLst.map(product => {
              return `
                <a href="./pages/product_detail.html?product-id=${product.Id}">
                  <div class="product-item">
                  <img class="product-img" src="${product.MainImage}"></img>
                  <span class="product-name">${product.Name}</span>
                  <span class="product-description">${product.ShortDesc}</span>
                  <span class="product-price">${utils.formatMoney(product.Price)} VNĐ</span>
                  </div>
                </a>`;
            }).join("")}
            </div>` : `
              <span class="products-text">Không tìm thấy sản phẩm</span>
        `}
    `

    this.remvoveEvents();

    firstPageBtn = document.querySelector(".products-pagination-first");
    lastPageBtn = document.querySelector(".products-pagination-last");
    previousPageBtn = document.querySelector(".products-pagination-previous");
    nextPageBtn = document.querySelector(".products-pagination-next");
    productPaginationList = document.querySelector(".products-pagination-list");
    searchInput = document.querySelector(".products-search-input");
    searchIcon = document.querySelector(".products-search-icon");
    filterSelect = document.querySelector(".products-filter-select"); 

    this.pagination();

    this.handleEvents();
  },
  pagination() {
    if (this.pageActive <= 1) {
      firstPageBtn.classList.add("disabled");
      previousPageBtn.classList.add("disabled");
      if (this.totalPage > 1) {
        lastPageBtn.classList.remove("disabled");
        nextPageBtn.classList.remove("disabled");
      } else {
        lastPageBtn.classList.add("disabled");
        nextPageBtn.classList.add("disabled");
      }
    } else if (this.pageActive >= this.totalPage) {
      lastPageBtn.classList.add("disabled");
      nextPageBtn.classList.add("disabled");
      firstPageBtn.classList.remove("disabled");
      previousPageBtn.classList.remove("disabled");
    } else {
      firstPageBtn.classList.remove("disabled");
      previousPageBtn.classList.remove("disabled");
      lastPageBtn.classList.remove("disabled");
      nextPageBtn.classList.remove("disabled");
    }

    let paginationHtml = "";
    let firstNumber;
    let lastNumber;
    if (this.totalPage <= 5) {
      firstNumber = 1;
      lastNumber = this.totalPage;
    } else if (this.pageActive <= 3) {
      firstNumber = 1;
      lastNumber = 5;
    } else if (this.pageActive >= this.totalPage - 2) {
      firstNumber = this.totalPage - 4;
      lastNumber = this.totalPage;
    } else {
      firstNumber = this.pageActive - 2;
      lastNumber = this.pageActive + 2;
    }
    if (firstNumber > lastNumber)
      lastNumber = firstNumber;
    for (let i = firstNumber; i <= lastNumber; i++) {
      paginationHtml +=
        i == this.pageActive
          ? `<li class="products-pagination-item active" data-index=${i}>${i}</li>`
          : `<li class="products-pagination-item" data-index=${i}>${i}</li>`;
    }
    productPaginationList.innerHTML = paginationHtml;
  },
  firstPageHandler() {
    if (!firstPageBtn.classList.contains("disabled")) {
      productList.pageActive = 1;
      productList.renderHtml();
    }
  },
  lastPageHandler() {
    if (!lastPageBtn.classList.contains("disabled")) {
      productList.pageActive = productList.totalPage;
      productList.renderHtml();
    }
  },
  previousPageHandler() {
    if (!previousPageBtn.classList.contains("disabled")) {
      productList.pageActive--;
      productList.renderHtml();
    }
  },
  nextPageHandler() {
    if (!nextPageBtn.classList.contains("disabled")) {
      productList.pageActive++;
      productList.renderHtml();
    }
  },
  pageHandler(e) {
    const item = e.target.closest(".products-pagination-item");
    if (item) {
      productList.pageActive = Number(item.dataset.index);
      productList.renderHtml();
    }
  },
  searchHandler(e) {
    if (e.target.matches(".products-search-icon") || e.key === "Enter") {
      productList.key = searchInput.value;
      productList.pageActive = 1;
      productList.renderHtml();
    }
  },
  filterHandler() {
    productList.filter = Number(filterSelect.value);
    productList.pageActive = 1;
    productList.renderHtml();
  },
  remvoveEvents() {
    if (firstPageBtn) {
      firstPageBtn.removeEventListener("click", this.firstPageHandler);
    }
    if (lastPageBtn) {
      lastPageBtn.removeEventListener("click", this.lastPageHandler);
    }
    if (previousPageBtn) {
      previousPageBtn.removeEventListener("click", this.previousPageHandler);
    }
    if (nextPageBtn) {
      nextPageBtn.removeEventListener("click", this.nextPageHandler);
    }
    if (searchInput) {
      searchInput.removeEventListener("keypress", this.searchHandler);
    }
    if (searchIcon) {
      searchIcon.removeEventListener("click", this.searchHandler);
    }
    if (filterSelect) {
      filterSelect.removeEventListener("change", this.filterHandler);
    }
  },
  handleEvents() {
    if (firstPageBtn) {
      firstPageBtn.addEventListener("click", this.firstPageHandler);
    }
    if (lastPageBtn) {
      lastPageBtn.addEventListener("click", this.lastPageHandler);
    }
    if (previousPageBtn) {
      previousPageBtn.addEventListener("click", this.previousPageHandler);
    }
    if (nextPageBtn) {
      nextPageBtn.addEventListener("click", this.nextPageHandler);
    }
    if (productPaginationList) {
      productPaginationList.addEventListener("click", this.pageHandler);
    }
    if (searchInput) {
      searchInput.addEventListener("keypress", this.searchHandler);
    }
    if (searchIcon) {
      searchIcon.addEventListener("click", this.searchHandler);
    }
    if (filterSelect) {
      filterSelect.addEventListener("change", this.filterHandler);
    }
  },
  init() {
    this.pageActive = 1;
    this.renderHtml();
  },
};

export default productList;
