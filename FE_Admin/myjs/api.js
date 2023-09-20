const api = {
    route: `http://localhost:3000/api/v1`,
    async callAPI(params, sucessHandler = () => {}, errHandler = () => {}) {
        
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
        } else {
            headers["Enctype"] = "multipart/form-data";
            headers["Content-Type"] = false;
            headers["Process-Data"] = false;
        }
        // const headers = token ? {
        //     "Authorization" : `Bearer ${token}`
        // } : {
        //     "Content-Type" : file ? "multipart/form-data" : "application/json",
        // }
        const obj = method === "GET" ? {
            method: method,
            headers: headers,
        } : {
            method: method,
            headers: headers,
            body: file ? req : JSON.stringify(req),
        }
        await fetch(url, obj)
        .then(res => res.json())
        .then(data => sucessHandler(data))
        .catch(err => {
            console.log(err);
            errHandler(); 
        })

        if (loading) {
            document.querySelector(".loading").remove();
        }
    },
}

export default api;