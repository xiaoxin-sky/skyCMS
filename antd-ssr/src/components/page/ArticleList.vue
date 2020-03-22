<template>
  <div>
    <a-list itemLayout="vertical" size="large" :dataSource="listData">
      <a-list-item  slot="renderItem" slot-scope="item" key="item.title">
        <template slot="extra">
          <a :href="routerPath(item)" class="imgWarp">
            <img :alt="item.title" :src="item.imageUrl" />
          </a>
        </template>
        <a-list-item-meta>
          <span slot="title">
            <a :href="routerPath(item)" :style="{color:item.titlecolor}">{{item.title}}</a>
          </span>
        </a-list-item-meta>
        <article>{{item.summary}}</article>
        <template>
          <span slot="actions">
            <a-icon type="schedule" />
            {{item.cate_name}}
          </span>
          <span slot="actions">
            <a-icon type="clock-circle" />
            {{item.creat_time}}
          </span>
          <span slot="actions">
            <a-icon type="like" />
            {{item.like}}
          </span>
          <span slot="actions">
            <a-icon type="eye" />
            {{item.views}}
          </span>
        </template>
      </a-list-item>
    </a-list>
    <a-pagination
      class="pagination"
      :hideOnSinglePage="true"
      :itemRender="itemRender"
      v-model="current"
      :defaultPageSize="defaultPageSize"
      :total="totalCount"
      @change="onChange"
    />
  </div>
</template>
<script>
import bus from "@/components/common/bus.js";
import { mapState } from "vuex";
import titleMixin from "@/util/mixin.js";
import { List, Pagination, Icon } from "ant-design-vue";
export default {
  components: {
    AList: List,
    AListItem: List.Item,
    AListItemMeta: List.Item.Meta,
    APagination: Pagination,
    AIcon: Icon
  },
  data() {
    return {
      defaultPageSize: 4,
      current: 1 //页码初始化，是从导航传递过来的变化，因此用store不方便，使用bus最合适
    };
  },
  created() {
    bus.$on("initCurrent", () => {
      this.current = 1;
    });
  },
  methods: {
    onChange(current) {
      let arrPageNum = current - 1;
      if (this.allListData[arrPageNum]) {
        //如果点击的页数，已经存在store里面，不再请求获取。直接拿出来用
        this.$store.commit("changeArtList", arrPageNum);
      } else {
        let category = this.$route.params.category || "index";
        return this.$store.dispatch("getPagenationList", {
          params: {
            skipNum: current,
            initPaging: 4,
            category: category
          }
        });
      }
    },
    itemRender(current, type, originalElement) {
      let route = this.$store.state.route;
      let path = route.path == "/" ? "/index?page=" : `${route.path}?page=`;
      let prev = this.current - 1 == 0 ? this.current : this.current - 1;
      if (type === "prev") {
        return <router-link to={path + prev}>上一页</router-link>;
      } else if (type === "next") {
        return <router-link to={path + (this.current + 1)}>下一页</router-link>;
      }
      return originalElement;
    }
  },
  computed: {
    routerPath() {
      return item => `./${item.cate_path}/${item._id}`;
    },
    ...mapState({
      listData: state => state.articleList.listData,
      totalCount: state => state.articleList.totalCount,
      allListData: state => state.articleList.allData
    })
  },
  asyncData({ store, route }) {
    let skipNum = (route.query && route.query.page) || 1;
    let category = (route.params && route.params.category) || "index";
    let params = {
      skipNum: skipNum,
      initPaging: 4,
      category: category
    };
    return store.dispatch("articleList", { params });
  },
  mixins: [titleMixin],
  title() {
    let navBarData = this.$store.state.navBarData;
    let path = this.$store.state.route.path;
    // console.log(path);

    let cate_name = "";
    //这里只进行遍历顶级导航和二级导航遍历，注意后台设置导航英文名称不可有字母重复 比如一级导航是 studyImp 二级导航不能只设置study
    navBarData.forEach(item => {
      if (path.indexOf(item.cate_path) !== -1) {
        return (cate_name = item.cate_name);
      } else if (item.children && item.children.length > 0) {
        let children = item.children;
        children.forEach(childItem =>{
          if(path.indexOf(childItem.cate_path) !== -1){
            return (cate_name = childItem.cate_name);
          }
        });
      }
    });
    let query = this.$store.state.route.query;
    // 如果文章列表页码存在并且不是第一页，则给标题添加页码。
    let page =
      query && query.page && query.page > 1 ? `-第${query.page}页` : "";
    return cate_name + page;
  }
};
</script>
<style>
.imgWarp {
  display: inline-block;
  width: 218px;
  height: 134px;
  text-align: center;
  overflow: hidden;
}
.imgWarp > img {
  height: 100%;
  transform: scale(1);
  transition: all .3s linear;
}
.ant-list-item:hover .imgWarp > img{
  transform: scale(1.05);
}
.pagination {
  text-align: right;
}
</style>