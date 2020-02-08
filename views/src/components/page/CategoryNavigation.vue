<template>
<div class="custom-tree-container">
  
  <div class="container">
    <el-row >
      <el-col :span="12"><div class="grid-content bg-purple"><p>分类可通过鼠标拖动调整</p></div></el-col>
      <el-col :span="4" :offset="8">
        <div class="grid-content-button">
          <el-button type="primary"
           @click="dialogVisible = true;soltName='';soltPath='';title='添加一级分类';changeSoltNode=null"
           >添加一级分类</el-button>
          <!-- 清空分类，勾选清空分类，功能后续完善
            <el-button type="primary" @click="submitSoltData">清空分类</el-button> -->
          </div></el-col>
    </el-row>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      width="30%"
      :closeOnClickModal='false'>
      <el-input style="margin-bottom:10px;" v-model="soltName" placeholder="请输入一级导航名称" ></el-input>
      <el-input v-model="soltPath" placeholder="请输入一级导航英文名" ></el-input>
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
      return {
        soltListData: [],
        dialogVisible: false,
        soltName: '',
        soltPath:'',
        title:'添加一级分类',
        changeSoltNode: null,
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
          this.soltListData = ret.categoryData;
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
        //changeSoltNode如果存在，则是 添加子分类或修改分类
        if( this.changeSoltNode  ){
          //isAddSort 是否为添加子分类
          if(!this.changeSoltNode.isAddSort){//修改分类
            if(!this.soltName.length || !this.soltPath.length) return this.editSortError();
            this.changeSoltNode.data.cate_name = this.soltName;
            this.changeSoltNode.data.cate_path = this.soltPath;
            this.upDateCategory();
          }else{//添加分类
            //子分类上的topId都指的是对应一级分类的_id
            let newChild = {_id:Date.now(),cate_name: this.soltName,cate_path:this.soltPath};
            if (!this.changeSoltNode.data.children){
              this.$set(this.changeSoltNode.data, 'children', []);
            }
            this.changeSoltNode.data.children.push(newChild);

            this.upDateCategory();

          }
          this.dialogVisible = false;//隐藏弹窗
        }else{
          //如果data是数组，添加一级分类，否则是添加子分类或修改分类
          if(isArray(data)){
            
            if(!this.soltName.length || !this.soltPath.length) return this.editSortError();
            this.dialogVisible = false;//隐藏弹窗
            let newChild = { cate_name: this.soltName,cate_path: this.soltPath,disabled:true };
            let res = this.$refs.tree.data.push(newChild);
            
            this.addCategory();
          }
        }
        
      },
      remove(node, data) {
        
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d =>d._id === data._id);
        //这一步为了配合更新方法或者删除方法使用
        this.changeSoltNode = node;
        parent.parent == null ? this.delTopCategory(node.data) : this.upDateCategory();
        children.splice(index, 1);
        
      },
      //isAddSort 添加子分类，默认是不添加 ,true添加
      openSortSetDialog(node,isAddSort=false){
        this.dialogVisible = true;
        this.changeSoltNode = node;
        this.changeSoltNode.isAddSort = isAddSort;
        if(isAddSort){
          this.title = '添加子分类';
          this.soltName = '';
          this.soltPath = '';
        }else{
          this.title = '修改分类';
          this.soltName = node.data.cate_name;
          this.soltPath = node.data.cate_path;
        }
      },
      //添加一级分类
      addCategory(){
        
        categoryApi('addCategoryTop',{'cate_name':this.soltName,'cate_path':this.soltPath}).then(ret=>{
          console.log(ret);
          let topData = this.$refs.tree.data;
          console.log(topData);
          topData.forEach(item=>{
            if( item.disabled && item._id == undefined ){
              item._id = ret.insertedId;
              item.disabled = false;
            }
          });
          console.log(topData);
          
        });
      },
      //获取顶级分类下面的所有数据
      //isdelete 默认false 不清除顶级分类数据， true：清除顶级分类数据
      //备注：如果是删除事件调用到了顶级
      getTopCategory(){
        
        let changeSoltNode = this.changeSoltNode;
        //获取操作节点的所在一级分类全部数据
        let topCategoryData = null;
        while(changeSoltNode.parent != null){
          if(  changeSoltNode.parent.parent == null){
            topCategoryData = changeSoltNode.data;
          }
          changeSoltNode = changeSoltNode.parent;
        }
        
        return topCategoryData;
      },
      //更新分类数据
      upDateCategory(){
        let  topCategoryData = this.getTopCategory();
        categoryApi('upDateCategory',topCategoryData).then(ret=>{
          console.log(ret);
          if(ret.code == 1){
            this.editSuccess();
          }
        });
        
      },
      //删除一级分类
      delTopCategory(topCategoryData){
          categoryApi('delTopCategory',topCategoryData).then(ret=>{
            console.log(ret);
            if(ret.code == 1){
              this.editSuccess();
            }
          });
          
      },
      renderContent(h, { node, data, store }) {
        return (
          <span class="custom-tree-node" >
            <span>{data.cate_name}</span>
            <span>
              <el-button size="mini" type="success is-plain"  on-click={ () => this.openSortSetDialog(node) }>修改</el-button>
              <el-button size="mini" type="primary is-plain"  on-click={ () => this.openSortSetDialog(node,true) }>添加</el-button>
              <el-button size="mini" type="danger is-plain"  on-click={ () => this.remove(node, data) }>删除</el-button>
            </span>
          </span>);
      },
      editSuccess(){
        this.$notify.success({
          title: '操作提示',
          message: '成功'
        });
      },
      editSortError(){
        this.$notify.error({
          title: '添加错误',
          message: '分类不能为空,请填写分类后再添加'
        });
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
      }
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
  .el-pagination{
    text-align: center;
  }
</style>