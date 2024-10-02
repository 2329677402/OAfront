<!--
 * @Date: 2024-09-28 19:53:37
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\inform\publish.vue
 * @Description: 发布通知页面
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
import staffHttp from "@/api/staffHttp";
import { ElMessage } from "element-plus";
import { useAuthStore } from "@/stores/auth";
import informHttp from "@/api/informHttp";

const authStore = useAuthStore();

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
const editorConfig = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      // http://localhost:5173/image/upload
      // http://localhost:8000/image/upload
      server: import.meta.env.VITE_BASE_URL + "/image/upload", // 上传图片url地址
      fieldName: "image", // 上传图片到服务器的接收字段, 需要与serializer中的字段一致
      maxFileSize: 0.5 * 1024 * 1024, // 限制图片大小
      maxNumberOfFiles: 10, // 限制图片数量
      allowedFileTypes: ["image/*"], // 限制图片类型
      headers: {
        Authorization: "JWT " + authStore.token,
      }, // 请求头, 需要登录后才能上传图片
      timeout: 6 * 1000, // 超时时间

      // 自定义插入图片
      customInsert(res, insertFn) {
        // 0: 上传成功, 1: 上传失败
        if (res.errno == 0) {
          // res 即服务端的返回结果，insertFn 为插入图片的函数
          // Tips: 如果上传的是非图片文件, 后端在校验的时候只会返回message, 不会返回data, 此时的data为undefined
          console.log(res);
          let data = res.data;
          let url = import.meta.env.VITE_BASE_URL + data.url;
          let alt = data.alt;
          let href = import.meta.env.VITE_BASE_URL + data.href;

          // 从 res 中找到 url alt href ，然后插入图片
          insertFn(url, alt, href);
        } else {
          ElMessage.error(res.message);
        }
      },

      // 单个文件上传失败
      onFailed(file, res) {
        console.log(`${file.name} 上传失败`, res);
      },

      // 上传错误，或者触发 timeout 超时
      onError(file, err, res) {
        if (file.size > 0.5 * 1024 * 1024) {
          ElMessage.error("图片大小不能超过0.5MB!");
        } else {
          ElMessage.error("图片格式不正确!");
        }
      },
    },
  },
}; // wangEditor 富文本编辑器配置
// editorConfig.MENU_CONF['uploadImage']

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

onMounted(async () => {
  try {
    let data = await staffHttp.getAllDepartment();
    departments.value = data.results;
  } catch (detail) {
    ElMessage.error(detail);
  }
});

const onSubmit = () => {
  fromRef.value.validate(async (valid) => {
    if (valid) {
      console.log(informForm);
      try {
        let data = await informHttp.publishInform(informForm);
        console.log(data);
        ElMessage.success("发布成功!");
      } catch (detail) {
        ElMessage.error(detail);
      }
    } else {
      return false;
    } 
  });
}; // 提交表单
</script>

<template>
  <OAMain title="发布通知">
    <el-card>
      <!-- 发起通知表单 -->
      <el-form :model="informForm" :rules="rules" ref="fromRef">
        <el-form-item
          label="通知标题"
          :label-width="formLabelWidth"
          prop="title"
        >
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
    </el-card>
  </OAMain>
</template>

<style scoped></style>
