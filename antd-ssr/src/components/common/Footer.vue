<template>
    <section>
        <a-layout-footer class="footer" >
            <a-row type="flex" justify="center"> 
            <a-col> SkyCMS©2020 Created by <a href="https://www.9cka.cn">小新博客</a></a-col>
            </a-row>
            <a-row type="flex" justify="center"> 
            <a-col>备案号：<a href="http://www.beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">赣ICP备17013292号-1 </a></a-col>
            <a-col> 网站地图-<a href="https://www.9cka.cn/sitemap.xml" target="_blank" rel="noopener noreferrer">Sitemap</a> </a-col>
            </a-row>
        </a-layout-footer>
    </section>
</template>

<script>
import { Layout,Row,Col } from 'ant-design-vue'
export default {
    name:'myfooter',
    components:{
        ARow:Row,
        ACol:Col,
        ALayoutFooter:Layout.Footer
    }
}
</script>

<style>
.footer{
    height: 80px;
    background: #fff;
    width: 100%;
    text-align:center;
    color: #000;
}
</style>