<template>
  <div>
    <a-menu   v-model="current" mode="horizontal"  >
      
      <template  v-for="item in items">
        <template v-if=" item.children && item.children.length !=0 ">
          <a-sub-menu :key="item._id">
            <span slot="title" class="submenu-title-wrapper">{{item.cate_name}}</span>
            <template v-for="child in item.children">
              <a-menu-item :key="child._id" @click="clickMenu(child)">{{child.cate_name}}</a-menu-item>
            </template>
          </a-sub-menu>     
        </template>
        <template v-else>
          <a-menu-item :key="item._id" @click="clickMenu(item)">{{item.cate_name}}</a-menu-item>
        </template>
      </template>
    </a-menu>
  </div>
</template>
<script>
import bus from '../common/bus';
// import router from 'vue-router';
  export default {
    data() {
      return {
        items:[],
        current: [],
        selectedKeys:''
      };
    },
    beforeCreate(){
      this.$axios.get('navbar/getNavList').then(ret=>{
        this.items = ret.data;
      })
    },
    created(){
      bus.$on('sendArtData',(item)=>{
        this.current = item.cate_id;
      })
    },
    methods:{
      clickMenu(category){
        this.$router.push('/'+category.cate_path);
        //点击导航菜单，动态变更title
        let title = this.$route.meta.title;
        document.title =  category.cate_path == "index" ? title : title+'-'+category.cate_name;
        bus.$emit('getArtList',category);
      }
    }
  };
</script>
<style scoped>
.ant-menu-horizontal{
  line-height: 57px;
}
</style>