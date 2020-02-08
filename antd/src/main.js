import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import router from './router';
import Vue2Editor from "vue2-editor";


Vue.config.productionTip = false
Vue.use(Antd);
Vue.use(Vue2Editor);
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
