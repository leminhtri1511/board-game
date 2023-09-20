import api from "./api.js"

const orderUrl = `${api.route}/orders`
const userUrl = `${api.route}/users`

const orderAPI = {
    async getListOrder(req, token, getListOrderHandler = () => {}, errHandler = () => api.errHandler) {
        const params = {
            url: `${userUrl}/${req.userId}/orders?page=${req.page}&pageSize=${req.pageSize}${req.type ? `&type=${req.type}` : ""}`,
            method: "GET",
            token: token,
            loading: true
        }
        await api.callAPI(params, getListOrderHandler, errHandler);
    },
    async addOrder(req, token, addOrderHandler = () => {}, errHandler = () => api.errHandler) {
        const params = {
            url: orderUrl,
            method: "POST",
            token: token,
            req: req,
            loading: true
        }
        await api.callAPI(params, addOrderHandler, errHandler);
    },
    async cancelOrder(req, token, cancelOrderHandler = () => {}, errHandler = () => api.errHandler) {
        const params = {
            url: `${orderUrl}/${req.orderId}/cancel`,
            method: "PATCH",
            token: token,
            req: req
        }
        await api.callAPI(params, cancelOrderHandler, errHandler);
    },
}

export default orderAPI;