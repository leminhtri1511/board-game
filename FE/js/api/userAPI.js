import api from "./api.js"

const signInUrl = `${api.route}/auth/signin`;
const signUpUrl = `${api.route}/auth/signup`;
const changePwdUrl = `${api.route}/auth/changepass`;
const updateUser = `${api.route}/users`

const userAPI = {
    async signIn(req, signInHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: signInUrl,
            method: "POST",
            req: req,
            loading: true,
        }
        await api.callAPI(params, signInHandler, errHandler);
    },
    async signUp(req , signUpHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: signUpUrl,
            method: "POST",
            req: req,
            loading: true,
        }
        await api.callAPI(params, signUpHandler, errHandler);
    },
    async changePwd(req, token, changePwdHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: changePwdUrl,
            method: "PATCH",
            token: token,
            req: req,
            loading: true,
        }
        await api.callAPI(params, changePwdHandler, errHandler);
    },
    async updateUser(req, token, updateUserHandler = () => {}, errHandler = api.errHandler) {
        const params = {
            url: `${updateUser}/${req.get("id")}`,
            method: "PATCH",
            token: token,
            file: true,
            req: req,
            loading: true,
        }
        await api.callAPI(params, updateUserHandler, errHandler);
    }   
}

export default userAPI;