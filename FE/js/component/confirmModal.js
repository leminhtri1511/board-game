import modal from "../utils/modal.js"

let submitBtn;

const confirmModal = {
    renderHtml(content, submitFunc) {
        const confirmModal = document.querySelector(".modal .confirm-dialog");
        if (confirmModal) {
            confirmModal.remove();
        } 
        document.querySelector("body").insertAdjacentHTML('beforeend', `
            <div class="modal">
                <div class="modal-overlay"></div>
                <div class="modal-body">
                    <div class="confirm-dialog">
                        <span class="confirm-dialog-content">${content}</span>
                        <div class="confirm-dialog-footer">
                            <span class="btn btn-long btn-white modal-close-btn">Trở lại</span>
                            <button class="btn btn-long btn-primary modal-submit-btn">Xác nhận</button>
                        </div>
                    </div>
                </div>
            </div>
        `)

        modal.init();

        this.removeEvents(submitFunc);

        submitBtn = document.querySelector(".modal .confirm-dialog .modal-submit-btn");

        this.handleEvents(submitFunc);
    },
    hiddenModal() {
        const modals = document.querySelectorAll(".modal");
        const confirmModal = document.querySelector(".modal .confirm-dialog").closest(".modal");
        const index = Array.from(modals).indexOf(confirmModal);
        modal.hiddenModal(index);
    },
    showModal() {
        const modals = document.querySelectorAll(".modal");
        const confirmModal = document.querySelector(".modal .confirm-dialog").closest(".modal");
        const index = Array.from(modals).indexOf(confirmModal);
        modal.showModal(index);
    },
    removeEvents(submitFunc) {
        if (submitBtn) {
            submitBtn.removeEventListener("click", submitFunc);
        }
    },
    handleEvents(submitFunc) {
        if (submitBtn) {
            submitBtn.addEventListener("click", submitFunc);
        }
    },
    init(content, submitFunc) {
        this.renderHtml(content, submitFunc);
    }
}

export default confirmModal;