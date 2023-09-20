import account from "../account.js"

let userInfoBtn;
let userPwdBtn;
let userHistoryBtn;

const userSideBar = {
    renderHtml(user, page) {
        document.querySelector(".user-sidebar").innerHTML = `
            <div class="user-sidebar-header">
                <img src="${user.Avatar ? user.Avatar : "../img/ava001.jpg"}" class="user-sidebar-avatar"></img>
                <span class="user-sidebar-name">${user.Username}</span>
            </div>
            <ul class="user-sidebar-list">
                <li class="user-sidebar-item">
                    <div class="user-sidebar-item-header">
                        <i class="fa-solid fa-user user-sidebar-item-icon"></i>
                        <span class="user-sidebar-item-heading">Tài khoản của tôi</span>
                    </div>
                    <ul class="user-sidebar-item-list">
                        <li class="user-sidebar-item-item ${page.code === 0 || page.code === 1 ? "active" : ""}">
                            <span class="account-btn">Hồ sơ cá nhân</span>
                        </li>
                        <li class="user-sidebar-item-item ${page.code === 2 ? "active" : ""}">
                            <span class="account-pwd-btn">Đổi mật khẩu</span>
                        </li>
                    </ul>
                </li>
                <li class="user-sidebar-item">
                    <div class="user-sidebar-item-header">
                        <i class="fa-solid fa-square-poll-horizontal user-sidebar-item-icon"></i>
                        <span class="user-sidebar-item-heading account-history-btn ${page.code === 3 ? "active" : ""}">Lịch sử mua hàng</span>
                    </div>
                </li>
            </ul>
        `

        this.removeEvents();

        userInfoBtn = document.querySelector(".user-sidebar .account-btn");
        userHistoryBtn = document.querySelector(".user-sidebar .account-history-btn");
        userPwdBtn = document.querySelector(".user-sidebar .account-pwd-btn");

        this.handleEvents();
    },
    userInfoSwitchPageHandler() {
        account.page.code = 0;
        account.renderHtml();
    },
    userEditPwdSwitchPageHandler() {
        account.page.code = 2;
        account.renderHtml();
    },
    userHistorySwitchPageHandler() {
        account.page.code = 3;
        account.renderHtml();
    },
    removeEvents() {
        if (userPwdBtn) {
            userPwdBtn.removeEventListener("click", this.userEditPwdSwitchPageHandler);
        }
        if (userInfoBtn) {
            userInfoBtn.removeEventListener("click", this.userInfoSwitchPageHandler);
        }
        if (userHistoryBtn) {
            userHistoryBtn.removeEventListener("click", this.userHistorySwitchPageHandler);
        }
    },
    handleEvents() {
        if (userPwdBtn) {
            userPwdBtn.addEventListener("click", this.userEditPwdSwitchPageHandler);
        }
        if (userInfoBtn) {
            userInfoBtn.addEventListener("click", this.userInfoSwitchPageHandler);
        }
        if (userHistoryBtn) {
            userHistoryBtn.addEventListener("click", this.userHistorySwitchPageHandler);
        }
    },
    init(user, page) {
        this.renderHtml(user, page);
    }
}

export default userSideBar;