import header from "./component/header.js";
import notifyModal from "./component/notifyModal.js";
import userAPI from "./api/userAPI.js"

let pwdIcons;

const app = {
  message: "",
  username: "",
  email: "",
  renderHtml() {
    document.querySelector(".center-container").innerHTML = `
      <form action="" class="form-authentication" id="form-register">
          <div class="form-title">
              <h3>Đăng ký</h3>
          </div>
          <div class="form-list">
              <div class="form-group ${this.message ? "invalid" : ""}">
                  <input type="text" class="form-control" placeholder="Tên đăng nhập" name="username" value="${this.username}">
                  <span class="form-message">${this.message}</span>
              </div>
              <div class="form-group">
                  <input type="email" class="form-control" placeholder="Email" name="email" value="${this.email}">
                  <span class="form-message"></span>
              </div>
              <div class="form-group">
                  <input type="password" class="form-control" placeholder="Mật khẩu" name="password">
                  <div class="form-icon">
                      <i class="fa-solid fa-eye active"></i>
                      <i class="fa-solid fa-eye-slash"></i>
                  </div>
                  <span class="form-message"></span>
              </div>
              <div class="form-group">
                  <input type="password" class="form-control" placeholder="Nhập lại mật khẩu" name="repassword">
                  <div class="form-icon">
                      <i class="fa-solid fa-eye active"></i>
                      <i class="fa-solid fa-eye-slash"></i>
                  </div>
                  <span class="form-message"></span>
              </div>
          </div>
          <button class="btn btn-primary btn-full">ĐĂNG KÝ</button>
          <span class="form-text">Bằng việc đăng kí, bạn đã đồng ý với Boardgame KTPM về <br>
              <span class="primary-text"> Điều khoản dịch vụ </span>
              &
              <span class="primary-text">Chính sách bảo mật</span>
          </span>
          <div class="form-footer">
              <span>Bạn đã có tài khoản?</span>
              <a href="login.html" class="primary-link">&nbsp;Đăng nhập</a>
          </div>
      </form>
    `

    this.removeEvents();

    pwdIcons = document.querySelectorAll(".form-icon");

    this.handleEvents();

    Validator({
      form: "#form-register",
      formGroupSelector: ".form-group",
      errorSelector: ".form-message",
      rules: [
        Validator.isRequired('input[name="username"]', "Vui lòng nhập tên đăng nhập"),
        Validator.minLength('input[name="username"]', 4),
        Validator.isRequired('input[name="email"]', "Vui lòng nhập email"),
        Validator.isEmail('input[name="email"]'),
        Validator.isRequired('input[name="password"]',"Vui lòng nhập mật khẩu"),
        Validator.minLength('input[name="password"]', 6),
        Validator.isRequired('input[name="repassword"]', "Vui lòng nhập mật khẩu"),
        Validator.isConfirmed('input[name="repassword"]',
          function () {
            return document.querySelector('#form-register input[name="password"]').value;
          }, "Mật khẩu nhập lại không trùng khớp"
        ),
      ],
      onSubmit: function (data) {

        app.signUpHandler(data);
      },
    });
  },
  async signUpHandler(data) {
    const req = {
      username: data.username,
      email: data.email,
      password: data.password,
    }
    await userAPI.signUp(req, (res) => {
      if (res.success) {
        notifyModal.init("Đăng ký thành công");
        notifyModal.showModal();
        app.message = ``;
        app.username = "";
        app.email = "";
      } else {
        app.message = `Tên đăng nhập đã tồn tại`;
        app.username = req.username;
        app.email = req.email;
      }
      app.renderHtml();
    });
  },
  hiddenDisplayPwdHandler(e) {
    const pwdInput = e.target.closest(".form-group").querySelector("input");
    const pwdIcon = e.target.closest(".form-icon");
    pwdInput.type === "password" ? pwdInput.type = "text" : pwdInput.type = "password";
    pwdIcon.querySelectorAll("i").forEach((icon) => {
      icon.classList.toggle("active");
    });
  },
  removeEvents() {
    if (pwdIcons) {
      pwdIcons.forEach(pwdIcon => {
        pwdIcon.removeEventListener("click", this.hiddenDisplayPwdHandler);
      });
    }
  },
  handleEvents() {
    if (pwdIcons) {
      pwdIcons.forEach(pwdIcon => {
        pwdIcon.addEventListener("click", this.hiddenDisplayPwdHandler);
      });
    }
  },
  init() {
    header.init();
    this.renderHtml();
  },
};

export default app;
