import notifyModal from "../component/notifyModal.js";

const api = {
    route: `http://localhost:3000/api/v1`,
    errHandler() {
        notifyModal.init("Có lỗi xảy ra. Vui lòng thử lại", () => {}, 1);
        notifyModal.showModal();
    },
    async callAPI(params, sucessHandler = () => {}, errHandler = this.errHandler) {
        
        const { url, method, token, file, req, loading } = params;

        if (loading) {
            const loading = document.createElement("div");
            loading.classList.add("loading");
            document.body.appendChild(loading);
        }

        const headers  = {};
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
        if (!file) {
            headers["Content-Type"] = "application/json"
        } 

        const obj = method === "GET" || method === "DELETE" ? {
            method: method,
            headers: headers,
        } : method === "POST" || method === "PATCH" ? {
            method: method,
            headers: headers,
            body: file ? req : JSON.stringify(req),
        } : {}

        await fetch(url, obj)
        .then(res => res.json())
        .then(data => sucessHandler(data))
        .catch(err => {
            errHandler(); 
        })

        if (loading) {
            document.querySelector(".loading").remove();
        }
    },
}

export default api;