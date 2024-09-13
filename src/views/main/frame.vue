<!--
 * @Date: 2024-09-11 21:52:54
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\main\frame.vue
 * @Description: OA系统首页
-->
<script setup name="frame">
import { ref, computed } from "vue";
import { useAuthStore } from "@/stores/auth";
import { Fold, Expand } from "@element-plus/icons-vue"; // 引入element-plus的图标
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();
let isCollapse = ref(false); // 折叠侧边栏菜单

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
        active-text-color="#ffd04b"
        background-color="#343a40"
        class="el-menu-vertical-demo"
        default-active="1"
        text-color="#fff"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <!-- =======首页======= -->
        <el-menu-item index="1">
          <el-icon><HomeFilled /></el-icon>
          <span>首页</span>
        </el-menu-item>

        <!-- =======考勤管理======= -->
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Checked /></el-icon>
            <span>考勤管理</span>
          </template>
          <el-menu-item index="2-1">
            <el-icon><UserFilled /></el-icon>
            <span>个人考勤</span>
          </el-menu-item>
          <el-menu-item index="2-2">
            <el-icon><User /></el-icon>
            <span>下属考勤</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- =======通知管理======= -->
        <el-sub-menu index="3">
          <template #title>
            <el-icon><BellFilled /></el-icon>
            <span>通知管理</span>
          </template>
          <el-menu-item index="3-1">
            <el-icon><CirclePlusFilled /></el-icon>
            <span>发布通知</span>
          </el-menu-item>
          <el-menu-item index="3-2">
            <el-icon><List /></el-icon>
            <span>通知列表</span>
          </el-menu-item>
        </el-sub-menu>

        <!-- =======员工管理======= -->
        <el-sub-menu index="4">
          <template #title>
            <el-icon><Avatar /></el-icon>
            <span>员工管理</span>
          </template>
          <el-menu-item index="4-1">
            <el-icon><CirclePlusFilled /></el-icon>
            <span>新增通知</span>
          </el-menu-item>
          <el-menu-item index="4-2">
            <el-icon><List /></el-icon>
            <span>员工列表</span>
          </el-menu-item>
        </el-sub-menu>
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
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided @click="onExit"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>
      <!-- 主体 -->
      <el-main class="main">Main</el-main>
    </el-container>
  </el-container>
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
