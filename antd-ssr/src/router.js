import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

export function createRouter() {
    return new Router({
        mode: 'history',
        routes: [
            {
                path: '/',
                component: () => import(/* webpackChunkName: "Index" */ '@/components/common/Index.vue').then(c=>c.default),
                meta: { title: '小新的个人博客网站' },
                children:[
                    
                    {
                        path:':category?',
                        component:()=>import(/* webpackChunkName: "category" */'@/components/page/ArticleList.vue'),
                        meta: { title: '小新的个人博客网站' },
                        props: true,
                    },
                    {
                        path:':category/:article',
                        component:()=>import(/* webpackChunkName: "article" */'@/components/page/Aritcel.vue'),
                        meta: { title: '小新的个人博客网站' },
                        props: true,
                    }
                ]
            }
        ]
    })
}