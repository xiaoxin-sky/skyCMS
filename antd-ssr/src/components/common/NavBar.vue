<template>
  <div>
    <a-menu v-model="current" mode="horizontal">
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
  </div>
</template>
<script>
import bus from '@/components/common/bus.js'
export default {
  data() {
    return {
      items: this.$store.state.navBarData,
      current: this.$store.state.artDetail.cate_id,
      selectedKeys: ""
    };
  },
  methods: {
    clickMenu(category) {

      //点击导航菜单，动态变更title
      let title = this.$route.meta.title;
      document.title =
        category.cate_path == "index"
          ? title
          : category.cate_name + "-" + title;
      bus.$emit('initCurrent');
    }
  }
};
</script>
<style scoped>
.ant-menu-horizontal {
  line-height: 57px;
}
</style>