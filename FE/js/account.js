import header from "./component/header.js";
import footer from "./component/footer.js";
import userSideBar from "./component/userSideBar.js";
import userHeader from "./component/userHeader.js";
import userContent from "./component/userContent.js";
import utils from "./utils/utils.js";

const footerContainer = document.querySelector(".footer");
const userContainer = document.querySelector(".user");

let user;

const app = {
    page: {},
    renderHtml() {
        userContainer.innerHTML = `
        <div class="user-sidebar"></div>
        <div class="user-info">
            <div class="user-info-header">
            </div>
            <div class="user-info-container">
            </div>
        </div>
        `
        userSideBar.init(user, this.page);
        userHeader.init(this.page);
        userContent.init(user, this.page);
    },
    init() {
        if (utils.getCookie("token")) {
            user = utils.getSession("user")
            header.init();
            footerContainer.innerHTML = footer;
            this.page.code = Number(new URL(window.location.href).searchParams.get("page"));
            this.renderHtml();
        } else {
            window.location.href = `${window.location.origin}/FE/index.html`
        }
  },
};

export default app;

// Page.code
//      0: Xem hồ sơ 
//      1: Sửa hồ sơ
//      2: Đổi mật khẩu
//      3: Lịch sử mua hàng
//      4: Đánh giá