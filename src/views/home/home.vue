<!--
 * @Date: 2024-10-08 23:22:30
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\views\home\home.vue
 * @Description: 首页
-->
<script setup name="home">
import { ref, reactive, onMounted } from "vue";
import staffHttp from "@/api/staffHttp";
import { useRouter } from "vue-router";
import OAMain from "@/components/OAMain.vue";
import timeFormatter from "@/utils/timeFormatter";
import { ElMessage } from "element-plus";
import homeHttp from "@/api/homeHttp";
import * as echarts from "echarts";

let informs = ref([]); // 通知公告
let absents = ref([]); // 缺勤员工
onMounted(async () => {
  // 获取首页数据
  try {
    informs.value = await homeHttp.getLatestInforms();
    absents.value = await homeHttp.getLatestAbsents();
    let rows = await homeHttp.getDepartmentStaffCount();
    // console.log(rows);

    let xAxisData = []; // x轴数据
    let yAxisData = []; // y轴数据
    for (let row of rows) {
      xAxisData.push(row.name);
      yAxisData.push(row.staff_count);
    }
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(
      document.getElementById("department-staff-count")
    );
    // 绘制图表
    myChart.setOption({
      tooltip: {},
      xAxis: {
        data: xAxisData,
      },
      yAxis: {},
      series: [
        {
          name: "员工数量",
          type: "bar",
          data: yAxisData,
        },
      ],
    });
  } catch (detail) {
    ElMessage.error(detail);
  }
});
</script>

<template>
  <OAMain title="首页">
    <!-- 展示各个部门的员工数量 -->
    <el-card>
      <template #header>
        <h2>部门员工统计</h2>
      </template>
      <!-- echarts图表 -->
      <div id="department-staff-count" style="width: 100%; height: 300px"></div>
    </el-card>

    <!--gutter: 分栏间隔间距 -->
    <el-row :gutter="10">
      <!-- 展示最新的10条通知记录 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <h2>最新通知</h2>
          </template>
          <el-table :data="informs">
            <el-table-column label="标题">
              <template #default="scope">
                <router-link
                  :to="{
                    name: 'inform_detail',
                    params: { pk: scope.row.id },
                  }"
                >
                  {{ scope.row.title }}
                </router-link>
              </template>
            </el-table-column>

            <el-table-column
              label="发布者"
              prop="author.realname"
            ></el-table-column>

            <el-table-column label="发布时间">
              <template #default="scope">
                {{ timeFormatter.stringFromDate(scope.row.create_time) }}
              </template>
            </el-table-column>

            <el-table-column label="是否已读">
              <template #default="scope">
                <el-tag v-if="scope.row.reads.length > 0" type="success">
                  已读
                </el-tag>
                <el-tag v-else type="danger">未读</el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>

      <!-- 展示最新的10条缺勤记录 -->
      <el-col :span="12">
        <el-card>
          <template #header>
            <h2>最新请假</h2>
          </template>
          <el-table :data="absents">
            <el-table-column label="部门" prop="requester.department.name">
            </el-table-column>

            <el-table-column label="请假员工" prop="requester.realname">
            </el-table-column>

            <el-table-column label="起始日期" prop="start_date">
            </el-table-column>

            <el-table-column label="结束日期" prop="start_date">
            </el-table-column>

            <el-table-column label="发起时间" prop="end_date">
              <template #default="scope">
                {{ timeFormatter.stringFromDateTime(scope.row.create_time) }}
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </OAMain>
</template>

<style scoped></style>
