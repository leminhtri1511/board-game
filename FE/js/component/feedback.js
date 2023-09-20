import userHistory from "./userHistory.js"
import notifyModal from "./notifyModal.js"

import feedbackAPI from "../api/feedbackAPI.js"
import utils from "../utils/utils.js";
import api from "../api/api.js";

let feedbackItems = [];
let feedbackRateIcons = [];
let feedbackImageBtns = [];
let feedbackBackBtn;
let feedbackSubmitBtn;
let feedbackImageDeleteBtns;

const token = utils.getCookie("token");

const feedback = {
    order: {}, 
    virtualURL: [],
    rate: [],
    comments: [],
    images: [],
    renderHtml() {
        document.querySelector(".feedback").innerHTML = `
            <ul class="feedback-list">
                ${this.order.products.map((item, index) => {
                    return `
                        <li class="feedback-item" data-id="${item.Id}">
                            <div class="feedback-product">
                                <div class="feedback-product-info">
                                    <img class="feedback-product-img" src="${item.MainImage ? item.MainImage : `../img/pd001.png`}">
                                    <span class="feedback-product-name">${item.Name}</span>
                                </div>
                                <div class="feedback-rate">
                                    <i class="feedback-rate-icon ${this.rate[index] >= 1 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                    <i class="feedback-rate-icon ${this.rate[index] >= 2 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                    <i class="feedback-rate-icon ${this.rate[index] >= 3 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                    <i class="feedback-rate-icon ${this.rate[index] >= 4 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                    <i class="feedback-rate-icon ${this.rate[index] >= 5 ? `active fa-solid fa-star` : `fa-regular fa-star`}"></i>
                                </div>
                            </div>
                            <div class="feedback-content">
                                <textarea class="feedback-comment" placeholder="Bình luận">${this.comments[index] ? this.comments[index] : ``}</textarea>
                                <div class="feedback-image">
                                    <ul class="feedback-image-list">
                                    ${this.virtualURL.length > 0 ? this.virtualURL[index].files.map(file => {
                                        return `
                                            <li class="feedback-image-item">
                                                <img class="feedback-image-img" src="${file}">
                                                <i class="fa-solid fa-circle-xmark feedback-image-delete"></i>
                                            </li>
                                        `
                                    }).join("") : ``}
                                    <label for="feedback-file-${item.Id}" class="btn btn-white btn-small feedback-image-btn">Thêm ảnh</label>
                                    <input type="file" id="feedback-file-${item.Id}" name="feedback-file"  accept="image/png, image/gif, image/jpeg" multiple hidden> 
                                    </ul>
                                </div>
                            </div>
                        </li>
                    `
                }).join("")}
            </ul>
            <div class="feedback-footer">
                <button class="btn btn-white feedback-back-btn btn-m-long">Trở lại</button>
                <button class="btn btn-primary feedback-submit-btn btn-m-long">Gửi nhận xét</button>
            </div>
        `

        this.removeEvents();

        feedbackItems = document.querySelectorAll(".feedback-item");
        feedbackRateIcons = [];
        feedbackImageBtns = [];
        feedbackItems.forEach(item => {
            feedbackRateIcons.push({
                Id: item.dataset.id,
                icons: item.querySelectorAll(".feedback-rate-icon")
            });
            feedbackImageBtns.push({
                Id: item.dataset.id,
                files: item.querySelector("input[name='feedback-file']")
            });
        })
        feedbackBackBtn = document.querySelector(".feedback-back-btn");
        feedbackSubmitBtn = document.querySelector(".feedback-submit-btn");
        feedbackImageDeleteBtns = document.querySelectorAll(".feedback-image-delete");

        this.handleEvents();
    },
    getCommentValue(){
        feedbackItems.forEach((item, index) => {
            feedback.comments[index] = item.querySelector(".feedback-comment").value;
        })
    },
    feedbackRateHandler(e) {
        const feedbackItem = e.target.closest(".feedback-item");
        const iconItem = e.target.closest(".feedback-rate-icon");
        const item = feedbackRateIcons.find(item => item.Id == feedbackItem.dataset.id);
        const itemIndex = feedbackRateIcons.indexOf(item);
        const icon = Array.from(feedbackRateIcons[itemIndex].icons).find(item => item === iconItem);
        const iconIndex = Array.from(feedbackRateIcons[itemIndex].icons).indexOf(icon);
        if (iconIndex + 1 === feedback.rate[itemIndex]) {
            feedback.rate[itemIndex] = 0;
        } else {
            feedback.rate[itemIndex] = iconIndex + 1;
        }
        feedback.getCommentValue();
        feedback.renderHtml(feedback.order);
    },
    feedbackImageHandler(e) {
        const feedbackItem = e.target.closest(".feedback-item");
        const fileItem = e.target.closest("input[name='feedback-file']");
        const item = feedbackImageBtns.find(item => item.Id == feedbackItem.dataset.id);
        const itemIndex = feedbackImageBtns.indexOf(item);
        if (fileItem.files.length > 0) {
            if (feedback.virtualURL[itemIndex].files.length + fileItem.files.length <= 7) {
                Array.from(fileItem.files).forEach(file => {
                    feedback.virtualURL[itemIndex].files.push(URL.createObjectURL(file));
                    feedback.images[itemIndex].push(file);
                })
                feedback.getCommentValue();
                feedback.renderHtml(feedback.order);
            } else {
                notifyModal.init("Vui lòng chọn tối đa 7 ảnh", () => {}, 1);
                notifyModal.showModal();
                feedback.getCommentValue();
            }
        }
    },
    feedbackBackHandler() {
        userHistory.isFeedback = false;
        userHistory.renderHtml();
    },
    async submitFeedback() {
        const item = userHistory.orders.find(order => order.Id == feedback.order.Id);
        let success = true;
        if (item) {
            feedback.getCommentValue();
            item.products.forEach(async (product, index) => {
                const form = new FormData();
                form.append("orderId", item.Id);
                form.append("productId", product.Id);
                form.append("stars", feedback.rate[index]);
                form.append("comment", feedback.comments[index]);
                feedback.images[index].forEach(item => {
                    form.append("listImage[]", item);
                }) 
    
                await feedbackAPI.addFeedback(form, token, (res) => {
                    if (res.success) {
    
                    } else {
                        success = false;
                        api.errHandler();
                    }
                }, () => {
                    success = false;
                    api.errHandler();
                })
            })
        } else {
            api.errHandler();
            success = false;
        }
        return success;
    },
    async feedbackSubmitHandler() {
        const success = await feedback.submitFeedback();
        const item = userHistory.orders.find(order => order.Id == feedback.order.Id);
        if (success) {
            item.feedbacked = true;
    
            notifyModal.init("Đánh giá thành công", () => {
                userHistory.isFeedback = false;
                userHistory.renderHtml();
            });
            notifyModal.showModal();
            window.scrollTo(0, 0);
            feedback.renderHtml();
        } 
    },
    feedbackImageDeleteHandler(e) {
        const imageItem = e.target.closest(".feedback-image-item").querySelector(".feedback-image-img");
        const productItem = e.target.closest(".feedback-item");
        const index = Array.from(feedbackItems).indexOf(productItem);
        const image = feedback.virtualURL[index].files.find(item => item === imageItem.src);
        const index2 = feedback.virtualURL[index].files.indexOf(image);
        feedback.virtualURL[index].files.splice(index2, 1);
        feedback.images[index].splice(index2, 1);
        feedback.getCommentValue();
        feedback.renderHtml();
    },
    removeEvents() {
        if (feedbackRateIcons) {
            feedbackRateIcons.forEach(item => {
                item.icons.forEach(icon => {
                    icon.removeEventListener("click", this.feedbackRateHandler);
                })
            })
        }
        if (feedbackImageBtns) {
            feedbackImageBtns.forEach(item => {
                item.files.removeEventListener("change", this.feedbackImageHandler);
            })
        }
        if (feedbackBackBtn) {
            feedbackBackBtn.removeEventListener("click", this.feedbackBackHandler);
        }
        if (feedbackSubmitBtn) {
            feedbackSubmitBtn.removeEventListener("click", this.feedbackSubmitHandler);
        }
        if (feedbackImageDeleteBtns) {
            feedbackImageDeleteBtns.forEach(feedbackImageDeleteBtn => {
                feedbackImageDeleteBtn.removeEventListener("click", this.feedbackImageDeleteHandler);
            })
        }
    },
    handleEvents() {
        if (feedbackRateIcons) {
            feedbackRateIcons.forEach(item => {
                item.icons.forEach(icon => {
                    icon.addEventListener("click", this.feedbackRateHandler);
                })
            })
        }
        if (feedbackImageBtns) {
            feedbackImageBtns.forEach(item => {
                item.files.addEventListener("change", this.feedbackImageHandler);
            })
        }
        if (feedbackBackBtn) {
            feedbackBackBtn.addEventListener("click", this.feedbackBackHandler);
        }
        if (feedbackSubmitBtn) {
            feedbackSubmitBtn.addEventListener("click", this.feedbackSubmitHandler);
        }
        if (feedbackImageDeleteBtns) {
            feedbackImageDeleteBtns.forEach(feedbackImageDeleteBtn => {
                feedbackImageDeleteBtn.addEventListener("click", this.feedbackImageDeleteHandler);
            })
        }
    },
    init(order) {
        if (order.Type != 3 || order.feedbacked === true) {
            userHistory.isFeedback = false;
            userHistory.renderHtml();
        } else {
            this.order = {...order};
            this.virtualURL = [];
            this.order.products.forEach(item => {
                this.virtualURL.push({
                    files: [],
                })
                this.images.push([]);
            })
            this.rate = [];
            this.comments = [];
            this.renderHtml(order);
        }
    }
}

export default feedback;