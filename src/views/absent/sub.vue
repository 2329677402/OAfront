<!--
 * @Date: 2024-09-17 21:29:15
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\absent\sub.vue
 * @Description: 下属考勤页面
-->
<script setup name="subabsent">
// import OAPageHeader from "@/components/OAPageHeader.vue";
import { ref, reactive, onMounted, watch } from "vue";
import absentHttp from "@/api/absentHttp";
import { ElMessage } from "element-plus";
import timeFormatter from "@/utils/timeFormatter";
import OAMain from "@/components/OAMain.vue";
import OAPagination from "@/components/OAPagination.vue";
import OADialog from "@/components/OADialog.vue";

let absents = ref([]); // 下属考勤列表, 默认为空
let pagination = reactive({
  page: 1,
  total: 0,
}); // 分页信息

let dialogVisible = ref(false); // 对话框显示状态

const onShowDialog = (index) => {
  absentform.status = 2;
  absentform.response_content = "";
  dialogVisible.value = true;
  handleIndex = index;
}; // 显示对话框, 初始表单状态

let absentform = reactive({
  status: 2,
  response_content: "",
}); // 处理考勤表单

let rules = {
  status: [{ required: true, message: "请选择处理结果!", trigger: "change" }],
  response_content: [
    { required: true, message: "请输入处理意见!", trigger: "blur" },
  ],
}; // 表单验证规则

let absentfromref = ref(); // 获取表单对象

let handleIndex = null; // 当前处理考勤记录的索引

const onSubmitAbsent = () => {
  absentfromref.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        dialogVisible.value = false;
        const absent = absents.value[handleIndex];
        const data = await absentHttp.handleSubAbsent(
          absent.id,
          absentform.status,
          absentform.response_content
        );
        console.log(data);
        absents.value.splice(handleIndex, 1, data); // 更新数据, 分别是: 开始位置, 删除个数, 插入的元素, 这里是仅更新状态和处理结果
        ElMessage.success("下属考勤处理成功!");
      } catch (detail) {
        ElMessage.error(detail);
      }
    }
  });
}; // 提交处理考勤表单

const requestSubAbsents = async (page) => {
  try {
    let data = await absentHttp.getSubAbsents(page);
    pagination.total = data.count;
    absents.value = data.results;
  } catch (detail) {
    ElMessage.error(detail);
  }
}; // 从服务器请求下属考勤数据

watch(
  () => pagination.page,
  (value) => {
    requestSubAbsents(value);
  }
); // 监听下属考勤列表的分页信息变化, value为当前页码

// 生命周期函数: 组件挂载后获取数据
onMounted(async () => {
  try {
    requestSubAbsents(pagination.page);
  } catch (detail) {
    ElMessage.error(detail);
  }
});
</script>

<template>
  <OADialog title="处理考勤" v-model="dialogVisible" @submit="onSubmitAbsent">
    <!-- 考勤表单具体内容 -->
    <el-form
      :model="absentform"
      :rules="rules"
      ref="absentfromref"
      label-width="100px"
    >
      <el-form-item label="结果" prop="status">
        <el-radio-group v-model="absentform.status" class="ml-4">
          <el-radio :value="2">通过</el-radio>
          <el-radio :value="3">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="理由" prop="response_content">
        <el-input
          type="textarea"
          v-model="absentform.response_content"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
  </OADialog>
  <OAMain title="下属考勤">
    <el-card>
      <el-table :data="absents" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column label="发起人">
          <template #default="scope">
            {{
              "[" +
              scope.row.requester.department.name +
              "]" +
              scope.row.requester.realname
            }}
          </template>
        </el-table-column>
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
              @click="onShowDialog(scope.$index)"
            />
            <el-button v-else disabled type="default">已处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <OAPagination
          v-model="pagination.page"
          :total="pagination.total"
        ></OAPagination>
      </template>
    </el-card>
  </OAMain>
</template>

<style scoped></style>
