const products = [
    {
        id: 86,
        image: "banner001.png",
        name: "Catan US",
        players: "5-10 người",
        time: "30-50 phút"
    },
    {
        id: 87,
        image: "banner002.png",
        name: "Mèo nổ",
        players: "5-10 người",
        time: "30-50 phút"
    },
    {
        id: 88,
        image: "banner003.png",
        name: "Bang! Bang! Bang!!!",
        players: "5-10 người",
        time: "30-50 phút"
    }
]

let bannerItems;

const banner = {
    renderHtml() {
        document.querySelector(".banner").innerHTML = `
            <div class="banner-box-shadow"></div>
            <div class="slider">
                <div class="slider-row">
                    <ul class="slider-list" data-col="1" data-gap="0px">
                    ${products.map(item => {
                        return `
                        <li class="slider-item banner-item" data-id="${item.id}">
                            <div class="banner-left">
                                <img src="./img/${item.image}" alt="" class="slider-img">
                            </div>
                            <div class="banner-right">
                                <h3 class="banner-item-name">${item.name}</h3>
                                <div class="banner-item-players">
                                    <i class="fa-solid fa-user"></i>
                                    <span>${item.players}</span>
                                </div>
                                <div class="banner-item-time">
                                    <i class="fa-solid fa-clock"></i>
                                    <span>${item.time}</span>
                                </div>
                                <div class="banner-item-link">
                                    <span>Xem thêm...</span>
                                    <i class="fa-solid fa-caret-right"></i>
                                </div>
                            </div>
                        </li>
                        `
                    }).join("")}
                    </ul>
                </div>
            </div>
        `;

        this.removeEvents();

        bannerItems = document.querySelectorAll(".banner-item");

        this.handleEvents();
    },
    bannerClickHandler(e) {
        const item = e.target.closest(".banner-item");
        if (item) {
            window.location.href = `${window.location.origin}/FE/pages/product_detail.html?product-id=${item.dataset.id}`
        }
    },
    removeEvents() {
        if(bannerItems) {
            bannerItems.forEach(bannerItem => {
                bannerItem.removeEventListener("click", this.bannerClickHandler);
            })
        }
    },
    handleEvents() {
        if(bannerItems) {
            bannerItems.forEach(bannerItem => {
                bannerItem.addEventListener("click", this.bannerClickHandler);
            })
        }
    },
    init() {
        this.renderHtml();
    }
}


export default banner;
