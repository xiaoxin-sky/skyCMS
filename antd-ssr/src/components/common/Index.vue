<template>
  <a-spin :spinning="spinning">
    <a-layout class="sky-layout" id="components-layout-demo-fixed">
      <a-layout-header :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
        <div class="navbox">
          <router-link to="/index">
            <div class="logo">小新的个人博客网站</div>
          </router-link>
          <nav-bar></nav-bar>
        </div>
      </a-layout-header>
      <a-layout-content :style="{ margin: '84px auto', width: '1200px' }">
        <a-row :gutter="16">
          <a-col :span="18" class="gutter-box">
            <div :style="{ background: '#fff', padding: '24px', minHeight: '380px' }">
              <router-view></router-view>
            </div>
          </a-col>
          <a-col :span="6" class="gutter-box">
            <s-list-bar></s-list-bar>
          </a-col>
        </a-row>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">SkyCMS  Design ©2020 Created by 小新</a-layout-footer>
    </a-layout>
  </a-spin>
</template>

<script>
import NavBar from "../common/NavBar.vue";
import sListBar from "../common/ListBar.vue";
export default {
  asyncData({ store, route }) {
    return store.dispatch("navBar");
  },
  components: {
    NavBar,
    sListBar,
  },
  data() {
    return {
      artListFlag: true,
      spinning: false
    };
  },
  created() {
    // document.title = this.$route.meta.title;
  },
  props: ["category", "article"]
};
</script>


<style>
.ant-layout-header {
  background: #ffffff;
  padding: 0;
  border-bottom: 1px solid #e8e8e8;
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