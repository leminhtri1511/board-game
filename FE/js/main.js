import header from "./component/header.js";
import footer from "./component/footer.js";
import banner from "./component/banner.js";
import category from "./component/category.js";
import productList from "./component/productList.js";

import slider from "./utils/slider.js";

const footerContainer = document.querySelector(".footer");

const app = {
  init() {
    header.init();
    productList.init();
    footerContainer.innerHTML = footer;
    banner.init();
    category.init();

    slider.init();
  },
};

export default app;
