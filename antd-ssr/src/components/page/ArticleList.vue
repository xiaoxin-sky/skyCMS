<template>
  <div>
    <a-list itemLayout="vertical" size="large" :dataSource="listData">
      <a-list-item slot="renderItem" slot-scope="item" key="item.title">
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

        <template slot="actions">
          <span>
            <a-icon type="schedule" />
            {{item.cate_name}}
          </span>
          <span>
            <a-icon type="clock-circle" />
            {{item.creat_time}}
          </span>
          <span>
            <a-icon type="like" />
            {{item.like}}
          </span>
          <span>
            <a-icon type="eye" />
            {{item.views}}
          </span>
        </template>
      </a-list-item>
    </a-list>
    <a-pagination
      class="pagination"
      v-model="current"
      :defaultPageSize="defaultPageSize"
      :total="totalCount"
      @change="onChange"
    />
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  asyncData({ store, route }) {
    let category = (route.params && route.params.category) || "index";
    let params = {
      skipNum: 1,
      initPaging: 4,
      category: category
    };
    store.commit("setCategory", category);
    return store.dispatch("articleList", { params });
  },
  data() {
    return {
      defaultPageSize: 4,
      current: 1
    };
  },
  methods: {
    onChange(current) {
      let arrPageNum = current-1;
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
    }
  },
  computed: {
    routerPath() {
      this.current = 1;
      return item => `./${item.cate_path}/${item._id}`;
    },
    ...mapState({
      listData: state => state.articleList.listData,
      totalCount: state => state.articleList.totalCount,
      allListData: state => state.articleList.allData
    })
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
  width: 100%;
  max-height: 134px;
}
.pagination {
  text-align: right;
}
</style>