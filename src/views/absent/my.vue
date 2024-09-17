<!--
 * @Date: 2024-09-17 21:29:01
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\absent\my.vue
 * @Description: 个人考勤页面
-->
<script setup name="myabsent">
import OAPageHeader from "@/components/OAPageHeader.vue";
import { ref, reactive } from "vue";

let formLabelWidth = "100px"; // 表单标签宽度
let dialogFormVisible = ref(false); // 发起考勤对话框, 默认不显示
let absentform = reactive({
  title: "",
  absent_type_id: null,
  data_range: [],
  request_content: "",
}); // 发起考勤表单, 默认为空
let absent_types = ref([]); // 请假类型列表, 默认为空
let absentfromref = ref(); // 获取发起考勤的表单对象

let rules = reactive({
  title: [{ required: true, message: "请输入标题！", trigger: "blur" }],
  absent_type_id: [
    { required: true, message: "请选择请假类型！", trigger: "change" },
  ],
  data_range: [
    { required: true, message: "请选择请假时间！", trigger: "blur" },
  ],
  request_content: [
    { required: true, message: "请输入请假事由！", trigger: "blur" },
  ],
}); // 发起考勤表单验证规则

const onShowDialog = () => {
  absentform.title = ""; // 清空标题
  absentform.absent_type_id = null; // 清空请假类型
  absentform.data_range = []; // 清空请假时间
  absentform.request_content = ""; // 清空请假事由
  dialogFormVisible.value = true; // 显示发起考勤对话框
};

const onSubmitAbsent = () => {
  absentfromref.value.validate((valid) => {
    if (valid) {
      console.log("表单验证通过");
      dialogFormVisible.value = false; // 隐藏发起考勤对话框
    } else {
      console.log("表单验证失败");
      return false;
    }
  });
};
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
        prop="data_range"
      >
        <el-date-picker
          v-model="absentform.data_range"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
      </el-form-item>

      <el-form-item label="审批人" :label-width="formLabelWidth">
        <el-input value="xxx" readonly disabled autocomplete="off" />
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
