<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item><i class="el-icon-lx-edit"></i> 新增文章</el-breadcrumb-item>
                <el-breadcrumb-item>富文本编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <quill-editor ref="myTextEditor" v-model="content" :options="editorOption"></quill-editor>
            <div class="submitBlock">
                文章分类:
                    <el-cascader
                        ref="cascader"
                        v-model="cate_id"
                        :options="options"
                        :props="cascaderProps"
                        @change="handleChange"
                        clearable></el-cascader>
                标题颜色:
                    <el-color-picker class="color-picker" v-model="titlecolor"></el-color-picker>
                    <el-input placeholder="请输入文章标题内容" v-model="title" type='text' class="title-input" 
                        maxlength="45" 
                        show-word-limit  >
                    </el-input>
                发布日期:
                    <el-date-picker
                        v-model="subTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                发布状态:
                    <el-switch
                        v-model="status"
                        active-color="#13ce66"
                        inactive-color="#ff4949">
                    </el-switch>
                <el-button class="editor-btn" type="primary" @click="submit">发布</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    import 'quill/dist/quill.core.css';
    import 'quill/dist/quill.snow.css';
    import 'quill/dist/quill.bubble.css';
    import { quillEditor } from 'vue-quill-editor';
    import  categoryApi  from '../../api/category';
    import articalApi from '../../api/artical';
    import bus from '../common/bus';
    import myStore from '../../store/articalStore.js';
    export default {
        name: 'editor',
        data: function(){
            return {
                content: '',
                editorOption: {
                    placeholder: '请在此输入文字'
                },
                title:null,
                titlecolor:'#000000',
                options:null,
                cate_id: null,
                cate_name:null,
                cate_path:null,
                cascaderProps:{
                    label:'cate_name',
                    value:'_id'
                },
                subTime:new Date(),
                status:true,
                editData:null,
                _id:null,
                views:0,
                like:0
            }
        },
        components: {
            quillEditor
        },
        beforeCreate: function(){
            this.$nextTick( function () {
                categoryApi('getCategoryDataList').then((ret)=>{
                    this.options = ret.categoryData;
                });
            });
            
        },
        created: function () {
            //如果store里面不为空,则自动填写信息
            myStore.state.articalData && this.setData(myStore.state.articalData);
        },
        mounted(){
            bus.$on('edit',(json)=>{
                this.setData(json);
            });
        },
        methods: {
            setData (json){
                this.editData = json;
                
                let keys = Object.keys(json);
                keys.forEach(item=>{
                    this[item] = json[item];
                    this.editData[item] = json[item];
                });
                
            },
            onEditorChange({ editor, html, text }) {
                this.content = html;
            },
            submit(){
                if(!(this.cate_id && this.title && this.content)) return this.$message.error('请填写完整信息');

                let articalData = {
                    content:this.content,
                    title:this.title,
                    titlecolor:this.titlecolor,
                    cate_id:this.cate_id,
                    cate_name:this.cate_name,
                    cate_path:this.cate_path,
                    creat_time:this.getDate(this.subTime),
                    status:this.status,
                    views:this.views,
                    like:this.like
                }
                console.log(articalData);
                
                if(this._id){
                    articalData._id = this._id;
                    articalApi('upDateArtical',articalData).then(ret=>{
                        console.log(ret);
                        this.$message.success('修改成功！');
                    });
                }else{
                    articalApi('addArtical',articalData).then(ret=>{
                        this.$message.success('发布成功！');
                    });
                }
            },
            handleChange(value){
                let node = this.$refs.cascader.getCheckedNodes();
                this.cate_name = node[0].label;
                this.cate_path = node[0].data.cate_path;
            },
            //日期转换
            getDate(date){
                let month = date.getMinutes() > 10 ? date.getMinutes() : '0'+date.getMinutes();
                let second = date.getSeconds() > 10 ? date.getSeconds() : '0' +date.getSeconds();
                return (date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()+' '+date.getHours()+':'+month+':'+second);
            }
        }
    }
</script>
<style scoped>
    .editor-btn{
        margin-top: 20px;
        margin-left: 10px;
    }
    .submitBlock{
        margin-bottom: 20px;
    }
    .submitBlock .title-input{
        width: 250px;
        margin: 0 10px;
    }
    .submitBlock .color-picker{
        vertical-align:middle;
    }
</style>