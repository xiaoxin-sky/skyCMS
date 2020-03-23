import axios from 'axios';
import bus from '../components/common/bus';
const service = axios.create({
    // process.env.NODE_ENV === 'development' 来判断是否开发环境
    // easy-mock服务挂了，暂时不使用了
    // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
    baseURL:'http://api.9cka.cn/admin/',
    // baseURL:'http://localhost:3000/admin/',
    timeout: 5000,
    // withCredentials:true
});

service.interceptors.request.use(
    config => {
        let token = localStorage.getItem('access_token');
        if (token) {
            config.headers = {
                'access-token': token,
                'Content-Type':'application/json',
                'authorization': 'Bearer '+token
            }
        }
        //下面这块还没实现。无缝更新token。
        if (config.url === 'refresh') {
            config.headers = {
                'refresh-token': localStorage.getItem('refresh_token'),
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
        return config;
    },
    error => {
        console.log(error);

        return Promise.reject();
    }
);

service.interceptors.response.use(
    response => {
        if (response.status === 200) {
            return response.data;
        } else {
            Promise.reject();
        }
    },
    error => {
        // console.log(error);
        if(error.response.status == 401){
            bus.$confirm('登陆失效，请重新登陆！', '系统提示', {
                confirmButtonText: '确定',
                type: 'warning'
            }).then(()=>{
                    localStorage.removeItem('ms_username');
                    bus.$emit('tokenInvalid');
            });
        }else{
            console.log(error);
        }
        return Promise.reject();
    }
);

export default service;
