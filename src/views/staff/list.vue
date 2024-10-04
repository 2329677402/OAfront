<!--
 * @Date: 2024-10-02 19:51:21
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\staff\list.vue
 * @Description: 员工列表
-->
<script setup name="stafflist">
import { ref, reactive, onMounted, watch } from "vue";
import staffHttp from "@/api/staffHttp";
import OAMain from "@/components/OAMain.vue";
import OADialog from "@/components/OADialog.vue";
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
    let data = await staffHttp.getStaffList(page, page_size, filterForm);
    pagination.total = data.count;
    staffs.value = data.results;
  } catch (detail) {
    ElMessage.error(detail);
  }
} // 获取员工列表

onMounted(async () => {
  fetchStaffList(1, page_size.value);
  try {
    let data = await staffHttp.getAllDepartment(); // 获取部门列表
    departments.value = data.results;
  } catch (detail) {
    ElMessage.error(detail);
  }
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

let departments = ref([]); // 部门列表
let filterForm = reactive({
  department_id: null,
  realname: "",
  date_joined: [],
}); // 筛选部门

const onSearch = () => {
  fetchStaffList(1, page_size.value);
}; // 筛选员工

let tableRef = ref(null); // 表格引用

const onDownload = async () => {
  let rows = tableRef.value.getSelectionRows();
  if (!rows || rows.length == 0) {
    ElMessage.info("请选择要下载的员工信息！");
    return;
  }
  try {
    // let row_uids = []
    // for(let row of rows){
    //   row_uids.push(row.uid)
    // }

    let response = await staffHttp.downloadStaffs(rows.map((row) => row.uid)); // map方法: 将rows数组中的每个元素映射为row.uid, 返回一个新数组
    // 借助a标签, 将response数据, 放到a标签的href属性中, 然后模拟点击a标签, 实现下载
    let href = window.URL.createObjectURL(response.data); // 将返回的二进制数据, 创建成一个URL对象
    const a = document.createElement("a"); // 创建一个a标签
    a.href = href;
    // 设置a标签的download属性, 在点击的时候, 就会执行下载操作
    a.setAttribute("download", "员工信息.xlsx");
    // 将a标签添加到网页结构中
    document.body.appendChild(a);
    // 模拟点击a标签行为,只要点击了, 浏览器就会执行下载操作(下载href属性指向的文件)
    a.click();

    // 下载完成后, 移除a标签
    document.body.removeChild(a);
    // 释放URL对象
    window.URL.revokeObjectURL(href);
  } catch (detail) {
    ElMessage.error(detail);
  }
}; // 下载员工信息

const onUploadSuccess = () => {
  router.push("/staff/upload");
}; // 跳转到上传员工信息页面
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
      <el-form :inline="true" class="my-form-inline">
        <el-form-item>
          <el-select
            v-model="filterForm.department_id"
            placeholder="请选择部门"
          >
            <el-option
              v-for="department in departments"
              :label="department.name"
              :value="department.id"
              :key="department.name"
            />
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-input v-model="filterForm.realname" placeholder="请输入姓名" />
        </el-form-item>

        <el-form-item>
          <!-- 入职时间 -->
          <el-date-picker
            v-model="filterForm.date_joined"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <!-- 查询按钮 -->
        <el-form-item>
          <el-button type="primary" icon="Search" @click="onSearch">
            查询
          </el-button>
        </el-form-item>

        <!-- 下载按钮 -->
        <el-form-item>
          <el-button type="success" icon="Download" @click="onDownload">
            下载
          </el-button>
        </el-form-item>

        <!-- 上传按钮 -->
        <el-form-item>
          <el-upload
            action=""
            :on-success="onUploadSuccess"
            :show-file-list="false"
            :auto-upload="true"
            accept=".xls,.xlsx"
          >
            <el-button type="info" icon="Upload">上传</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <el-table :data="staffs" ref="tableRef">
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

<style scoped>
.my-form-inline .el-input {
  --el-input-width: 120px;
}

.my-form-inline .el-select {
  --el-select-width: 120px;
}

.el-form--inline .el-form-item {
  margin-right: 20px;
}
</style>
