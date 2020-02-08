import Vue from 'vue'
import VueRouter from 'vue-router'
import Index from '../components/common/Index.vue'
// import artList from '../components/page/ArticalList.vue'
// import Test from '../components/common/Test1.vue'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/index',
    meta:{title:'小新的个人博客网站'}
  },
  {
    path: '/:category?/:article?',
    component:Index,
    meta:{title:'小新的个人博客网站'},
    props:true
  }

]

const router = new VueRouter({
  mode: 'history',
  routes
})

export default router
