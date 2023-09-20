import header from "./component/header.js";
import footer from "./component/footer.js";

const app = {
    renderHtml() {
        document.querySelector(".content").innerHTML = `
            <div class="about-us-header border-b-solid">
                <span>Về chúng tôi</span>
            </div>
            <div class="about-us-content">
                <div class="logo">
                    <img class="logo-img" src="../img/logo002.png">
                </div>
                <div class="about-us-section heading">
                    <span class="about-us-heading">Mục tiêu của chúng tôi</span>
                    <p class="about-us-paragraph">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit tempus elit cras facilisis nullam quam. A, tristique congue posuere tristique eget non. Consequat egestas ultrices velit in aliquet velit. Pretium proin adipiscing tempus egestas ultrices. Massa posuere arcu a, quam. Lacus, ipsum neque pellentesque ac.
                    </p>
                    <p class="about-us-paragraph">
                        Velit erat elementum fringilla feugiat ut. Nunc est egestas sapien pharetra. Sit nibh aenean consectetur neque vitae laoreet et. Gravida amet justo, in ut maecenas amet porttitor tincidunt. Molestie vitae mauris ullamcorper condimentum. Id in donec sit metus sagittis eu, convallis nunc. Dictum leo venenatis tortor quisque non. Nibh libero massa sed nullam. Pharetra, enim, eget vestibulum pharetra vulputate mattis id quis nibh. Ultrices in tempus et praesent cras aliquam vitae elit. Nec nisl enim morbi eros dapibus.
                    </p>
                </div>
                <span class="about-us-heading">Về đội ngũ chúng tôi</span>
                <div class="about-us-section">
                    <div class="about-us-section-img">
                        <img src="../img/abs001.png">
                    </div>
                    <div class="about-us-section-content">
                        <span class="about-us-sub-heading">Đội ngũ Front-End</span>
                        <p class="about-us-paragraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit tempus elit cras facilisis nullam quam. A, tristique congue posuere tristique eget non. Consequat egestas ultrices velit in aliquet velit. Pretium proin adipiscing tempus egestas ultrices. Massa posuere arcu a, quam. Lacus, ipsum neque pellentesque ac.
                        </p>
                        <p class="about-us-paragraph">
                            Velit erat elementum fringilla feugiat ut. Nunc est egestas sapien pharetra. Sit nibh aenean consectetur neque vitae laoreet et. Gravida amet justo, in ut maecenas amet porttitor tincidunt. Molestie vitae mauris ullamcorper condimentum.
                        </p>
                    </div>
                </div>
                <div class="about-us-section">
                    <div class="about-us-section-content">
                        <span class="about-us-sub-heading">Đội ngũ Back-End</span>
                        <p class="about-us-paragraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit tempus elit cras facilisis nullam quam. A, tristique congue posuere tristique eget non. Consequat egestas ultrices velit in aliquet velit. Pretium proin adipiscing tempus egestas ultrices. Massa posuere arcu a, quam. Lacus, ipsum neque pellentesque ac.
                        </p>
                        <p class="about-us-paragraph">
                            Velit erat elementum fringilla feugiat ut. Nunc est egestas sapien pharetra. Sit nibh aenean consectetur neque vitae laoreet et. Gravida amet justo, in ut maecenas amet porttitor tincidunt. Molestie vitae mauris ullamcorper condimentum.
                        </p>
                    </div>
                    <div class="about-us-section-img">
                        <img src="../img/abs002.png">
                    </div>
                </div>
                <div class="about-us-section">
                    <div class="about-us-section-img">
                        <img src="../img/abs002.png">
                    </div>
                    <div class="about-us-section-content">
                        <span class="about-us-sub-heading">Đội ngũ Làm Màu</span>
                        <p class="about-us-paragraph">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit tempus elit cras facilisis nullam quam. A, tristique congue posuere tristique eget non. Consequat egestas ultrices velit in aliquet velit. Pretium proin adipiscing tempus egestas ultrices. Massa posuere arcu a, quam. Lacus, ipsum neque pellentesque ac.
                        </p>
                        <p class="about-us-paragraph">
                            Velit erat elementum fringilla feugiat ut. Nunc est egestas sapien pharetra. Sit nibh aenean consectetur neque vitae laoreet et. Gravida amet justo, in ut maecenas amet porttitor tincidunt. Molestie vitae mauris ullamcorper condimentum.
                        </p>
                    </div>
                </div>
            </div>
        `
    },
    init() {
        this.renderHtml();
        header.renderHtml();
        document.querySelector(".footer").innerHTML = footer;
    }
}

export default app;