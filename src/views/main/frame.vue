<!--
 * @Date: 2024-09-11 21:52:54
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\main\frame.vue
 * @Description: OA系统主页
-->
<script setup name="frame">
import { ref, computed, reactive, onMounted } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Fold, Expand } from "@element-plus/icons-vue"; // 引入element-plus的图标
import { useRouter } from "vue-router";
import authHttp from "@/api/authHttp";
import { ElMessage } from "element-plus";
import routes from "@/router/frame";

const authStore = useAuthStore();
const router = useRouter();
let isCollapse = ref(false); // 侧边栏菜单, 默认不折叠
let dialogVisible = ref(false); // 修改密码对话框, 默认不显示
let resetPwdform = reactive({
  old_pwd: "",
  new_pwd: "",
  confirm_pwd: "",
}); // 修改密码表单, 默认为空

let formTag = ref(); // 获取重置密码的表单对象
let rules = reactive({
  old_pwd: [
    // trigger: "blur"：失去输入框焦点时触发验证
    { required: true, message: "请输入旧密码！", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度需在6~20之间!", trigger: "blur" },
  ],
  new_pwd: [
    { required: true, message: "请输入新密码！", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度需在6~20之间!", trigger: "blur" },
  ],
  confirm_pwd: [
    { required: true, message: "再次确认新密码！", trigger: "blur" },
    { min: 6, max: 20, message: "密码长度需在6~20之间!", trigger: "blur" },
  ],
}); // 修改密码表单验证规则

let formLabelWidth = "100px"; // 表单标签宽度

let asideWidth = computed(() => {
  if (isCollapse.value) {
    return "64px";
  } else {
    return "200px";
  }
});

// 侧边栏折叠与展开
const onCollapseAside = () => {
  isCollapse.value = !isCollapse.value;
};

// 退出登录
const onExit = () => {
  authStore.clearUserToken();
  router.push({ name: "login" });
};

// 提交密码表单
const onSubmit = () => {
  formTag.value.validate(async (valid, fields) => {
    if (valid) {
      try {
        await authHttp.resetPwd(
          resetPwdform.old_pwd,
          resetPwdform.new_pwd,
          resetPwdform.confirm_pwd
        );
        ElMessage.success("密码修改成功!");
        dialogVisible.value = false; // 关闭对话框
      } catch (detail) {
        ElMessage.error(detail);
      }
    } else {
      ElMessage.info("请按要求填写密码!");
    }
  });
};

// 控制修改密码对话框
const onControlResetPwdDialog = () => {
  resetPwdform.old_pwd = "";
  resetPwdform.new_pwd = "";
  resetPwdform.confirm_pwd = "";
  dialogVisible.value = true;
};

let defaultActive = ref("home"); // 默认选中的菜单项
onMounted(() => {
  // Tips: routes是一个数组, 而不是一个对象, 所以需要通过routes[0]来获取对象的children属性
  // console.log("routes", routes[0].children);
  // console.log("当前路由:", router.currentRoute.value.name);
  defaultActive.value = router.currentRoute.value.name;
});
</script>

<template>
  <el-container class="container">
    <!-- 侧边栏 -->
    <el-aside class="aside" :width="asideWidth">
      <!-- 跳转到首页 -->
      <router-link to="/" class="brand">
        <strong>OA</strong>
        <span v-show="!isCollapse">&nbsp;System</span>
      </router-link>

      <el-menu
        :router="true"
        active-text-color="#ffd04b"
        background-color="#343a40"
        class="el-menu-vertical-demo"
        :default-active="defaultActive"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <template v-for="route in routes[0].children">
          <!-- =======没有子菜单的展现形式======= -->
          <el-menu-item
            v-if="!route.children"
            :index="route.name"
            :route="{ name: route.name }"
          >
            <el-icon>
              <!-- component: 动态加载时使用的标签 -->
              <component :is="route.meta.icon" />
            </el-icon>
            <span>{{ route.meta.text }}</span>
          </el-menu-item>

          <!-- =======有子菜单的展现形式======= -->
          <el-sub-menu v-else :index="route.name">
            <template #title>
              <el-icon>
                <component :is="route.meta.icon" />
              </el-icon>
              <span>{{ route.meta.text }}</span>
            </template>
            <!-- 子菜单 -->
            <template v-for="child in route.children">
              <el-menu-item
                v-if="!child.meta.hidden"
                :index="child.name"
                :route="{ name: child.name }"
              >
                <el-icon>
                  <component :is="child.meta.icon" />
                </el-icon>
                <span>{{ child.meta.text }}</span>
              </el-menu-item>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
    </el-aside>

    <el-container>
      <!-- 导航栏 -->
      <el-header class="header">
        <div class="left-header">
          <el-button
            v-show="isCollapse"
            :icon="Expand"
            @click="onCollapseAside"
          />
          <el-button
            v-show="!isCollapse"
            :icon="Fold"
            @click="onCollapseAside"
          />
        </div>
        <el-dropdown>
          <span class="el-dropdown-link">
            <el-avatar :size="30" icon="UserFilled" />
            <span style="margin-left: 10px">
              [{{ authStore.user.department.name }}]
              {{ authStore.user.realname }}
            </span>
            <el-icon class="el-icon--right">
              <arrow-down />
            </el-icon>
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onControlResetPwdDialog">
                修改密码
              </el-dropdown-item>
              <el-dropdown-item divided @click="onExit">
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 主体 -->
      <el-main class="main"><router-view></router-view></el-main>
    </el-container>
  </el-container>

  <!-- 修改密码对话框 -->
  <el-dialog v-model="dialogVisible" title="修改密码" width="500">
    <el-form :model="resetPwdform" :rules="rules" ref="formTag">
      <el-form-item label="旧密码" :label-width="formLabelWidth" prop="old_pwd">
        <el-input
          v-model="resetPwdform.old_pwd"
          autocomplete="off"
          type="password"
        />
      </el-form-item>
      <el-form-item label="新密码" :label-width="formLabelWidth" prop="new_pwd">
        <el-input
          v-model="resetPwdform.new_pwd"
          autocomplete="off"
          type="password"
        />
      </el-form-item>
      <el-form-item
        label="确认密码"
        :label-width="formLabelWidth"
        prop="confirm_pwd"
      >
        <el-input
          v-model="resetPwdform.confirm_pwd"
          autocomplete="off"
          type="password"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="onSubmit"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>
.container {
  height: 100vh; /* 视口高度的百分比 */
  background-color: #f4f6f9;
}

.aside {
  background-color: #343a40;
  /* 侧边栏阴影, !important 是一个特殊的声明，用于提权*/
  box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22) !important;
}

.aside .brand {
  color: #fff;
  text-decoration: none; /* 去掉链接的下划线 */
  border-bottom: 1px solid #434a50;
  background-color: #232631;
  height: 60px;
  display: flex; /* 弹性布局 */
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

.header {
  height: 61px;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  display: flex;
  justify-content: space-between; /* 两端对齐 */
  align-items: center; /* 垂直居中 */
}

.el-dropdown-link {
  display: flex;
  align-items: center;
}
.el-menu {
  border: none; /* 重写element-plus的样式, 去掉边框 */
}
</style>
