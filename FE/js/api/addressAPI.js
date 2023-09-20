import api from "./api.js"

const addressUrl = `${api.route}/users`

const addressAPI = {
    async getProvine(getProvinceHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: `https://provinces.open-api.vn/api/?depth=3`,
        }
        await api.callAPI(params, getProvinceHandler, errHandler);
    },
    async getListAddress(req, token, getListAddressHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: `${addressUrl}/${req.userId}/address`,
            token: token,
            method: "GET",
        }
        await api.callAPI(params, getListAddressHandler, errHandler);
    },
    async addAddress(req, token, addAddressHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: `${addressUrl}/${req.userId}/address`,
            token: token,
            method: "POST",
            req: req,
        }
        await api.callAPI(params, addAddressHandler, errHandler);
    },
    async updateAddress(req, token, updateAddressHandler = () => {}, errHandler = api.errHandler) {
        const userId = req.userId;
        const addressId = req.addressId;
        delete req.userId;
        delete req.addressId;

        const params = {
            url: `${addressUrl}/${userId}/address/${addressId}`,
            token: token,
            method: "PATCH",
            req: req,
        }
        await api.callAPI(params, updateAddressHandler, errHandler);
    },
    async deleteAddress(req, token, deleteAddressHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: `${addressUrl}/${req.userId}/address/${req.addressId}`,
            token: token,
            method: "DELETE",
        }
        await api.callAPI(params, deleteAddressHandler, errHandler);
    },
}

export default addressAPI;