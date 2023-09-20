import modal from "../utils/modal.js";
import cart from "../cart.js";
import header from "./header.js";
import notifyModal from "./notifyModal.js"
import utils from "../utils/utils.js";

import api from "../api/api.js";
import voucherAPI from "../api/voucherAPI.js";

let voucherInput;
let voucherApplyBtn;
let voucherChecks;
let voucherGetBtn;
let voucherAddBtns;
let voucherBackBtn;
let modalSelectBtn;

const voucher = {
    message: "",
    isGet: false,
    voucherAllList: [],
    voucherList: [],
    voucherSelected: {},
    renderHtml() {
        if (document.querySelector(".voucher")) {
            const voucherModal = document.querySelector(".voucher").closest(".modal");
            voucherModal.innerHTML = `
                <div class="modal-overlay"></div>
                <div class="modal-body">
                <div class="voucher">
                <div class="voucher-header border-b-dashed">
                ${!this.isGet ? `
                <span class="voucher-heading">Nhập mã Voucher</span>
                                <div class="voucher-action">
                                    <input type="text" class="voucher-input ${this.message ? "invalid" : ""}">
                                    <span class="voucher-message primary-text text-small">${this.message}</span>
                                    <button class="btn btn-white voucher-apply-btn">Áp dụng</button>
                                </div>
                            ` : `
                                <span class="voucher-back-btn">&lt; Trở lại</span>
                                <span class="voucher-heading">Lấy mã voucher</span>
                            `}
                        </div>
                        <ul class="voucher-list border-b-dashed">
                            ${!this.isGet ?
                                this.voucherList.length === 0 ? 
                                `<div class="voucher-text">
                                    <span>Bạn chưa có voucher nào</span>
                                </div>` :
                                this.voucherList.map(item => {
                                    return `
                                        <li class="voucher-item" data-id=${item.Id}>
                                            <div class="voucher-info">
                                                <img src="../img/icon_voucher.png" alt="">
                                                <div class="voucher-content">
                                                    <div class="voucher-content-header">
                                                        <span class="voucher-name">${item.Code}</span>
                                                        <span class="voucher-discount">( Giảm ${item.Value}% )</span>
                                                    </div>
                                                    <span class="primary-text">Sắp hết hạn: ${utils.formatDate(item.Expired)}</span>
                                                </div>
                                            </div>
                                            <input type="checkbox" class="voucher-check" ${
                                                this.voucherSelected.Id == item.Id ? "checked" : ""
                                            }>
                                        </li>
                                    `
                                }).join("")
                            : this.voucherAllList.length === 0 ? 
                                `<div class="voucher-text">
                                    <span>Hiện không có voucher nào</span>
                                </div>`
                            : this.voucherAllList.map((item) => {
                                return `
                                    <li class="voucher-item" data-id=${item.Id}>
                                        <div class="voucher-info">
                                            <img src="../img/icon_voucher.png" alt="">
                                            <div class="voucher-content">
                                                <div class="voucher-content-header">
                                                    <span class="voucher-name">${item.Code}</span>
                                                    <span class="voucher-discount">( Giảm ${item.Value}% )</span>
                                                </div>
                                                <span class="primary-text">Sắp hết hạn: ${utils.formatDate(item.Expired)}</span>
                                            </div>
                                        </div>
                                        ${this.voucherList.find(vch => vch.Id == item.Id) ? `
                                            <span class="voucher-add-text">Đã lấy</span>
                                        ` : `
                                            <span class="voucher-add-text voucher-add-btn">Lấy mã</span>
                                        `}
                                    </li>
                                `
                            }).join("")}
                        </ul>
                        <div class="voucher-footer">
                            ${!this.isGet ? `
                                <span class="voucher-get-btn">Lấy mã voucher</span>
                                <div class="voucher-footer-btn">
                                    <button class="btn btn-transparent modal-close-btn">Đóng</button>
                                    <button class="btn btn-m-long btn-primary modal-select-btn">OK</button>
                                </div>
                            ` : ``}
                        </div>
                    </div>
                </div>
            `
            modal.init(() => header.renderHtml());
            this.removeEvents();
    
            voucherInput = document.querySelector(".voucher-input");
            voucherApplyBtn = document.querySelector(".voucher-apply-btn");
            voucherChecks = document.querySelectorAll(".voucher-check");
            voucherGetBtn = document.querySelector(".voucher-get-btn");
            voucherAddBtns = document.querySelectorAll(".voucher-add-btn");
            voucherBackBtn = document.querySelector(".voucher-back-btn");
            modalSelectBtn = document.querySelector(".modal-select-btn");
    
            this.handleEvents();
        }
    },
    errHandler() {
        notifyModal.init("Có lỗi xảy ra. Vui lòng thử lại", () => {}, 1);
        notifyModal.showModal();
        voucher.renderHtml();
        cart.renderHtml();
        header.renderHtml();
    },
    async voucherApplyHandler() {
        const req = {
            id: voucherInput.value
        }

        const token = utils.getCookie("token");

        await voucherAPI.getVoucher(req, token, (res) => {
            if (res.success) {
                const vch = voucher.voucherList.find(item => item.Id === res.data.voucher.Id);
                if (!vch) { 
                    voucher.message = "";
                    voucher.voucherList.push(res.data.voucher);
                    voucher.voucherSelected = {...res.data.voucher};
                } else {
                    voucher.message = "Voucher đã có";
                }
            } else {
                voucher.message = "Voucher không hợp lệ";
            }
        });
        voucher.renderHtml();    
    },
    checkHandler(e) {
        if (e.target.checked) {
            const voucherItem = e.target.closest(".voucher-item");
            voucher.voucherList.forEach(item => {
                if (item.Id == voucherItem.dataset.id) {
                    voucher.voucherSelected = item;
                }
            })
        } else {
            voucher.voucherSelected = {};   
        }
        voucher.renderHtml();
    },
    modalSelectHandler() {
        cart.renderHtml();
        const voucherModal = document.querySelector(".voucher").closest(".modal");
        const index = Array.from(document.querySelectorAll(".modal")).indexOf(voucherModal);
        modal.hiddenModal(index);
    },
    voucherGetHandler() {
        voucher.isGet = true;
        voucher.renderHtml();
    },
    voucherBackHandler() {
        voucher.isGet = false;
        voucher.renderHtml();
    },
    voucherAddHandler(e) {
        const voucherItem = e.target.closest(".voucher-item");
        const vch = voucher.voucherAllList.find(item => item.Id == voucherItem.dataset.id);
        voucher.voucherList.push(vch);
        voucher.renderHtml();
    },
    removeEvents() {
        if (voucherApplyBtn)
            voucherApplyBtn.removeEventListener("click", this.voucherApplyHandler);
        if (voucherChecks) {
            voucherChecks.forEach(voucherCheck => {
                voucherCheck.removeEventListener("click", this.checkHandler);
            })
        }
        if (voucherGetBtn) {
            voucherGetBtn.removeEventListener("click", this.voucherGetHandler);
        }
        if (voucherBackBtn) {
            voucherBackBtn.removeEventListener("click", this.voucherBackHandler);
        }
        if (voucherAddBtns) {
            voucherAddBtns.forEach(voucherAddBtn => {
                voucherAddBtn.removeEventListener("click", this.voucherAddHandler);
            })
        }
    },
    handleEvents() {
        if (voucherApplyBtn) 
            voucherApplyBtn.addEventListener("click", this.voucherApplyHandler);
        if (voucherChecks) {
            voucherChecks.forEach(voucherCheck => {
                voucherCheck.addEventListener("click", this.checkHandler);
            })
        }
        if (modalSelectBtn) {
            modalSelectBtn.addEventListener("click", this.modalSelectHandler)
        }
        if (voucherGetBtn) {
            voucherGetBtn.addEventListener("click", this.voucherGetHandler);
        }
        if (voucherBackBtn) {
            voucherBackBtn.addEventListener("click", this.voucherBackHandler);
        }
        if (voucherAddBtns) {
            voucherAddBtns.forEach(voucherAddBtn => {
                voucherAddBtn.addEventListener("click", this.voucherAddHandler);
            })
        }
    },
    async init() {    
        // Call Get All voucher API
        const token = utils.getCookie("token");
        await voucherAPI.getListVoucher(token, (res) => {
            if (res.success) {
                voucher.voucherAllList = res.data.voucher;
            } else {
                api.errHandler();
            }
        });

        this.renderHtml();
    }
}

export default voucher;