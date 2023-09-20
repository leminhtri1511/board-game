import userEdit from "./userEdit.js";
import userEditPwd from "./userEditPwd.js";
import userHistory from "./userHistory.js";
import userInfo from "./userInfo.js";

const userContent = {
    renderHtml(user, page) {
        if (page.code === 0) {
            userInfo.init(user);
        }
        else if (page.code === 1) {
            userEdit.init(user);
        } else if (page.code === 2) {
            userEditPwd.init();
        } else if (page.code === 3) {
            userHistory.init();
        }
    },
    init(user, page) {
        this.renderHtml(user, page);
    }
}

export default userContent;