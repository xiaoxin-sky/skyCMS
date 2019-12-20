<template>
    <section class="main">
        <el-dialog v-dialogDrag :title="title" center :visible.sync="visible" width="30%">
            <slot></slot>
            <span slot="footer" class="dialog-footer">
                <el-button @click="visible = false">取 消</el-button>
                <el-button type="primary" @click="apply">确 定</el-button>
            </span>
        </el-dialog>
    </section>
</template>

<script>
import bus from "../common/bus";
export default {
    data(){
        return {
            visible: false
        }
    },
    props:['title'],
    methods:{
        apply(){
            data.visible = false;
            bus.$emit('dialogDragApplyEvent');
        }
    }

}
</script>

<style>

</style>
