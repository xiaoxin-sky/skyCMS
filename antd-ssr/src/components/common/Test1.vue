<template>
  <div>
    <h3>{{msg}}</h3>
  </div>
</template>
<script>
export default {
  asyncData: function({ store, route }) {
    return store.dispatch("fetchMsg");
  },
  computed: {
    msg() {
      return this.$store.state.msg;
    }
  },
  created(){
    // (this.$axios.get('artical/getArticalList?skipNum=1&initPaging=10&category=index')).then(ret=>{
    //   console.log('homeAxios',ret);
      
    // }).catch(err=>{
    //   console.log(err);
      
    // })
  }
};
</script>