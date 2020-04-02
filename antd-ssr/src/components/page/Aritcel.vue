<template>
  <div class="warp">
    <template>
      <div class="breadcrumb">
        <a-breadcrumb :routes="routes">
          <template slot="itemRender" slot-scope="{route, params, routes, paths}">
            <span v-if="routes.indexOf(route) === routes.length - 1">{{route.breadcrumbName}}</span>
            <router-link v-else :to="`/${paths.join('/')}`">{{route.breadcrumbName}}</router-link>
          </template>
        </a-breadcrumb>
      </div>
    </template>
    <a-divider />
    <section>
      <h1 class="title" :style="{color:artData.titlecolor}">{{artData.title}}</h1>
    </section>
    <section class="artDescribe">
      <a-row type="flex" justify="center" :gutter="24">
        <a-col>
          <a-icon type="clock-circle" />
          {{artData.creat_time}}
        </a-col>
        <a-col>
          <a-icon type="schedule" />
          {{artData.cate_name}}
        </a-col>
        <a-col>
          <a-icon type="fire" />
          {{artData.views}}
        </a-col>
      </a-row>
    </section>
    <div class="article markdown-body">
      <article class="js-toc-content" v-html="artData.content" ref="artContent"></article>
    </div>
    <div class="like">
      <a class="like-warp" @click="like" style>
        <a-icon type="like" />
      </a>
      <span>{{artData.like}}</span>
    </div>
  </div>
</template>
<script>
import { mapState } from "vuex";
import titleMixin from "@/util/mixin.js";
import "github-markdown-css";

// require('tocbot/src/scss/tocbot-core.scss');
import { Divider, Icon, Row, Col, Breadcrumb, message } from "ant-design-vue";
export default {
  asyncData({ store, route }) {
    let routerParams = route.params;
    if (routerParams.article) {
      return store.dispatch("articleDetail", { id: routerParams.article });
    }
  },
  mixins: [titleMixin],
  title() {
    let artData = this.artData;
    return artData && artData.title;
  },
  mounted() {
    //  hljs.initHighlightingOnLoad();
    
    this.addMao();
    
  },
  data() {
    return {
      userlike: (this.artData && this.artData.like) || 0,
      routes: [
        {
          path: "/",
          breadcrumbName: "首页"
        },
        {
          path: this.$store.state.artDetail.cate_path || "",
          breadcrumbName: this.$store.state.artDetail.cate_name || ""
        },
        {
          breadcrumbName: this.$store.state.artDetail.title || ""
        }
      ]
    };
  },
  methods: {
    async like() {
      let ret = await this.axios.post("artical/addLick", {
        id: this.artData._id
      });
      message.config({
        top: `15%`,
        duration: 2,
        maxCount: 3
      });
      if (ret.code == 200) {
        this.$store.commit('addLick');
        message.success("感谢您的赞美！");
      } else if (ret.code == 201) {
        message.warning("过多的赞美，会使我膨胀的哦！");
      } else {
        message.error(
          "理解您想赞美我的心情，但是现在系统出错啦，请待会儿重试哦！"
        );
      }
    },
    addMao(){
      let nodes = this.$refs.artContent.children;
      if (nodes.length) {
          for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
              let reg = /^H[1-6]{1}$/;
              if (reg.exec(node.tagName)) {
                  node.id = node.firstElementChild.id;
                  node.firstElementChild.removeAttribute('id');
              }
          }
      }
      
    }
  },
  computed: {
    ...mapState({
      artData: state => state.artDetail
    })
  },
  components: {
    ADivider: Divider,
    AIcon: Icon,
    ARow: Row,
    ACol: Col,
    ABreadcrumb: Breadcrumb
  }
};
</script>

<style >
@import "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css";
.warp .article {
  margin-top: 20px;
}
.warp .title {
  text-align: center;
  font-size: 25px;
  padding: 10px;
}
.warp .artDescribe i {
  vertical-align: middle;
}
.warp > article {
  padding: 10px;
}
.warp .like {
  text-align: center;
  font-size: 33px;
  margin-top: 40px;
}
.warp .like span {
  display: block;
  color: #999;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC",
    "Hiragino Sans GB", "Microsoft YaHei", "Helvetica Neue", Helvetica, Arial,
    sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-variant: tabular-nums;
  line-height: 1.5;
}
.warp .like a {
  color: #fff;
  display: block;
  width: 64px;
  height: 64px;
  line-height: 64px;
  background: #409eff;
  margin: 0 auto;
  border-radius: 50%;
}
h1::before, h2::before, h3::before, h4::before, h5::before, h6::before {
    display: block;
    content: " ";
    height: 84px;
    margin-top: -84px;
    visibility: hidden;
}
</style>