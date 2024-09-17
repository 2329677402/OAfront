<!--
 * @Date: 2024-09-17 21:29:01
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\absent\my.vue
 * @Description: 个人考勤页面
-->
<script setup name="myabsent">
import OAPageHeader from "@/components/OAPageHeader.vue";
</script>

<template>
  <el-space direction="vertical" fill style="width: 100%">
    <OAPageHeader content="个人考勤"></OAPageHeader>
    <el-card style="text-align: right">
      <el-button type="primary">
        <el-icon><Plus /></el-icon>
        发起考勤
      </el-button>
    </el-card>
  </el-space>
</template>

<style scoped></style>
