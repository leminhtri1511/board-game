import productList from "./productList.js"

import api from "../api/api.js";
import categoryAPI from "../api/categoryAPI.js";

let categoryItems;

const category = {
    categoryList: [],
    id: "",
    renderHtml() {
        document.querySelector(".category").innerHTML = `
            <span class="category-heading">Danh mục sản phẩm</span>
            <ul class="category-list">
                <li class="category-item ${this.id == "" ? "active" : ""}" data-id="">
                    <span class="category-name">Tất cả</span>
                    <i class="fa-solid fa-caret-right"></i>
                </li>
                ${this.categoryList.map(item => {
                    return `
                        <li class="category-item ${this.id == item.Id ? "active" : ""}" data-id="${item.Id}">
                            <span class="category-name">Board game ${item.Name}</span>
                            <i class="fa-solid fa-caret-right"></i>
                            
                        </li>
                    `
                }).join("")}
            </ul>
        `;

        this.removeEvents();

        categoryItems = document.querySelectorAll(".category-item");

        this.handleEvents();
    },
    categorySelectHandler(e) {
        const item = e.target.closest(".category-item");
        category.id = item.dataset.id;
        productList.category = item.dataset.id;
        productList.pageActive = 1;
        productList.key = "";
        productList.filter = 0;
        category.renderHtml()
        productList.renderHtml();
    },
    removeEvents() {
        if (categoryItems) {
            categoryItems.forEach(categoryItem => {
                categoryItem.removeEventListener("click", this.categorySelectHandler);
            })
        }
    },
    handleEvents() {
        if (categoryItems) {
            categoryItems.forEach(categoryItem => {
                categoryItem.addEventListener("click", this.categorySelectHandler);
            })
        }
    },
    async init() {
        await categoryAPI.getListCategory((res) => {
            if (res.success) {
                category.categoryList = [...res.data.categories];
            } else {
                api.errHandler();
            }
        }) 
        this.renderHtml();
    }
} 

export default category;
