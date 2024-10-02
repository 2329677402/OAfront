<!--
 * @Date: 2024-09-28 19:53:53
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\inform\list.vue
 * @Description: 通知列表页面
-->
<script setup name="inform_list">
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

const authStore = useAuthStore();

let informs = ref([]); // 通知列表, 默认为空

let dialogVisible = ref(false); // 对话框是否可见
let handleIndex = 0; // 当前操作的通知索引
const onShowDialog = (index) => {
  handleIndex = index;
  dialogVisible.value = true;
}; // 显示对话框
const onDeleteInform = async () => {
  try {
    let inform = informs.value[handleIndex];
    await informHttp.deleteInform(inform.id);
    informs.value.splice(handleIndex, 1);
    dialogVisible.value = false;
    ElMessage.success("删除成功!");
  } catch (detail) {
    ElMessage.error(detail);
  }
}; // 删除通知

let pagination = reactive({
  page: 1,
  total: 0,
}); // 分页信息

onMounted(async () => {
  try {
    let data = await informHttp.getInformList(1);
    console.log(data);
    pagination.total = data.count;
    informs.value = data.results;
  } catch (detail) {
    ElMessage.error(detail);
  }
});
</script>

<template>
  <OADialog v-model="dialogVisible" title="提示" @submit="onDeleteInform">
    <span>您确定要删除这篇通知吗?</span>
  </OADialog>
  <OAMain title="通知列表">
    <el-card>
      <el-table :data="informs">
        <el-table-column label="通知标题">
          <template #default="scope">
            <el-badge v-if="scope.row.reads.length == 0" is-dot class="item">
              <RouterLink
                :to="{ name: 'inform_detail', params: { pk: scope.row.id } }"
              >
                {{ scope.row.title }}
              </RouterLink>
            </el-badge>
            <RouterLink
              v-else
              :to="{ name: 'inform_detail', params: { pk: scope.row.id } }"
            >
              {{ scope.row.title }}
            </RouterLink>
          </template>
        </el-table-column>
        <el-table-column label="发布者">
          <template #default="scope">
            {{
              "[" +
              scope.row.author.department.name +
              "]" +
              scope.row.author.realname
            }}
          </template>
        </el-table-column>
        <el-table-column label="发布时间">
          <template #default="scope">
            {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
          </template>
        </el-table-column>

        <el-table-column label="通知部门">
          <template #default="scope">
            <el-tag v-if="scope.row.public" type="success">公开</el-tag>
            <el-tag
              v-else
              v-for="department in scope.row.departments"
              :key="department.name"
              type="info"
            >
              {{ department.name }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              v-if="scope.row.author.uid == authStore.user.uid"
              type="danger"
              icon="Delete"
              @click="onShowDialog(scope.$index)"
            />
            <el-button v-else disabled type="default">无</el-button>
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

<style scoped>
.el-tag {
  margin-right: 5px;
}

.el-badge {
  margin-right: 5px;
  margin-top: 5px;
}
</style>
