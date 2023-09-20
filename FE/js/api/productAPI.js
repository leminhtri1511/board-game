import api from "./api.js"

const productUrl = `${api.route}/products`

const productAPI = {
    async getListProduct(req, getListProductHandler = () => {}, errHandler = api.errHandler) {
        const {category, filter, key, page, pageSize} = req;
        const params = {
            url: `${productUrl}?${category ? `category=${category}` : ""}${filter ? `&filter=${filter}` : ``}${key ? `&key=${key}&` : ``}&page=${page}&pageSize=${pageSize}`,
            method: "GET",
            loading: true
        }
        await api.callAPI(params, getListProductHandler, errHandler);
    },
    async getProduct(req, getProductHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: `${productUrl}/${req.id}`,
            method: "GET",
            loading: true
        }
        await api.callAPI(params, getProductHandler, errHandler);
    }
}

export default productAPI;