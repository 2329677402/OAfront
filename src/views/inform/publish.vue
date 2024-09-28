<!--
 * @Date: 2024-09-28 19:53:37
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\inform\publish.vue
 * @Description: 
-->
<script setup name="inform_publish">
import OAMain from "@/components/OAMain.vue";
import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  onBeforeUnmount,
  shallowRef,
} from "vue";
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import { Editor, Toolbar } from "@wangeditor/editor-for-vue"; // 引入编辑器组件

let informForm = reactive({
  title: "", // 通知标题
  content: "", // 通知内容
  department_ids: [], // 通知部门
}); // 发布通知表单字段

const rules = {
  title: [{ required: true, message: "请输入通知标题!", trigger: "blur" }],
  content: [{ required: true, message: "请输入通知内容!", trigger: "blur" }],
  department_ids: [
    { required: true, message: "请选择通知部门!", trigger: "change" },
  ],
}; // 表单验证规则

let fromRef = ref(); // 表单引用
let formLabelWidth = "100px"; // 表单标签宽度
let departments = ref([]); // 部门列表

/////////////////// wangEditor富文本编辑器相关配置 ///////////////////
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();

// // 内容 HTML
// const valueHtml = ref("<p>hello</p>");

// // 模拟 ajax 异步获取内容
// onMounted(() => {
//   setTimeout(() => {
//     valueHtml.value = "<p>模拟 Ajax 异步设置内容</p>";
//   }, 1500);
// });

const toolbarConfig = {};
const editorConfig = { placeholder: "请输入内容..." };
let mode = "default"; // 编辑器模式

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
/////////////////// wangEditor富文本编辑器相关配置 ///////////////////

const onSubmit = () => {
  fromRef.value.validate((valid) => {
    if (valid) {
      console.log(informForm);
    } else {
      return false;
    }
  });
}; // 提交表单
</script>

<template>
  <OAMain title="发布通知">
    <!-- 发起通知表单 -->
    <el-form :model="informForm" :rules="rules" ref="fromRef">
      <el-form-item label="通知标题" :label-width="formLabelWidth" prop="title">
        <el-input v-model="informForm.title" autocomplete="off" />
      </el-form-item>

      <el-form-item
        label="通知部门"
        :label-width="formLabelWidth"
        prop="department_ids"
      >
        <el-select multiple v-model="informForm.department_ids">
          <el-option :value="0" label="所有部门"></el-option>
          <el-option
            v-for="department in departments"
            :label="department.name"
            :value="department.id"
            :key="department.name"
          />
        </el-select>
      </el-form-item>

      <el-form-item
        label="通知内容"
        :label-width="formLabelWidth"
        prop="content"
      >
        <div style="border: 1px solid #ccc; width: 100%">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editorRef"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 500px; overflow-y: hidden"
            v-model="informForm.content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="handleCreated"
          />
        </div>
      </el-form-item>
      <el-form-item>
        <div style="text-align: right; flex: auto">
          <el-button type="primary" @click="onSubmit">提交</el-button>
        </div>
      </el-form-item>
    </el-form>
  </OAMain>
</template>

<style scoped></style>
