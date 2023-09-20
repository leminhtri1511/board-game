import modal from "../utils/modal.js"

const notifyModal = {
    renderHtml(content, closeFunc, type) {
        const notifyModal = document.querySelector(".modal .notification");
        if (notifyModal) {
            notifyModal.remove();
        } 
        document.querySelector("body").insertAdjacentHTML('beforeend', `
            <div class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-body">
                    <div class="notification">
                        ${type === 0 ? `
                            <i class="fa-regular fa-circle-check success-icon"></i>
                        ` : type === 1 ? `
                            <i class="fa-regular fa-circle-xmark fail-icon"></i>
                        ` : ``}
                        <span>${content}</span>
                    </div>
                </div>
            </div>
        `)
        modal.init(closeFunc);
    },
    hiddenModal(closeFunc = () => {}) {
        const modals = document.querySelectorAll(".modal");
        const notifyModal = document.querySelector(".modal .notification").closest(".modal");
        const index = Array.from(modals).indexOf(notifyModal);
        modal.hiddenModal(index, closeFunc);
    },
    showModal() {
        const modals = document.querySelectorAll(".modal");
        const notifyModal = document.querySelector(".modal .notification").closest(".modal");
        const index = Array.from(modals).indexOf(notifyModal);
        modal.showModal(index);
    },
    init(content, closeFunc = () => {}, type = 0) {
        this.renderHtml(content, closeFunc, type);
    }
}

export default notifyModal;