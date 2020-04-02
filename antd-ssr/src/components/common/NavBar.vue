<template>
  <div class="navWarp">
    <a-button class="menuBtn" v-if="isMobile" type="primary" shape="circle" @click="menuFlag=!menuFlag">
      <a-icon :type="menuFlag ? 'menu' : 'close'" />
    </a-button>
    <transition name="slide-fade">
    <a-menu v-model="current" v-if="isMobile?!menuFlag:menuFlag" class="menu" :class="{showMenu:isMobile?!menuFlag:menuFlag}"  :mode="isMobile?'inline':'horizontal'" :forceSubMenuRender="true">
      <template v-for="item in items">
        <template v-if=" item.children && item.children.length !=0 ">
          <a-sub-menu :key="item._id">
            <span slot="title" class="submenu-title-wrapper">{{item.cate_name}}</span>
            <template v-for="child in item.children">
              <a-menu-item :key="child._id" @click="clickMenu(child)">
                <router-link :to="'/'+child.cate_path">{{child.cate_name}}</router-link>
              </a-menu-item>
            </template>
          </a-sub-menu>
        </template>
        <template v-else>
          <a-menu-item :key="item._id" @click="clickMenu(item)">
            <router-link :to="'/'+item.cate_path">{{item.cate_name}}</router-link>
          </a-menu-item>
        </template>
      </template>
    </a-menu>
    </transition>
  </div>
</template>
<script>
import bus from '@/components/common/bus.js'
import { Menu,Button,Icon,Transition } from 'ant-design-vue';
export default {
  data() {
    return {
      items: this.$store.state.navBarData,
      current: this.$store.state.artDetail.cate_id,
      selectedKeys: "",
      isMobile:false,//默认pc端
      menuFlag:true,//默认pc端
    };
  },
  mounted(){
    this.getDeviceType();
    window.addEventListener('resize',this.getDeviceType);
  },
  beforeDestroy(){
    window.removeEventListener('resize',this.getDeviceType);
  },
  methods: {
    clickMenu(category) {
      //点击导航菜单，动态变更title
      let title = this.$route.meta.title;
      document.title = category.cate_path == "index" ? title: category.cate_name + " | " + title;
      bus.$emit('initCurrent');
    },
    getDeviceType(){
      let clientWidth = document.documentElement.clientWidth;
      if(clientWidth<576){
        this.isMobile = true;
      }else{
        this.menuFlag = true;
        this.isMobile = false;
      }
    },
    toggle(){
      // this.menuFlag = !this.menuFlag;
    }
  },
  components:{
    AMenu:Menu,
    AMenuItem:Menu.Item,
    ASubMenu:Menu.SubMenu,
    AButton:Button,
    AIcon:Icon
  }
};
</script>
<style>

.ant-menu-horizontal {
  line-height: 57px;
}

@media screen and (max-width:576px){
  .navWarp{
    position: absolute;
    width: 100%;
  }
  .navWarp .menuBtn{
    left: 85%;
    margin-bottom: 16px;
  }

  .slide-fade-enter-active {
    transition: all .3s ease;
  }
  .slide-fade-leave-active {
    transition: all .3s cubic-bezier(1.0, 0.5, 0.8, 1.0);
  }
  .slide-fade-enter, .slide-fade-leave-to{
    transform: translateX(10px);
    opacity: 0;
  }
}
</style>