<!--
 * @Date: 2024-09-17 21:29:15
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\absent\sub.vue
 * @Description: 下属考勤页面
-->
<script setup name="subabsent">
import OAPageHeader from "@/components/OAPageHeader.vue";
import { ref, reactive, onMounted } from "vue";
import absentHttp from "@/api/absentHttp";
import { ElMessage } from "element-plus";
import timeFormatter from "@/utils/timeFormatter";
import OAMain from "@/components/OAMain.vue";

let absents = ref([]); // 下属考勤列表, 默认为空
let pagination = reactive({
  page: 1,
  total: 0,
}); // 分页信息
</script>

<template>
  <OAMain title="下属考勤">
    <el-card>
      <el-table :data="absents" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="absent_type.name" label="类型" />
        <el-table-column prop="request_content" label="原因" />
        <el-table-column label="发起时间">
          <template #default="scope">
            {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" />
        <el-table-column prop="end_date" label="结束日期" />
        <el-table-column prop="responder.realname" label="审批人" />
        <el-table-column prop="response_content" label="反馈意见" />
        <el-table-column label="审核状态">
          <template #default="scope">
            <el-tag type="info" v-if="scope.row.status == 1">审批中</el-tag>
            <el-tag type="success" v-else-if="scope.row.status == 2">
              已通过
            </el-tag>
            <el-tag type="danger" v-else>已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="处理">
          <template #default="scope">
            <el-button
              v-if="scope.row.status == 1"
              type="primary"
              icon="EditPen"
            />
            <el-button v-else disabled type="default">已处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="pagination.total"
          :page-size="2"
          v-model:current-page="pagination.page"
        />
      </template>
    </el-card>
  </OAMain>
</template>

<style scoped>
.el-pagination {
  justify-content: center;
}
</style>
