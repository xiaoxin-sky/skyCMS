import axios from "axios";
const config = {
    baseURL: 'http://api.9cka.cn/api/',
    // baseURL: 'http://localhost:3000/api/',
    // timeout: 1000,
    withCredentials: true,
    headers: { 'X-Custom-Header': 'foobar' }
}
const _axios = axios.create(config);
_axios.interceptors.request.use(
    function (config) {
        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

_axios.interceptors.response.use(
    function (response) {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    function (error) {
        return Promise.reject(error);
    }
);
let Plugin = {
    install(Vue) {
        Vue.axios = _axios;
        Object.defineProperties(Vue.prototype, {
            axios: {
                get() {
                    return _axios;
                }
            },
            $axios: {
                get() {
                    return _axios;
                }
            },
        });
    }
}
export default Plugin;