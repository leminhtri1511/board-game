import notifyModal from "./notifyModal.js";
import account from "../account.js";
import userAPI from "../api/userAPI.js";
import utils from "../utils/utils.js";

let userAvatarInput;
let userAvatar;

const userEdit = {
    virtualURL: "",
    message: "",
    renderHtml() {
        const user = utils.getSession("user");
        document.querySelector(".user-info-container").innerHTML = `
            <form class="user-info-form">
                <div class="user-info-form-group">
                    <label class="user-info-form-label">Tên đăng nhập</label>
                    <span class="user-info-content">${user.Username}</span>
                </div>
                <div class="user-info-form-group">
                    <label class="user-info-form-label">Họ và tên</label>
                    <input type="text" class="user-info-form-control" placholder="Chưa có" name="fullname" value="${user.FullName ? user.FullName : ""}">
                    <span class="user-info-form-message"></span>
                </div>
                <div class="user-info-form-group">
                    <label class="user-info-form-label">Email</label>
                    <input type="email" class="user-info-form-control" value="${user.Email}" name="email">
                    <span class="user-info-form-message"></span>
                </div>
                <div class="user-info-form-group">
                    <label class="user-info-form-label">Số điện thoại</label>
                    <input type="text" class="user-info-form-control" placeholder="Chưa có" name="phone" value="${user.Phone ? user.Phone : ""}">
                    <span class="user-info-form-message"></span>
                </div>
                <div class="user-info-form-group">
                    <label class="user-info-form-label">Giới tính</label>
                    <div class="user-info-form-radio">
                        <div class="user-info-option-form-group">
                            <input type="radio" value="0" name="gender" id="user-gender-0" ${user.Gender == 0 ? "checked" : ""}>
                            <label for="user-gender-0">Nam</label>
                        </div>
                        <div class="user-info-option-form-group">
                            <input type="radio" value="1" name="gender" id="user-gender-1" ${user.Gender == 1 ? "checked" : ""}>
                            <label for="user-gender-1">Nữ</label>
                        </div>
                        <div class="user-info-option-form-group">
                            <input type="radio" value="" name="gender" id="user-gender-2" ${!user.Gender ? "checked" : ""}>
                            <label for="user-gender-2">Khác</label>
                        </div>
                    </div>
                </div>
                <div class="user-info-form-group">
                    <label class="user-info-form-label">Ngày sinh</label>
                    <input type="date" class="user-info-form-control" value="${user.DOB ? utils.inputFormatDate(user.DOB) : ""}" name="birthday">
                    <span class="user-info-form-message"></span>
                </div>
                <div class="user-info-avatar">
                    <img src="${user.Avatar ? user.Avatar : "../img/ava001.jpg"}" class="user-info-avatar-image"></img>
                    <input type="file" id="user-avatar-input" accept="image/png, image/gif, image/jpeg" hidden>
                    <label for="user-avatar-input" class="btn btn-white">Chọn ảnh</label>
                </div>
                <div class="user-info-form-group">
                    <label class="user-info-form-label"></label>
                    <button class="btn btn-primary">Lưu</button>
                </div>
            </form>
        `

        this.removeEvents();

        userAvatarInput = document.querySelector("#user-avatar-input");
        userAvatar = document.querySelector(".user-info-avatar-image")

        this.handleEvents();

        Validator({
            form: ".user-info-form",
            formGroupSelector: ".user-info-form-group",
            errorSelector: ".user-info-form-message",
            rules: [
                Validator.maxLength('input[name="fullname"]', 50),
                Validator.isEmail('input[name="email"]'),
                Validator.minLength('input[name="phone"]', 10),
                Validator.maxLength('input[name="phone"]', 11),
                Validator.isOnlyNumber('input[name="phone"]')
            ],
            onSubmit: function (data) {
                userEdit.updateUserHandler(data);
            },
        });
    },
    errHandler() {
        notifyModal.init("Có lỗi xảy ra. Vui lòng thử lại", () => {}, 1);
        notifyModal.showModal();
    },
    async updateUserHandler(data) {
        const form = new FormData();
        form.append("id", utils.getSession("user").Id);
        form.append("fullName", data.fullname);
        form.append("phone", data.phone);
        form.append("dob", data.birthday);
        form.append("gender", data.gender);
        form.append("email", data.email);
        form.append("avatar", userAvatarInput.files[0]);
        const token = utils.getCookie("token");
        await userAPI.updateUser(form, token, (res) => {
            if (res.success) {
                const user = utils.getSession("user");

                const newUser = {
                    ...user,
                    FullName: data.fullname,
                    Email: data.email,
                    Phone: data.phone,
                    Gender: data.gender ? data.gender : null,
                    DOB: data.birthday,
                    Avatar: res.data.avatarPath
                }

                utils.setSession("user", newUser);

                notifyModal.init("Cập nhật hồ sơ", () => {
                    account.init();
                });
                notifyModal.showModal();
            } else {
                userEdit.errHandler();
            }
        }, userEdit.errHandler);
    },
    avatarChangeHandler(e) {
        if (e.target.files[0]) {
            userEdit.virtualURL = URL.createObjectURL(e.target.files[0]);
            userAvatar.src = userEdit.virtualURL;
        }
    },
    removeEvents() {
        if (userAvatarInput) {
            userAvatarInput.removeEventListener("change", this.avatarChangeHandler);       
        }
    },
    handleEvents() {
        if (userAvatarInput) {
            userAvatarInput.addEventListener("change", this.avatarChangeHandler);       
        }
    },
    init() {
        this.renderHtml();
    }
}

export default userEdit;