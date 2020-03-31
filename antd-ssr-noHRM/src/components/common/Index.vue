<template>
  <a-spin :spinning="spinning">
    <a-layout class="sky-layout" id="components-layout-demo-fixed">
      <a-layout-header class="header" >
        <div class="navbox">
          <router-link to="/index">
            <div class="logo">小新的个人博客网站</div>
          </router-link>
          <nav-bar></nav-bar>
        </div>
      </a-layout-header>
      <a-layout-content class="content">
        <a-row :gutter="16">
          <a-col :span="18"  class="gutter-box">
            <div :style="{ background: '#fff', padding: '24px', minHeight: '290px' }">
              <router-view></router-view>
            </div>
          </a-col>
          <a-col :span="6"  class="gutter-box">
            <s-list-bar></s-list-bar>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer class="footer" >
        <a-row type="flex" justify="center"> 
          <a-col> SkyCMS©2020 Created by <a href="https://www.9cka.cn">小新博客</a></a-col>
        </a-row>
        <a-row type="flex" justify="center"> 
          <a-col>备案号：<a href="http://www.beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">赣ICP备17013292号-1 </a></a-col>
          <a-col> 网站地图-<a href="https://www.9cka.cn/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a> </a-col>
        </a-row>
        </a-layout-footer>
    </a-layout>
  </a-spin>
</template>

<script>
import NavBar from "../common/NavBar.vue";
import sListBar from "../common/ListBar.vue";
import { Spin , Layout,Row,Col } from 'ant-design-vue';
export default {
  asyncData({ store, route }) {
    return store.dispatch("navBar");
  },
  components: {
    NavBar,
    sListBar,
    ASpin:Spin,
    ALayout:Layout,
    ALayoutHeader:Layout.Header,
    ALayoutContent:Layout.Content,
    ARow:Row,
    ACol:Col,
    ALayoutFooter:Layout.Footer
  },
  data() {
    return {
      artListFlag: true,
      spinning: false
    };
  },
  props: ["category", "article"]
};
</script>


<style>
.sky-layout .header {
  background: #ffffff;
  padding: 0;
  border-bottom: 1px solid #e8e8e8;
  position: fixed; 
  z-index: 1;
  width:100%;
}
.sky-layout .content{
  margin:84px auto;
  width:1200px;
}
.sky-layout .footer{
  text-align:center;
}
#components-layout-demo-fixed .logo {
  width: 240px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 24px 16px 0;
  float: left;
  line-height: 31px;
  font-size: 25px;
}
.ant-menu-horizontal {
  border: none;
}
.navbox {
  width: 1200px;
  margin: auto;
}
</style>