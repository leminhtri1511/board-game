// import userAPI from "./api/userAPI.js";

let pwdIcons;
let loginBtn;

const app = {
  message: "",
  username: "",
  renderHtml() {
    document.querySelector(".center-container").innerHTML = `
      <form action="" class="form-authentication" id="form-login">
        <div class="form-title">
            <h3>Đăng nhập</h3>
        </div>
        <div class="form-list">
            <div class="form-group">
                <input type="text" class="form-control" placeholder="Tên đăng nhập" name="username" value="${this.username}">
                <span class="form-message"></span>
            </div>
            <div class="form-group ${this.message ? "invalid" : ""}">
                <input type="password" class="form-control" placeholder="Mật khẩu" name="password">
                <div class="form-icon">
                    <i class="fa-solid fa-eye active"></i>
                    <i class="fa-solid fa-eye-slash"></i>
                </div>
                <span class="form-message">${this.message}</span>
            </div>
        </div>
        <button class="btn btn-primary btn-full login-btn">ĐĂNG NHẬP</button>
      </form>
    `

    this.removeEvents();

    pwdIcons = document.querySelectorAll(".form-icon");
    loginBtn = document.querySelector(".login-btn");

    this.handleEvents();
  },


  handleCreateProducts() {
    var createBtn = document.querySelector("#create");
    createBtn.onclick = function () {
      var name = document.querySelector('input[name="name"]').value;
      var category = document.querySelector('input[category="category"]').value;
      var formData = {
        name: name,
        category: category,
      };
      createProduct(formData, function () {
        getProductions(renderProducts);
      });
    };
  },
  
  createProduct(data, callback) {
    var option = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
    fetch(productsApi, option)
      .then(function (response) {
        response.json();
      })
      .then(callback);
  },
  
  errHandler(err) {
    console.log(err);
  },
  hiddenDisplayPwdHandler(e) {
    const pwdInput = e.target.closest(".form-group").querySelector("input");
    const pwdIcon = e.target.closest(".form-icon");
    pwdInput.type === "password" ? pwdInput.type = "text" : pwdInput.type = "password";
    pwdIcon.querySelectorAll("i").forEach((icon) => {
      icon.classList.toggle("active");
    });
  },
  async signInHandler(e) {
    // e.preventDefault();
    // const usernameInput = document.querySelector("input[name='username']");
    // const passwordInput = document.querySelector("input[name='password']");
    // app.username = usernameInput.value;
    // const req = {
    //   username: usernameInput.value,
    //   password: passwordInput.value
    // }
    // await userAPI.signIn(req, (res) => {
    //   if (res.success && !res.data.user.Role) {
    //     window.location.href = `${window.origin}/FE/index.html`;
    //     utils.setCookie("token", res.data.token);
    //     utils.setSession("user", res.data.user);
    //     utils.setSession("cart", res.data.user.cart);
    //   } else {
    //     app.message = `Mật khẩu không chính xác`;
    //   }
    // }, app.errHandler)
    // app.renderHtml();
  },
  removeEvents() {
    if (pwdIcons) {
      pwdIcons.forEach(pwdIcon => {
        pwdIcon.removeEventListener("click", this.hiddenDisplayPwdHandler);
      });
    }
    if (loginBtn) {
      loginBtn.removeEventListener("click", this.signInHandler);
    }
  },
  handleEvents() {
    if (pwdIcons) {
      pwdIcons.forEach(pwdIcon => {
        pwdIcon.addEventListener("click", this.hiddenDisplayPwdHandler);
      });
    }
    if (loginBtn) {
      loginBtn.addEventListener("click", this.signInHandler);
    }
  },

  init() {
    this.renderHtml();
  },
};

export default app;