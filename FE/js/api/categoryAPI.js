import api from "./api.js"

const categoryUrl = `${api.route}/categories`

const categoryAPI = {
    async getListCategory(getListCategoryHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: categoryUrl,
            method: "GET",
            loading: true
        }
        await api.callAPI(params, getListCategoryHandler, errHandler);
    },
}

export default categoryAPI;