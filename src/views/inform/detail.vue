<!--
 * @Date: 2024-09-28 19:54:00
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\inform\detail.vue
 * @Description: 通知详情页面
-->
<script setup name="inform_detail">
import {
  ref,
  reactive,
  onMounted,
  computed,
  watch,
  onBeforeUnmount,
} from "vue";
import OADialog from "@/components/OADialog.vue";
import OAMain from "@/components/OAMain.vue";
import OAPagination from "@/components/OAPagination.vue";
import timeFormatter from "@/utils/timeFormatter";
import { useAuthStore } from "@/stores/auth";
import informHttp from "@/api/informHttp";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";

const route = useRoute(); // 路由信息

let inform = reactive({
  title: "",
  content: "",
  create_time: "",
  author: {
    realname: "",
    department: {
      name: "",
    },
  },
}); // 通知详情

onMounted(async () => {
  try {
    const pk = route.params.pk;
    let data = await informHttp.getInformDetail(pk);
    Object.assign(inform, data); // 重新赋值给reactive对象,将data的属性拷贝到inform中
    // 发送请求,通知后端阅读量+1
    await informHttp.readInform(pk);
  } catch (detail) {
    ElMessage.error(detail);
  }
});
</script>

<template>
  <OAMain title="通知详情">
    <el-card>
      <template #header>
        <div style="text-align: center">
          <h2 style="padding-bottom: 20px">{{ inform.title }}</h2>
          <div>
            <span style="margin-right: 20px">
              作者: {{ inform.author.realname }}
            </span>
            <span>
              发布时间:
              {{ timeFormatter.stringFromDateTime(inform.create_time) }}
            </span>
          </div>
        </div>
      </template>

      <template #default>
        <div v-html="inform.content" class="content"></div>
      </template>

      <template #footer> 阅读量: {{ inform.read_count }} </template>
    </el-card>
  </OAMain>
</template>

<style scoped>
/* 图片最大为富文本编辑器的宽度 */
.content :deep(img) {
  max-width: 100%;
}
</style>
