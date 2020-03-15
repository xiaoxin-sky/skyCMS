import Vue from 'vue';
import App from './App.vue';
import { createRouter } from "./router";
import { createStore } from './store';
import { sync } from 'vuex-router-sync'
import Antd from 'ant-design-vue';
import axios from "./plugins/axios";

// import { VueEditor } from "vue2-editor";
Vue.use(Antd);
Vue.use(axios);
// Vue.use(VueEditor);
export default function createApp() {
    const router = createRouter();
    const store = createStore();
    sync(store,router);
    const app = new Vue({
        router,
        store,
        render: h => h(App)
    });
    return { app, router ,store }
}