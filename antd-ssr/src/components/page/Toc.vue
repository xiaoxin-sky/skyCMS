<template>
<a-affix :offsetTop="74">
  <div class="sky-plug">
    <div id="skytoc"></div>
  </div>
</a-affix>
</template>

<script>
import {Affix} from 'ant-design-vue';
import tocbot from 'tocbot';
export default {
  mounted() {
    tocbot.init({
      tocSelector: "#skytoc",
      contentSelector: ".js-toc-content",
      headingSelector: "h1, h2, h3",
      hasInnerContainers: false
    });
  },
  components:{
      AAffix:Affix
  }
};
</script>

<style scoped>
@import url('https://cdnjs.cloudflare.com/ajax/libs/tocbot/4.4.2/tocbot.css');
.sky-plug {
  background: #ffffff;
  min-height: 40px;
  padding: 10px;
  padding-bottom: 30px;
  border-radius: 4px;
  margin-bottom: 10px;
  position: relative;
}
#skytoc>>>.toc-list{
    list-style: inside;
}
#skytoc>>>.is-active-link{
    color: #1890ff;
}
#skytoc>>>.toc-link::before{
    width: 0;
}
</style>