<!--
 * @Date: 2024-10-02 19:51:21
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\staff\list.vue
 * @Description: 员工列表
-->
<script setup name="stafflist">
import { ref, reactive, onMounted, watch } from "vue";
import staffHttp from "@/api/staffHttp";
import { useRouter } from "vue-router";
import OAMain from "@/components/OAMain.vue";
import OADialog from "@/components/OADialog.vue";
import { useAuthStore } from "@/stores/auth";
import timeFormatter from "@/utils/timeFormatter";
import { ElMessage } from "element-plus";

let staffs = ref([]);
let pagination = reactive({
  page: 1,
  total: 0,
});
let page_size = ref(10); // 每页显示条数

let staffForm = reactive({
  status: 1,
}); // 修改员工状态表单, 默认为激活状态

let dialogVisible = ref(false);
let handleIndex = 0;
const onEditStaff = (index) => {
  handleIndex = index;
  dialogVisible.value = true;
  let staff = staffs.value[index];
  staffForm.status = staff.status;
};

const onSubmitEditStaff = async () => {
  let staff = staffs.value[handleIndex]; // 获取当前员工
  try {
    let newstaff = await staffHttp.updateStaffStatus(
      staff.uid,
      staffForm.status
    );
    ElMessage.success("员工状态修改成功！");
    dialogVisible.value = false;
    staffs.value.splice(handleIndex, 1, newstaff); // 更新员工列表
  } catch (detail) {
    ElMessage.error(detail);
  }
};

async function fetchStaffList(page, page_size) {
  try {
    let data = await staffHttp.getStaffList(page, page_size);
    pagination.total = data.count;
    staffs.value = data.results;
  } catch (detail) {
    ElMessage.error(detail);
  }
} // 获取员工列表

onMounted(async () => {
  fetchStaffList(1, page_size.value);
}); // 初始化获取员工列表

watch(
  () => pagination.page,
  async function (value) {
    fetchStaffList(value, page_size.value);
  }
); // 监听页码变化

watch(page_size, function (value) {
  if (pagination.page == 1) {
    fetchStaffList(1, value);
  } else {
    pagination.page = 1;
  }
}); // 监听每页显示条数变化
</script>

<template>
  <OADialog
    title="修改员工状态"
    v-model="dialogVisible"
    @submit="onSubmitEditStaff"
  >
    <el-form :model="staffForm" label-width="100px">
      <el-form-item label="状态">
        <el-radio-group v-model="staffForm.status" class="ml-4">
          <el-radio :value="1">激活</el-radio>
          <el-radio :value="3">锁定</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
  </OADialog>
  <OAMain title="员工列表">
    <el-card>
      <el-table :data="staffs">
        <!-- 多选框, 用于下载员工信息 -->
        <el-table-column type="selection" width="55"></el-table-column>

        <el-table-column label="序号" width="60">
          <template #default="scope">{{ scope.$index + 1 }}</template>
        </el-table-column>

        <el-table-column prop="realname" label="姓名"></el-table-column>

        <el-table-column prop="email" label="邮箱"></el-table-column>

        <el-table-column label="入职时间">
          <template #default="scope">
            {{ timeFormatter.stringFromDate(scope.row.date_joined) }}
          </template>
        </el-table-column>

        <el-table-column prop="department.name" label="所属部门">
        </el-table-column>

        <el-table-column label="状态">
          <template #default="scope">
            <el-tag v-if="scope.row.status == 1" type="success"> 正常 </el-tag>
            <el-tag v-else-if="scope.row.status == 2" type="warning">
              未激活
            </el-tag>
            <el-tag v-else type="danger"> 已锁定 </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              type="primary"
              icon="Edit"
              circle
              @click="onEditStaff(scope.$index)"
            />
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <div style="display: flex; justify-content: space-between">
          <el-form-item label="每页：">
            <el-select v-model="page_size" size="small" style="width: 100px">
              <el-option select label="10条/页" :value="10" />
              <el-option label="20条/页" :value="20" />
            </el-select>
          </el-form-item>
          <el-pagination
            background
            layout="prev, pager, next"
            :total="pagination.total"
            v-model:currentPage="pagination.page"
            :page-size="page_size"
          />
        </div>
      </template>
    </el-card>
  </OAMain>
</template>

<style scoped></style>
