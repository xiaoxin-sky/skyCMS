<template>
  <a-layout class="sky-layout" id="components-layout-demo-fixed">
    <a-layout-header  :style="{ position: 'fixed', zIndex: 1, width: '100%' }">
      <div class="navbox">
        <router-link to="/index"> <div class="logo" >小新的个人博客网站</div> </router-link>
        <nav-bar></nav-bar>
      </div>
    </a-layout-header>
    <a-layout-content  :style="{ margin: '84px auto', width: '1200px' }">
      <a-row :gutter="16"> 
        <a-col :span="18" class="gutter-box">
          <s-content :category="category" :article="article"></s-content>
        </a-col>
        <a-col :span="6" class="gutter-box">
            <s-list-bar></s-list-bar>
        </a-col>
      </a-row>
    </a-layout-content>
    <a-layout-footer :style="{ textAlign: 'center' }">
      SkyBk Design ©2020 Created by SkyBk 小新
    </a-layout-footer>
  </a-layout>
</template>

<script>
import NavBar from '../common/NavBar';
import sContent from '../common/Content';
import sListBar from '../common/ListBar';
export default {
    components:{
        NavBar,
        sContent,
        sListBar
    },
    data(){
      return {
        artListFlag:true
      }
    },
    created(){
      document.title = this.$route.meta.title;
    },
    props:['category','article'],
    methods: {
      change(affixed) {
        console.log(affixed);
        // let a = affixed;
        // console.log(a);
      }
    }
}
</script>


<style>
  .ant-layout-header{
      background: #ffffff;;
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
  .ant-menu-horizontal{
    border: none;
  }
  .navbox{
    width: 1200px;
    margin: auto;
  }
  .logo{
    
  }
  .gutter-box{
  }
</style>