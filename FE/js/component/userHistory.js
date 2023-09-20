import utils from "../utils/utils.js"
import confirmModal from "./confirmModal.js"
import feedback from "./feedback.js"
import userHeader from "./userHeader.js"

import orderAPI from "../api/orderAPI.js"
import api from "../api/api.js"

const order = {
    id: 0,
        date: "25/02/2022",
        dateGet: "3/02/2022",
        status: {
            id: 0,
            name: "Chờ xác nhận"
        },
        products: [
            {
                id: 0,
                image: "pd001.jpg",
                name: "Catan US",
                quantity: 1,
                price: 90000
            },
            {
                id: 1,
                image: "pd001.jpg",
                name: "Thám tử lừng danh Conan - Hồi kết",
                quantity: 3,
                price: 300000
            },
            {
                id: 2,
                image: "pd001.jpg",
                name: "Catan US",
                quantity: 2,
                price: 90000
            },
            {
                id: 3,
                image: "pd001.jpg",
                name: "Catan US",
                quantity: 10,
                price: 12878
            },
        ],
        voucher: 10
}

const token = utils.getCookie("token");
const userId = utils.getSession("user").Id;

// Order code
//  0: Chưa xác nhận
//  1: Xác nhận
//  2: Hoàn thành
//  3: Hủy

let statusBtns;
let cancleBtns;
let feedbackBtns;

Date.prototype.addDays = function (days) {
  let date = new Date(this.valueOf());
  date.setDate(date.getDate() + days);
  return date;
}

