<!--
 * @Date: 2024-09-17 21:29:01
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\absent\my.vue
 * @Description: 个人考勤页面
-->
<script setup name="myabsent">
import OAPageHeader from "@/components/OAPageHeader.vue";
import { ref, reactive, onMounted, computed } from "vue";
import absentHttp from "@/api/absentHttp";
import { ElMessage } from "element-plus";
import timeFormatter from "@/utils/timeFormatter";

let formLabelWidth = "100px"; // 表单标签宽度
let dialogFormVisible = ref(false); // 发起考勤对话框, 默认不显示
let absentform = reactive({
  title: "",
  absent_type_id: null,
  date_range: [],
  request_content: "",
}); // 发起考勤表单, 默认为空

let absents = ref([]); // 个人考勤列表, 默认为空
let absent_types = ref([]); // 请假类型列表, 默认为空
let responder = reactive({
  email: "",
  realname: "",
}); // 创建审批人对象
let responder_str = computed(() => {
  if (responder.email) {
    return "[" + responder.email + "]" + responder.realname;
  } else {
    return "无";
  }
}); // 指定的审批人信息
let absentfromref = ref(); // 获取发起考勤的表单对象

let rules = reactive({
  title: [{ required: true, message: "请输入标题！", trigger: "blur" }],
  absent_type_id: [
    { required: true, message: "请选择请假类型！", trigger: "change" },
  ],
  date_range: [
    { required: true, message: "请选择请假时间！", trigger: "blur" },
  ],
  request_content: [
    { required: true, message: "请输入请假事由！", trigger: "blur" },
  ],
}); // 发起考勤表单验证规则

// 显示发起考勤对话框
const onShowDialog = () => {
  absentform.title = ""; // 清空标题
  absentform.absent_type_id = null; // 清空请假类型
  absentform.date_range = []; // 清空请假时间
  absentform.request_content = ""; // 清空请假事由
  dialogFormVisible.value = true; // 显示发起考勤对话框
};

// 提交发起考勤表单
const onSubmitAbsent = () => {
  absentfromref.value.validate(async (valid, fields) => {
    if (valid) {
      let data = {
        title: absentform.title,
        absent_type_id: absentform.absent_type_id,
        start_date: absentform.date_range[0],
        end_date: absentform.date_range[1],
        request_content: absentform.request_content,
      };
      try {
        let absent = await absentHttp.applyAbsent(data);
        console.log(absent);
        dialogFormVisible.value = false; // 提交之后关闭对话框
      } catch (detail) {
        ElMessage.error(detail);
      }
    }
  });
};

// 生命周期钩子函数: 页面加载时获取数据
onMounted(async () => {
  try {
    // 1. 获取请假类型列表
    let absent_types_data = await absentHttp.getAbsentTypes();
    absent_types.value = absent_types_data;

    // 2. 获取审批人信息
    let responder_data = await absentHttp.getResponder();
    Object.assign(responder, responder_data);

    // 3. 获取个人考勤列表
    let absent_data = await absentHttp.getMyAbsents();
    absents.value = absent_data;
  } catch (detail) {
    ElMessage.error(detail);
  }
});
</script>

<template>
  <el-space direction="vertical" fill style="width: 100%">
    <OAPageHeader content="个人考勤"></OAPageHeader>
    <el-card style="text-align: right">
      <el-button type="primary" @click="onShowDialog">
        <el-icon><Plus /></el-icon>
        发起考勤
      </el-button>
    </el-card>

    <!-- 个人考勤列表表格展示 -->
    <el-card>
      <el-table :data="absents" style="width: 100%">
        <el-table-column prop="title" label="标题" />
        <el-table-column prop="absent_type" label="类型" />
        <el-table-column prop="request_content" label="原因" />
        <el-table-column label="发起时间">
          <template #default="scope">
            {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
          </template>
        </el-table-column>
        <el-table-column prop="start_date" label="开始日期" />
        <el-table-column prop="end_date" label="结束日期" />
        <el-table-column label="审批人">
          <!-- 使用插槽, 可以自定义列的内容 -->
          {{ responder_str }}
        </el-table-column>
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
      </el-table>
    </el-card>
  </el-space>

  <!-- 发起考勤对话框 -->
  <el-dialog v-model="dialogFormVisible" title="发起请假" width="500">
    <el-form :model="absentform" :rules="rules" ref="absentfromref">
      <el-form-item label="标题" :label-width="formLabelWidth" prop="title">
        <el-input v-model="absentform.title" autocomplete="off" />
      </el-form-item>
      <el-form-item
        label="请假类型"
        :label-width="formLabelWidth"
        prop="absent_type_id"
      >
        <!-- 请假类型下拉框 -->
        <el-select
          v-model="absentform.absent_type_id"
          placeholder="请选择请假类型"
        >
          <el-option
            v-for="item in absent_types"
            :label="item.name"
            :value="item.id"
            :key="item.name"
          />
        </el-select>
      </el-form-item>

      <!-- 请假时间选择器 -->
      <el-form-item
        label="请假时间"
        :label-width="formLabelWidth"
        prop="date_range"
      >
        <el-date-picker
          v-model="absentform.date_range"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="YYYY-MM-DD"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>

      <el-form-item label="审批人" :label-width="formLabelWidth">
        <el-input :value="responder_str" readonly disabled autocomplete="off" />
      </el-form-item>

      <el-form-item
        label="请假理由"
        :label-width="formLabelWidth"
        prop="request_content"
      >
        <el-input
          type="textarea"
          v-model="absentform.request_content"
          autocomplete="off"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmitAbsent"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped></style>
