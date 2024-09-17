<!--
 * @Date: 2024-09-17 22:15:04
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\components\OAPageHeader.vue
 * @Description: 系统页面公共类
-->
<script setup name="OAPageHeader">
import { useRouter } from "vue-router";
import { defineProps } from "vue";
const router = useRouter();
const goBack = () => {
  router.go(-1); // 返回上一页面
};

let props = defineProps({
  content: "",
});
</script>

<template>
  <el-page-header @back="goBack" title="返回">
    <template #content>
      <span class="text-large font-600 mr-3"> {{ props.content }} </span>
    </template>
  </el-page-header>
</template>

<style scoped></style>
