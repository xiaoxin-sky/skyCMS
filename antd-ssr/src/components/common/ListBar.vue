<template>
  <div class="sky-warp">
    <div class="sky-plug">
      <a-row type="flex" justify="center" align="top">
        <a-col>
          <a-avatar :size="64" :src="require('@/assets/avatar.png').default" />
        </a-col>
      </a-row>
      <a-row class="sky-sign" type="flex" justify="center" align="top">
        <a-col>
          <h3>Sky</h3>
          <p>
            <span>个人签名：</span>
            <span>提升能力，创造价值!</span>
          </p>
        </a-col>
      </a-row>
      <a-row class="sky-data" type="flex" justify="space-around">
        <a-col :span="8">
          <a-icon type="environment" />
          <span>江苏-南京</span>
        </a-col>
        <a-col :span="12">
          <a-icon type="message" />
          <span>skylpz@qq.com</span>
        </a-col>
      </a-row>
      <a-divider>社交账号</a-divider>
      <a-row class="sky-social" type="flex" justify="space-around">
        <a-col :span="8">
          <a-tooltip>
            <template slot="title">https://github.com/1912820899</template>
            <a href="https://github.com/1912820899" target="_blank"><a-icon type="github" /></a>
          </a-tooltip>
        </a-col>
        <a-col :span="8">
          <a-tooltip>
            <template slot="title">xz1044425149</template>
            <a-icon type="wechat" />
          </a-tooltip>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style  scoped>
/* .sky-warp {
  background: #fff;
  min-height: 380px;
} */
.sky-plug {
  background: #ffffff;
  min-height: 40px;
  padding: 10px;
  padding-bottom: 30px;
  /* border-bottom: 1px solid #d9d9d9; */
  border-radius: 4px;
}
.sky-plug .sky-social {
  font-size: 28px;
  padding-left: 46px;
}
.sky-plug .sky-social a , .sky-plug .sky-social i {
  color: #000;
}
.sky-warp .sky-sign h3 {
  text-align: center;
}
.sky-data {
  padding-left: 20px;
}
.sky-row span {
  margin-left: 10px;
}
</style>