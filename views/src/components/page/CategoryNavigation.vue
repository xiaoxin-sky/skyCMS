<template>
<div class="custom-tree-container">
  
  <div class="container">
    <el-row >
      <el-col :span="12"><div class="grid-content bg-purple"><p>分类可通过鼠标拖动调整</p></div></el-col>
      <el-col :span="4" :offset="8">
        <div class="grid-content-button">
          <el-button type="primary"
           @click="dialogVisible = true;soltName='';title='添加一级分类';addCategoryTop;"
           >添加分类</el-button>
          <el-button type="primary" @click="submitSoltData">保存</el-button>
          </div></el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :closeOnClickModal='false'>
      <el-input v-model="soltName" placeholder="请输入一级导航名称" ></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="append(soltListData)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <div class="container">
    <el-tree
      v-loading="loading"
      id="el-tree"
      :data="soltListData"
      show-checkbox
      node-key="_id"
      ref="tree"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
      draggable
      @node-drop="handleDragEnd"
      :allow-drag="allowDrag"
      :allow-drop="allowDrop">
    </el-tree>
  </div>
</div>
</template>
<script>
import { log, isArray } from 'util';
import DragDialog from './DragDialog.vue';
import  categoryApi  from '../../api/category';

  let id = 1000;

  export default {
    data() {
      /* const soltListData = [{
        id: 1,
        label: '一级 1'
      },{
        id: 2,
        label: '一级 2'
      },{
        id: 3,
        label: '一级 3'
      }]; */
      return {
        soltListData: [],
        dialogVisible: false,
        soltName: '',
        title:'添加一级分类',
        changeSoltData: null,
        loading:false
      }
    },
    components:{
      DragDialog
    },
    beforeCreate: function () {
      this.$nextTick( function () {
        this.loading = true;
        categoryApi('getCategoryDataList').then((ret)=>{
          this.soltListData = ret;
          this.loading = false;
        });
        // console.log(data);
      });
    },
    methods: {
      /**
       * 添加节点
       */
      append(data) {

        //changeSoltData如果存在，则是 添加子分类或修改分类
        if( this.changeSoltData  ){
          //isAddSort 是否为添加子分类
          if(!this.changeSoltData.isAddSort){//修改分类
            if(!this.soltName.length) return this.editSortError();
            this.changeSoltData.cate_name = this.soltName;
          }else{//添加分类
            //子分类上的topId都指的是对应一级分类的_id
            let newChild = {cate_name: this.soltName };
            if (!this.changeSoltData.children){
              this.$set(this.changeSoltData, 'children', []);
            }
            this.changeSoltData.children.push(newChild);
            //获取操作节点的node对象节点
            let node = this.$refs.tree.getNode(this.changeSoltData);
            //获取操作节点的所在一级分类全部数据
            let topCategoryData = null;
            
            while(node.parent != null){
              
              if(node.parent.parent == null){
                topCategoryData = node.data;
              }
              node = node.parent;
            }
            
            this.upDateCategory(topCategoryData);

          }
          this.dialogVisible = false;//隐藏弹窗
        }else{
          //如果data是数组，添加一级分类，否则是添加子分类或修改分类
          if(isArray(data)){
            if(!this.soltName.length) return this.editSortError();
            this.dialogVisible = false;//隐藏弹窗
            let newChild = { cate_name: this.soltName,disabled:true };
            let res = this.$refs.tree.data.push(newChild);
            this.addCategory();
          }
        }
        
      },
      remove(node, data) {
        console.log(node.parent);
        console.log(this.soltListData);
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node" >
            <span>{data.cate_name}</span>
            <span>
              <el-button size="mini" type="success is-plain"  on-click={ () => this.openSortSetDialog(data) }>修改</el-button>
              <el-button size="mini" type="primary is-plain"  on-click={ () => this.openSortSetDialog(data,true) }>添加</el-button>
              <el-button size="mini" type="danger is-plain"  on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>);
      },
      allowDrop(draggingNode, dropNode, type){
        
         if( dropNode.parent && dropNode.parent.parent && dropNode.parent.parent.parent && dropNode.parent.parent.parent.id != 0 ){
            
            return false;
        }else{
          console.log(dropNode,type);
          return true;
        } 
      },
      allowDrag(draggingNode){
        //限制带有下级菜单的不可拖动
        return draggingNode.childNodes.length > 0 ? false : true;
      },
      handleDragEnd(draggingNode, dropNode, dropType, ev) {
        return false;
      },
      //isAddSort 是否为添加子分类，默认是不添加
      openSortSetDialog(data,isAddSort=false){
        // console.log(data);
        this.dialogVisible = true;
        this.changeSoltData = data;
        this.changeSoltData.isAddSort = isAddSort;
        if(isAddSort){
          this.title = '添加子分类';
          this.soltName = '';
        }else{
          this.title = '修改分类';
          this.soltName = data.cate_name;
        }
      },
      submitSoltData(){
        
      },
      addCategory(){
        categoryApi('addCategoryTop',{'cate_name':this.soltName}).then(ret=>{
          console.log(ret);
          let topData = this.$refs.tree.data;
          topData.forEach(item=>{
            if( item.disabled && item._id == undefined ){
              item._id = ret.insertedId;
              item.disabled == false;
            }
          });
        });
      },
      upDateCategory(data){
        categoryApi('upDateCategory',data).then(ret=>{
          console.log(ret);
        });
      },
      editSortError(){
        this.$notify.error({
          title: '添加错误',
          message: '分类不能为空,请填写分类后再添加'
        });
      },
      
    }
  };
</script>

<style>
  .el-tree-node__content{
    height: 34px;
  }
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }
  .container:first-of-type{
    margin-bottom: 10px;
  }
  .grid-content-button{
    text-align: right;
  }
</style>