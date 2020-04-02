<template>
  <div class="sky-warp">
    <incro></incro>
    <toc v-if="isArtDetail"></toc>
  </div>
</template>

<script>
import Incro from '@/components/page/Introduce.vue';
import Toc from '@/components/page/Toc.vue';
export default {
  components:{
    Incro,
    Toc
  },
  computed:{
    isArtDetail(){
      return !!this.$store.state.route.params.article;
    }
  }
};
</script>