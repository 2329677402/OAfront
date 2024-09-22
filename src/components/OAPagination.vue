<!--
 * @Date: 2024-09-20 23:09:46
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\components\OAPagination.vue
 * @Description: 全局分页组件封装
-->
<script setup name="OAPagination">
// import { defineModel, defineProps } from "vue";

// 分页数据: 总数, 当前页数
let props = defineProps({
  total: {
    type: Number,
    default: 0,
  },
  pageSize: {
    type: Number,
    default: 2,
  },
});

let page = defineModel({ required: true });
</script>

<template>
  <el-pagination
    background
    layout="prev, pager, next"
    :total="props.total"
    :page-size="props.pageSize"
    v-model:current-page="page"
  />
</template>

<style scoped>
/*  分页组件居中 */
.el-pagination {
  justify-content: center;
}
</style>
