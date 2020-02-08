<template>
  <div :style="{ background: '#fff', padding: '24px', minHeight: '380px' }">
    <div class="sky-plug sky-admin-data">
      <a-row type="flex" justify="space-around" align="top" >
        <a-col :span="6">
          <a-avatar :size="48" :src="require('@/assets/avatar.png')"  />
        </a-col>
        <a-col :span="18" >
          <h3 >Sky‘s Blog</h3>
          <p><span>个人签名：</span><span>提升能力，创造价值!</span></p>
        </a-col>
      </a-row>
      <a-row class="sky-row">
        <a-col>网名:<span>Sky | 小新</span></a-col>
        <a-col>现居:<span>江苏省-南京市</span></a-col>
        <a-col>职业:<span>学生 | 兼职前端开发</span></a-col>
        <a-col>Email:<span>skylpz@qq.com</span></a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {

}
</script>

<style>
  .sky-plug{
    min-height: 40px;
    padding: 10px;
    border: 1px solid #d9d9d9;
    border-radius: 4px;
  }
  .sky-admin-data{
    
  }
  .sky-admin-data:hover{
    transition:all 300ms; 
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  }
  .sky-row {
    padding-left: 5px;
  }
  .sky-row span{
    margin-left: 10px;
  }
</style>