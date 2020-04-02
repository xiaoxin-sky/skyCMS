<template>
    <a-layout class="sky-layout" id="components-layout-demo-fixed">
       <a-layout-header class="header" >
        <div class="navbox">
            <div class="logo"><router-link to="/index" style="z-index:99">小新的个人博客网站</router-link></div>
          <nav-bar></nav-bar>
        </div> 
      </a-layout-header>
      <a-layout-content class="content">
        <a-row :gutter="16">
          <a-col  :xs={span:24} :xl={span:18} class="gutter-box">
            <div :style="{ background: '#fff', padding: '24px', minHeight: '290px' }">
              <router-view></router-view>
            </div>
          </a-col>
          <a-col :xs={span:0} :xl={span:6} class="gutter-box intro">
            <s-list-bar></s-list-bar>
          </a-col>
        </a-row>
      </a-layout-content>
      <sky-footer></sky-footer>
    </a-layout>
</template>

<script>
import NavBar from "../common/NavBar.vue";
import sListBar from "../common/ListBar.vue";
import {  Layout,Row,Col } from 'ant-design-vue';
import Footer from "../common/Footer.vue";
export default {
  asyncData({ store, route }) {
    return store.dispatch("navBar");
  },
  components: {
    NavBar,
    sListBar,
    ALayout:Layout,
    ALayoutHeader:Layout.Header,
    ALayoutContent:Layout.Content,
    ARow:Row,
    ACol:Col,
    skyFooter:Footer
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
  overflow: hidden;
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
@media screen and (max-width:576px){
  .sky-layout .content{
    margin-top: 74px;
    width:100%;
    margin-bottom: 20px;
  }
  .logo{
    position: absolute;
    z-index: 99;
    left: 5%;
  }
  .sky-layout .intro{
    display: none;
  }
}

</style>