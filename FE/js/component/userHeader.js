import account from "../account.js";
import userHistory from "./userHistory.js"

let userInfoBtn;
let userEditBtn;
let userHistoryBtn;

const userHeader = {
    renderHtml(page) {
        document.querySelector(".user-info-header").innerHTML = `
            ${page.code === 0 || page.code === 1 || page.code === 2 ? `
                <span class="user-info-header-heading info-btn ${page.code !== 1 ? "active" : ""}">Hồ sơ của tôi`
                :
                `<span class="user-info-header-heading active history-btn">Lịch sử mua hàng`}
            </span>
            ${page.code === 0 || page.code === 1 ? `
                <div class="user-info-header-action ${page.code === 1 ? "active" : ""}">
                    <i class="fa-solid fa-pen"></i>
                    <span>Sửa hồ sơ</span>
                </div>
            `
            : page.code === 3 && userHistory.isFeedback == true ? `
                <span class="user-info-header-sub">// Đánh giá</span>
            ` : ``}
        `

        this.removeEvents();

        userInfoBtn = document.querySelector(".user-info-header-heading.info-btn");
        userHistoryBtn = document.querySelector(".user-info-header-heading.history-btn");
        userEditBtn = document.querySelector(".user-info-header-action");

        this.handleEvents();
    },
    userInfoSwitchPageHandler() {
        account.page.code = 0;
        account.renderHtml();
    },
    userEditSwitchPageHandler() {
        account.page.code = 1;
        account.renderHtml();
    },
    userHistorySwitchPageHandler() {
        account.page.code = 3;
        account.renderHtml();
    },
    removeEvents() {
        if (userEditBtn) {
            userEditBtn.removeEventListener("click", this.userEditSwitchPageHandler);
        }
        if (userInfoBtn) {
            userInfoBtn.removeEventListener("click", this.userInfoSwitchPageHandler);
        }
        if (userHistoryBtn) {
            userHistoryBtn.removeEventListener("click", this.userHistorySwitchPageHandler);
        }
    },
    handleEvents() {
        if (userEditBtn) {
            userEditBtn.addEventListener("click", this.userEditSwitchPageHandler);
        }
        if (userInfoBtn) {
            userInfoBtn.addEventListener("click", this.userInfoSwitchPageHandler);
        }
        if (userHistoryBtn) {
            userHistoryBtn.addEventListener("click", this.userHistorySwitchPageHandler);
        }
    },
    init(page) {
        this.renderHtml(page);
    }
}

export default userHeader;