const userHistory = {
    // orders: [
    // {
    //     id: 2,
    //     date: "25/02/2022",
    //     dateGet: "3/02/2022",
    //     status: {
    //         id: 2,
    //         name: "Hoàn thành"
    //     },
    //     products: [
    //         {
    //             id: 0,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 1,
    //             price: 90000
    //         },
    //         {
    //             id: 1,
    //             image: "pd001.jpg",
    //             name: "Thám tử lừng danh Conan - Hồi kết",
    //             quantity: 3,
    //             price: 300000
    //         },
    //         {
    //             id: 2,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 2,
    //             price: 90000
    //         },
    //         {
    //             id: 3,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 10,
    //             price: 12878
    //         },
    //     ],
    //     voucher: 38,
    //     feedbacked: false
    // },
    // {
    //     id: 0,
    //     date: "25/02/2022",
    //     dateGet: "3/02/2022",
    //     status: {
    //         id: 0,
    //         name: "Chờ xác nhận"
    //     },
    //     products: [
    //         {
    //             id: 0,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 1,
    //             price: 90000
    //         },
    //         {
    //             id: 1,
    //             image: "pd001.jpg",
    //             name: "Thám tử lừng danh Conan - Hồi kết",
    //             quantity: 3,
    //             price: 300000
    //         },
    //         {
    //             id: 2,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 2,
    //             price: 90000
    //         },
    //         {
    //             id: 3,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 10,
    //             price: 12878
    //         },
    //     ],
    //     voucher: 10,
    //     feedbacked: false
    // },
    // {
    //     id: 1,
    //     date: "25/02/2022",
    //     dateGet: "3/02/2022",
    //     status: {
    //         id: 1,
    //         name: "Xác nhận"
    //     },
    //     products: [
    //         {
    //             id: 0,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 1,
    //             price: 90000
    //         },
    //         {
    //             id: 1,
    //             image: "pd001.jpg",
    //             name: "Thám tử lừng danh Conan - Hồi kết",
    //             quantity: 3,
    //             price: 300000
    //         },
    //         {
    //             id: 2,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 2,
    //             price: 90000
    //         },
    //         {
    //             id: 3,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 10,
    //             price: 12878
    //         },
    //     ],
    //     voucher: 99,
    //     feedbacked: false
    // },
    // {
    //     id: 3,
    //     date: "25/02/2022",
    //     dateGet: "3/02/2022",
    //     status: {
    //         id: 3,
    //         name: "Hủy"
    //     },
    //     products: [
    //         {
    //             id: 0,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 1,
    //             price: 90000
    //         },
    //         {
    //             id: 1,
    //             image: "pd001.jpg",
    //             name: "Thám tử lừng danh Conan - Hồi kết",
    //             quantity: 3,
    //             price: 300000
    //         },
    //         {
    //             id: 2,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 2,
    //             price: 90000
    //         },
    //         {
    //             id: 3,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 10,
    //             price: 12878
    //         },
    //     ],
    //     voucher: 0
    // },
    // {
    //     id: 4,
    //     date: "25/02/2022",
    //     dateGet: "3/02/2022",
    //     status: {
    //         id: 2,
    //         name: "Hoàn thành"
    //     },
    //     products: [
    //         {
    //             id: 0,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 1,
    //             price: 90000
    //         },
    //         {
    //             id: 1,
    //             image: "pd001.jpg",
    //             name: "Thám tử lừng danh Conan - Hồi kết",
    //             quantity: 3,
    //             price: 300000
    //         },
    //         {
    //             id: 2,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 2,
    //             price: 90000
    //         },
    //         {
    //             id: 3,
    //             image: "pd001.jpg",
    //             name: "Catan US",
    //             quantity: 10,
    //             price: 12878
    //         },
    //     ],
    //     voucher: 0,
    //     feedbacked: true
    // }
    // ],
    orders: [],
    page: 1,
    status: 0,
    isFeedback: false,
    renderHtml() {
        document.querySelector(".user-info-container").innerHTML = `
        ${!this.isFeedback ? `
            <div class="history-header">
                <span class="status-btn ${this.status == 0 ? "active" : ""}" data-code="0">Tất cả</span>
                <span class="status-btn ${this.status == 1 ? "active" : ""}" data-code="1">Chờ xác nhận</span>
                <span class="status-btn ${this.status == 2 ? "active" : ""}" data-code="2">Đang vận chuyển</span>
                <span class="status-btn ${this.status == 3 ? "active" : ""}" data-code="3">Đã nhận hàng</span>
                <span class="status-btn ${this.status == 4 ? "active" : ""}" data-code="4">Bị từ chối</span>
                <span class="status-btn ${this.status == 5 ? "active" : ""}" data-code="5">Đã hủy</span>
            </div>
            <ul class="history-list">
                ${this.orders.length > 0 ? 
                    this.orders.map(order => {
                        return `
                            <li class="history-item" data-id=${order.Id}>
                                <div class="history-item-header">
                                    <span>Ngày tạo đơn hàng ${utils.formatDate(order.CreatedAt)}</span>
                                    <span class="primary-text text-middle history-status">${order.Name}</span>
                                </div>
                                <ul class="history-product-list">
                                    ${order.products.map(product => {
                                        return `
                                            <li class="history-product-item">
                                                <div class="history-product-info">
                                                    <img src="${product.MainImage || `../img/pd001.png`}" class="history-product-img">
                                                    <div class="history-product-info-right">
                                                        <span>${product.Name}</span>
                                                        <span>x${product.Quantity}</span>
                                                    </div>
                                                </div>
                                                <span class="history-product-price">${utils.formatMoney(product.Price*product.Quantity)} VNĐ</span>
                                            </li>
                                        `
                                    }).join("")}
                                </ul>
                                <div class="history-footer">
                                    <div class="history-voucher-container">
                                        <span class="history-voucher">-${order.VoucherValue || 0}%</span>
                                    </div>
                                    <div class="history-footer-info">
                                        <span>Nhận sản phẩm và thanh toán trước ${utils.getFormattedDate(order.getDate)}</span>
                                        <span class="text-middle">Tổng số tiền: 
                                            <span class="primary-text">${utils.formatMoney(order.Value)} VNĐ</span>
                                        </span>
                                    </div>
                                    <div class="history-footer-action">
                                        ${order.Type == 1 ? `
                                            <button class="btn btn-primary btn-m-long cancle-btn">Hủy đơn hàng</button>
                                        ` : order.Type == 3 ? order.feedbacked == true ? `
                                            <span class="btn btn-success btn-m-long view">Đã đánh giá</span>
                                        ` : `<button class="btn btn-primary btn-m-long feedback-btn">Đánh giá</button>
                                        ` : order.Type == 4 || order.Type == 5 ? `
                                            <span class="btn btn-black btn-m-long view">Đã hủy</span>
                                        ` : ``}
                                    </div>
                                </div>
                            </li>
                        `
                    }).join("") : `
                        <span class="history-text">Không có đơn hàng nào</span>
                    `}
            </ul>
        ` : `<div class="feedback"></div>`}`

        this.removeEvents();

        statusBtns = document.querySelectorAll(".status-btn");
        cancleBtns = document.querySelectorAll(".cancle-btn");
        feedbackBtns = document.querySelectorAll(".feedback-btn");

        this.handleEvents();
    },
    async orderLoadingHandler() {
        const historyList = document.querySelector(".history-list");
        if (historyList) {
            const position = historyList.offsetHeight + historyList.getBoundingClientRect().top + window.scrollY - window.innerHeight;
            if (window.scrollY > position) {
                window.removeEventListener("scroll", userHistory.orderLoadingHandler);
                if (userHistory.orders.length >= 3) {
                    setTimeout(async () => {
                        const orderList = await userHistory.getOrder(++userHistory.page, 3, userHistory.status);
    
                        if (orderList.length > 0) {
                            orderList.forEach(item => {
                                userHistory.orders.push(item);
                            })
                            userHistory.renderHtml();
                        }
                    }, 300)
                }
            }
        }
    },
    async statusPageHandler(e) {
        const item = e.target.closest(".status-btn");
        if (item.dataset.code != userHistory.status) {
            userHistory.page = 1;
            const orderList = await userHistory.getOrder(userHistory.page, 3, Number(item.dataset.code));
            userHistory.orders = [...orderList];

            userHistory.status = Number(item.dataset.code);
            userHistory.renderHtml();
        }
    },
    async cancelOrderHandler(e) {
        const orderItem = e.target.closest(".history-item");
        
        if (orderItem) {
            const index = userHistory.orders.indexOf(userHistory.orders.find(item => item.Id == orderItem.dataset.id));
            confirmModal.init("Xác nhận hủy đơn hàng", async () => {
                const req = {
                    orderId: orderItem.dataset.id
                }
    
                await orderAPI.cancelOrder(req, token, (res) => {
                    if (res.success) {
                        userHistory.orders[index].Type = 5;
                        userHistory.orders[index].Name = "Huỷ";
                        confirmModal.hiddenModal();
                        userHistory.renderHtml();
                    } else {
                        confirmModal.hiddenModal();
                        api.errHandler();
                    }
                })
    
            });
            confirmModal.showModal();
        } else {
            api.errHandler();
        }
    },
    feedbackHandler(e) {
        const orderItem = e.target.closest(".history-item");
        const ord = userHistory.orders.find(item => item.Id == orderItem.dataset.id);
        userHistory.isFeedback = true;
        userHistory.renderHtml();
        userHeader.renderHtml({code: 3});
        feedback.init(ord);
    },
    removeEvents() {
        window.removeEventListener("scroll", this.orderLoadingHandler);
        if(statusBtns) {
            statusBtns.forEach(statusBtn => {
                statusBtn.removeEventListener("click", this.statusPageHandler);
            })
        }
        if(cancleBtns) {
            cancleBtns.forEach(cancleBtn => {
                cancleBtn.removeEventListener("click", this.cancelOrderHandler);
            })
        }
        if(feedbackBtns) {
            feedbackBtns.forEach(feedbackBtn => {
                feedbackBtn.removeEventListener("click", this.feedbackHandler);
            })
        }
    },
    handleEvents() {
        window.addEventListener("scroll", this.orderLoadingHandler);
        if(statusBtns) {
            statusBtns.forEach(statusBtn => {
                statusBtn.addEventListener("click", this.statusPageHandler);
            })
        }
        if(cancleBtns) {
            cancleBtns.forEach(cancleBtn => {
                cancleBtn.addEventListener("click", this.cancelOrderHandler);
            })
        }
        if(feedbackBtns) {
            feedbackBtns.forEach(feedbackBtn => {
                feedbackBtn.addEventListener("click", this.feedbackHandler);
            })
        }
    },
    async getOrder(page, pageSize, type = 0) {
        let orderList = [];
        let req = {
            userId: userId,
            page: page,
            pageSize: pageSize,
        }
        if (type) {
            req = {
                ...req,
                type: type
            }
        }
        await orderAPI.getListOrder(req, token, (res) => {
            if (res.success) {
                res.data.orders.forEach((order, index) => {
                    res.data.orders[index] = {
                        ...order,
                        getDate: new Date(Date.parse(order.CreatedAt)).addDays(15)
                    }
                })
                orderList = [...res.data.orders];
            } else {
                api.errHandler();
            }
        })
        return orderList;
    },
    async init() {
        history.scrollRestoration = 'manual';
        if (this.orders.length <= 0) {
            const orderList = await this.getOrder(this.page, 3);
            this.orders = [...orderList];
        }
        this.isFeedback = false; 
        this.renderHtml();
    }
}

export default userHistory;