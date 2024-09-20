<!--
 * @Date: 2024-09-20 23:59:12
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\components\OADialog.vue
 * @Description: 对话框组件封装
-->
<script setup>
import { ref, defineModel, defineProps, defineEmits } from "vue";

// 自定义model, 用于控制对话框显示
let dialogVisible = defineModel({ Required: true });

// 对话框属性: 标题, 宽度
let props = defineProps({
  title: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: 500,
  },
});

// 定义事件
const emits = defineEmits(["cancel", "submit"]);

const onCancel = () => {
  dialogVisible.value = false;
  emits("cancel");
}; // 取消对话框

const onSubmit = () => {
  emits("submit");
}; // 提交对话框
</script>

<template>
  <!-- 发起考勤对话框 -->
  <el-dialog v-model="dialogVisible" :title="props.title" :width="props.width">
    <slot></slot>

    <!-- 对话框底部 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="onCancel">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
