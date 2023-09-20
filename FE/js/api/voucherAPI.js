import api from "./api.js"

const voucherUrl = `${api.route}/vouchers`

const voucherAPI = {
    async getListVoucher(token, getListVoucherHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: `${voucherUrl}/`,
            method: "GET",
            token: token
        }
        await api.callAPI(params, getListVoucherHandler, errHandler);
    },
    async getVoucher(req, token, getVoucherHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: `${voucherUrl}/${req.id}`,
            method: "GET",
            req: req,
            token: token,
            loading: true
        }
        await api.callAPI(params, getVoucherHandler, errHandler);
    }
}

export default voucherAPI;