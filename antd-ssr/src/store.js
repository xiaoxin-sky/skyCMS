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
            //重新获取分类列表
            setArtList(state, {listData,totalCount}) {
                let allData =[listData];
                Vue.set(state, 'articleList',{
                    listData,
                    totalCount,
                    allData
                });
            },
            //新增列表内某一页数据
            addPagenationList(state,{listData , totalCount}){
                 // 是同一个分类发起的请求，则需要把数据合并起来。而不是全部替换
                let allData = state.articleList.allData.concat([listData]);
                Vue.set(state, 'articleList', {
                    listData,
                    totalCount,
                    allData
                });
            },
            //切换为缓存数据
            changeArtList(state,pageNum){
                let articleList = state.articleList;
                Vue.set(articleList,'listData',articleList.allData[pageNum]);
            },
            setNavBar(state, data) {
                Vue.set(state, 'navBarData', data);
            },
            setArtDetail(state,data){
                Vue.set(state,'artDetail',data);
            }
        },
        actions: {
            async navBar({ commit,state }) {
                //如果导航已经过，不在进行获取
                if(state.navBarData.length>0)return;
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