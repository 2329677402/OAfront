<!--
 * @Date: 2024-09-20 22:53:03
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\components\OAMain.vue
 * @Description: 考勤页面组件封装
-->
<script setup>
import OAPageHeader from "@/components/OAPageHeader.vue";
// import { defineProps } from "vue";

let props = defineProps({
  title: "",
});
</script>

<template>
  <el-space direction="vertical" fill style="width: 100%">
    <OAPageHeader :content="props.title"></OAPageHeader>
    <slot></slot>
  </el-space>
</template>

<style scoped>
/* 使用深度选择器, 使得el-space组件中的el-space__item元素宽度100%, 作用于考勤列表表单 */
.el-space :deep(.el-space__item) {
  width: 100%;
}
</style>
