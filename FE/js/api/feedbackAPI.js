import api from "./api.js"

const feedbackUrl = `${api.route}/feedback`

const feedbackAPI = {
    async addFeedback(req, token, addFeedbackHandler = () => {}, errHandler = () => api.errHandler) {
        const params = {
            url: feedbackUrl,
            method: "POST",
            token: token,
            req: req,
            file: true,
            loading: true
        }
        await api.callAPI(params, addFeedbackHandler, errHandler);
    },
}

export default feedbackAPI;