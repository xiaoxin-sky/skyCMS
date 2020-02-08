<template>
  <a-list itemLayout="vertical"  size="large" :pagination="pagination" :dataSource="listData">
    
    <a-list-item  slot="renderItem" slot-scope="item" key="item.title">
      <template slot="extra">
        <a @click="enterArticel(item)" class="imgWarp">
          <img
          :alt="item.title"
          :src="getFirstImgPath(item.content)" />
        </a>
      </template>
      <a-list-item-meta >  
        <span slot="title" >
          <a @click="enterArticel(item)" :style="{color:item.titlecolor}">{{item.title}}</a>
        </span>  
      </a-list-item-meta>
      <article >  {{delHtmlTag(item.content)}}</article>

      <template slot="actions" >
        <span>
          <a-icon type="schedule"  />
          {{item.cate_name}}
        </span>
        <span>
          <a-icon type="clock-circle"  />
          {{item.creat_time}}
        </span>
        <span>
          <a-icon type="like"  />
          {{item.like}}
        </span>
        <span>
          <a-icon type="eye"  />
          {{item.views}}
        </span>
      </template>
    </a-list-item>
  </a-list>
</template>
<script>
  import bus from '../common/bus';
  export default {
    data() {
      return {
        listData:[],
        pagination: {
          onChange: async (pageNum) => {
            let loadedPage = this.pagination.loaded;
            
            if( loadedPage.indexOf(pageNum) == -1 ){
              let data = await this.getArticalList(pageNum);
              if(data){
                this.listData = this.listData.concat(data.listData);
                this.pagination.total = data.totalCount;
                this.pagination.loaded.push(pageNum);
              }
            }
            
          },
          pageSize: 5,
          total:100,
          loaded:[1]//初始只加载一页
        },
        actions: [
          { type: 'eye', text: '2' },
          { type: 'like-o', text: '156' },
          { type: 'clock-circle', text: '888' }
        ],
        category:'index'
      };
    },
    async created(){
      // console.log(this.$route);
      let routeParams = this.$route.params;
      routeParams.category && (this.category = routeParams.category);
      let data = await this.getArticalList();
      if(data){
        this.listData = data.listData;
        this.pagination.total = data.totalCount;
      }
      
    },
    mounted(){
      // this.$nextTick(()=>{
        bus.$on('getArtList',async (category)=>{
          this.category = category.cate_path;
          let data = await this.getArticalList();
          if(data){
            this.listData = data.listData;
            this.pagination.total = data.totalCount;
          }
        }); 
      // })
    },
    methods:{
      enterArticel(item){
        this.$router.push(`/${item.cate_path}/${item._id}`);
        bus.$emit('sendArtData',item);
      },
      delHtmlTag(str){
        let noTagStr = str.replace(/<[^>]+>/g,"").slice(0,160);//先过滤掉标签，然后再截取120个字。
        noTagStr = noTagStr.length < 160 ?  noTagStr : noTagStr+'...';
        return noTagStr;
      },
      //获取文章内容中的第一张图片地址
      getFirstImgPath(str){
        //图片修改还存在问题，如果上传的是本地图片的话，objE.childNodes[0].src这个返回的字符串获取不到图片；
        let imgTag = str.match(/<img[^>]+>/);
        if(imgTag){
          var objE = document.createElement("div");
          objE.innerHTML = imgTag;
          return objE.childNodes[0].src;
        }else{
          return require('../../assets/mypic.png'); //加上require即可
        }
      },
      async getArticalList(pageNum=1){
        let category = this.category;
        let ret = await this.$axios.get('artical/getArticalList',{
          params:{
            skipNum:pageNum,
            initPaging:10,
            category:category
          }
        });
        if(ret.code==200){
          return ret.data;
        }else{
          return false;
        }
      }
    }
  };
</script>
<style>
.imgWarp{
  display: inline-block;
  width: 218px;
  height: 134px;
  text-align: center;
  overflow: hidden;
}
.imgWarp>img{
  width: 100%;
  max-height: 134px;
}
</style>