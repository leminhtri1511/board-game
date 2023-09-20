import utils from "../utils/utils.js"

const userInfo = {
    renderHtml(user) {
        document.querySelector(".user-info-container").innerHTML = `
            <ul class="user-info-list">
                <li class="user-info-item">
                    <span class="user-info-label">Tên đăng nhập</span>
                    <span class="user-info-content">${user.Username}</span>
                </li>
                <li class="user-info-item">
                    <span class="user-info-label">Họ và tên</span>
                    <span class="user-info-content none">
                        ${user.FullName ? user.FullName : "Chưa có"}
                    </span>
                </li>
                <li class="user-info-item">
                    <span class="user-info-label">Email</span>
                    <span class="user-info-content">
                        ${user.Email ? user.Email : "Chưa có"}
                    </span>
                </li>
                <li class="user-info-item">
                    <span class="user-info-label">Số điện thoại</span>
                    <span class="user-info-content none">
                        ${user.Phone ? user.Phone : "Chưa có"}
                    </span>
                </li>
                <li class="user-info-item">
                    <span class="user-info-label">Giới tính</span>
                    <ul class="user-info-option-list">
                        <li class="user-info-option-item ${user.Gender == 0 ? "active" : ""}">
                            <div class="user-info-option-icon"></div>
                            <span>Nam</span>
                        </li>
                        <li class="user-info-option-item ${user.Gender == 1 ? "active" : ""}">
                            <div class="user-info-option-icon"></div>
                            <span>Nữ</span>
                        </li>
                        <li class="user-info-option-item ${!user.Gender ? "active" : ""}">
                            <div class="user-info-option-icon"></div>
                            <span>Khác</span>
                        </li>
                    </ul>
                </li>
                <li class="user-info-item">
                    <span class="user-info-label">Ngày sinh</span>
                    <span class="user-info-content">
                        ${user.DOB ? utils.formatDate(user.DOB) : "Chưa có"}
                    </span>
                </li>
            </ul>
            <div class="user-info-avatar">
                <img src="${user.Avatar ? user.Avatar : "../img/ava001.jpg"}" class="user-info-avatar-image"></img>
            </div>
        `
    },
    init(user) {
        this.renderHtml(user)
    }
}

export default userInfo;