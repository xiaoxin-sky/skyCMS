import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);
export function createStore() {
    return new Vuex.Store({
        state: {
            navBarData: [],
            articleList: {
                listData:[],
                totalCount:0,
                allData:[]//储存每个分页数据的二维数组，每一页都是一个数组
            },
            artDetail:{
                content:'<h1 style="text-align:center;margin-top: 10%;">文章不存在!</h1>'
            }
        },
        mutations: {
            setArtList(state, {listData,totalCount}) {
                // 是同一个分类发起的请求，则需要把数据合并起来。而不是全部替换
                let allData =[listData];
                Vue.set(state, 'articleList',{
                    listData,
                    totalCount,
                    allData
                });
            },
            //添加列表内某一页数据
            addPagenationList(state,{listData , totalCount}){
                let allData = state.articleList.allData.concat([listData]);
                console.log(allData);
                
                Vue.set(state, 'articleList', {
                    listData,
                    totalCount,
                    allData
                });
            },
            setNavBar(state, data) {
                Vue.set(state, 'navBarData', data);
            },
            setArtDetail(state,data){
                Vue.set(state,'artDetail',data);
            },
            setCategory(state,category){
                Vue.set(state,'category',category);
            },
            changeArtList(state,arrPageNum){
                //把渲染列表所用的数据源，切换成allData中对应页码的数据源
                Vue.set(state.articleList,'listData',state.articleList.allData[arrPageNum]);
            }
        },
        actions: {
            async navBar({ commit }) {
                let res = await (Vue.axios.get('navbar/getNavList'));
                commit('setNavBar', res.data);
            },
            async articleList({ commit },{params}) {
                let res = await (Vue.axios.get('artical/getArticalList',{params}));
                commit('setArtList', res.data);
            },
            async getPagenationList({commit},{params}){
                let res = await (Vue.axios.get('artical/getArticalList',{params}));
                commit('addPagenationList', res.data);
            },
            async articleDetail({commit},{id}){
                let res = await (Vue.axios.get('artical/getArticalDetails',{
                    params:{
                    id:id
                }}))
                if(res.code="200"){
                    if(res.data[0]){
                        commit('setArtDetail', res.data[0]);
                    }else{
                        commit('setArtDetail',{
                            content:'<h1 style="text-align:center;margin-top: 10%;">文章不存在！</h1>',
                        });
                    }
                    
                }else{
                    commit('setArtDetail',{
                        content:'<h1 style="text-align:center;margin-top: 10%;">获取文章失败</h1>',
                        cate_path:'null'
                    });
                }
            }
        }
    })
}
function getNavList() {
    return Vue.axios.get('navbar/getNavList');
}

function getarticleList() {
    return Vue.axios.get('artical/getarticleList');
}