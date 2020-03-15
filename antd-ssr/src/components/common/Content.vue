<template>
  <div :style="{ background: '#fff', padding: '24px', minHeight: '380px' }">
    <!-- <div  v-show="!article">
      <s-art-list></s-art-list>
    </div>
    <div v-show="article">
      <s-art></s-art>
    </div> -->
    <router-view></router-view>
  </div>
</template>

<script>
import sArtList from '../page/ArticleList.vue';
import sArt from '../page/Aritcel.vue';
export default {
  data(){
    return {

    }
  },
  props:['category','article'],
  components:{
    sArtList,
    sArt
  }
}
</script>

<style>

</style>