<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>
                    <i class="el-icon-lx-calendar"></i> 新增文章
                </el-breadcrumb-item>
                <el-breadcrumb-item>markdown编辑器</el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <mavon-editor
                v-model="content"
                ref="md"
                @imgAdd="$imgAdd"
                @change="change"
                style="min-height: 200px"
            />
            <div class="listSummary">
                
                <el-upload
                class="avatar-uploader"
                :action="action"
                :headers="headers"
                :show-file-list="false"
                :on-success="handleAvatarSuccess" >
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <el-input
                    type="textarea"
                    class="summary"
                    :rows="6"
                    placeholder="请填写文章概述"
                    v-model="summary"
                ></el-input>
                
            </div>

            <div class="submitBlock">
                文章分类:
                <el-cascader
                    class="spacing"
                    ref="cascader"
                    v-model="cate_id"
                    :options="options"
                    :props="cascaderProps"
                    @change="handleChange"
                    clearable
                ></el-cascader>标题颜色:
                <el-color-picker class="color-picker" v-model="titlecolor"></el-color-picker>
                <el-tooltip class="item" effect="dark" :content="title" placement="top">
                    <el-input
                        placeholder="请输入文章标题内容"
                        v-model="title"
                        type="text"
                        class="title-input spacing"
                        maxlength="45"
                        show-word-limit
                    ></el-input>
                </el-tooltip>发布日期:
                <el-date-picker
                    class="spacing"
                    v-model="subTime"
                    type="datetime"
                    placeholder="选择日期时间"
                ></el-date-picker>发布状态:
                <el-switch
                    class="spacing"
                    v-model="status"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                ></el-switch>
                <el-button class="editor-btn" type="primary" @click="submit">发布</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { mavonEditor } from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
import categoryApi from '../../api/category';
import articalApi from '../../api/artical';
import bus from '../common/bus';
import myStore from '../../store/articalStore.js';
export default {
    name: 'markdown',
    data: function() {
        return {
            action:'http://api.9cka.cn/admin/artical/uploadImg',
            content: '',
            html: '',
            imageUrl: '',//文章列表显示的图片
            summary: '',//文章列表显示的文章概述
            title: null,
            titlecolor: '#000000',
            options: null,
            cate_id: null,
            cate_name: null,
            cate_path: null,
            cascaderProps: {
                label: 'cate_name',
                value: '_id'
            },
            subTime: new Date(),
            status: true,
            editData: null,
            _id: null,
            views: 0,
            like: 0
        };
    },
    components: {
        mavonEditor
    },
    beforeCreate: function() {
        this.$nextTick(function() {
            categoryApi('getCategoryDataList').then(ret => {
                this.options = ret.categoryData;
            });
        });
    },
    created: function() {
        //如果store里面不为空,则自动填写信息
        myStore.state.articalData && this.setData(myStore.state.articalData);
        
    },
    mounted() {
        bus.$on('edit', json => {
            this.setData(json);
        });
    },
    methods: {
        handleAvatarSuccess(res, file) {
            if(res.code==1){
                this.imageUrl = res.imgUrl;
            }
        },
        // 将图片上传到服务器，返回地址替换到md中
        $imgAdd(pos, $file) {
            var formdata = new FormData();
            formdata.append('file', $file);
            articalApi('uploadImg', formdata).then(ret => {
                if (ret.code == 1) {
                    this.$refs.md.$img2Url(pos, ret.imgUrl);
                    //添加文章列表首张图
                } else {
                    this.$message.error('从服务器获取图片失败');
                }
            });
        },
        delHtmlTag(html) {
            let noTagStr = html.replace(/<[^>]+>/g, '').slice(0, 160); //先过滤掉标签，然后再截取120个字。
            noTagStr = noTagStr.length < 160 ? noTagStr : noTagStr + '...';
            return noTagStr;
        },
        //图片修改还存在问题，如果上传的是本地图片的话，objE.childNodes[0].src这个返回的字符串获取不到图片；
        getFirstImgPath(str) {
            let imgTag = str.match(/<img[^>]+>/);
            if (imgTag) {
                var objE = document.createElement('div');
                objE.innerHTML = imgTag;
                return objE.childNodes[0].src;
            }
        },
        change(value, render) {
            // render 为 markdown 解析后的结果
            this.imageUrl = this.getFirstImgPath(render);
            this.summary = this.delHtmlTag(render);
            this.html = render;
        },
        setData(json) {
            this.editData = json;

            let keys = Object.keys(json);
            keys.forEach(item => {
                if (item == 'content') {
                    this[item] = json['markdownContent'];
                    this.editData[item] = json['markdownContent'];
                } else {
                    this[item] = json[item];
                    this.editData[item] = json[item];
                }
            });
        },
        submit() {
            if (!(this.cate_id && this.title && this.html)) return this.$message.error('请填写完整信息');

            let articalData = {
                content: this.html,
                title: this.title,
                imageUrl:this.imageUrl,
                summary: this.summary,
                markdownContent: this.content,
                titlecolor: this.titlecolor,
                cate_id: this.cate_id,
                cate_name: this.cate_name,
                cate_path: this.cate_path,
                creat_time: this.getDate(this.subTime),
                status: this.status,
                views: this.views,
                like: this.like
            };
            // console.log(articalData);

            if (this._id) {
                articalData._id = this._id;
                articalApi('upDateArtical', articalData).then(ret => {
                    console.log(ret);
                    this.$message.success('修改成功！');
                });
            } else {
                articalApi('addArtical', articalData).then(ret => {
                    this.$message.success('发布成功！');
                });
            }
        },
        handleChange(value) {
            let node = this.$refs.cascader.getCheckedNodes();
            this.cate_name = node[0].label;
            this.cate_path = node[0].data.cate_path;
        },
        //日期转换
        getDate(date) {
            let month = date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes();
            let second = date.getSeconds() > 10 ? date.getSeconds() : '0' + date.getSeconds();
            return (
                date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + month + ':' + second
            );
        }
    },
    computed:{
        headers:function(){
            let token = localStorage.getItem('access_token');
            if (token) {
                return  {
                    'access-token': token,
                    'authorization': 'Bearer '+token,
                }
            }else{
                this.$message.error('登陆失效!');
            }
        }
    }
};
</script>

<style scoped>
.editor-btn {
    margin-top: 20px;
    margin-left: 10px;
}
.spacing {
    margin-left: 10px;
    margin-right: 20px;
}

.submitBlock .title-input {
    width: 250px;
}
.submitBlock .color-picker {
    vertical-align: middle;
}
.listSummary{
    margin-top: 10px;
    display: flex;
}
.listSummary .summary {
    top: 5px;
}
.listSummary .upload {
    display: inline;
}

.avatar-uploader{
    display: inline-block;
    margin-right: 20px;
}
 .avatar-uploader >>> .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 218px;
    height: 134px;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 134px;
    height: 134px;
    line-height: 134px;
    text-align: center;
  }
  .avatar-uploader-icon::after{
      content: '请添加一张文章列表默认图片';
      font-size: 12px;
      position: absolute;
      left: 50%;
      transform: translateX(-50%);
    height: 0;
      top: 30px;
  }
  .avatar {
      margin: 0 auto;
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
</style>