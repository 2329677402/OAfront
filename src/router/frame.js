/*
 * @Date: 2024-10-09 22:52:52
 * @Author: Poco Ray
 * @FilePath: \OAfront\src\router\frame.js
 * @Description: 路由重构, 通过权限控制不同用户展示不同的模块, 方便后期维护与管理
 */
import frame from "@/views/main/frame.vue";
import myabsent from "@/views/absent/my.vue";
import subabsent from "@/views/absent/sub.vue";
import inform_publish from "@/views/inform/publish.vue";
import inform_list from "@/views/inform/list.vue";
import inform_detail from "@/views/inform/detail.vue";
import staffadd from "@/views/staff/add.vue";
import stafflist from "@/views/staff/list.vue";
import home from "@/views/home/home.vue";
import absent from "@/views/absent/index.vue";
import inform from "@/views/inform/index.vue";
import staff from "@/views/staff/index.vue";

// Tips: routes是一个数组, 而不是一个对象, 所以需要通过routes[0]来获取对象的属性
const routes = [
  {
    path: "/",
    name: "frame",
    component: frame,
    children: [
      {
        path: "/",
        name: "home",
        component: home,
        meta: {
          icon: "HomeFilled",
          text: "首页",
        },
      },

      {
        path: "/absent",
        name: "absent",
        component: absent,
        meta: { icon: "Checked", text: "考勤管理" },
        // Tips: 子菜单的路由路径不需要加上/,如果加上/,会导致路由访问路径中失去父级的path路径
        // 比如: /absent/my, 正确的访问路径是: /absent/my, 如果加上/,访问路径就变成了: /my
        children: [
          {
            path: "my",
            name: "myabsent",
            component: myabsent,
            meta: { icon: "UserFilled", text: "个人考勤" },
          },
          {
            path: "sub",
            name: "subabsent",
            component: subabsent,
            meta: { icon: "User", text: "下属考勤" },
          },
        ],
      },

      {
        path: "/inform",
        name: "inform",
        component: inform,
        meta: { icon: "BellFilled", text: "通知管理" },
        children: [
          {
            path: "publish",
            name: "inform_publish",
            component: inform_publish,
            meta: { icon: "CirclePlusFilled", text: "发布通知" },
          },
          {
            path: "list",
            name: "inform_list",
            component: inform_list,
            meta: { icon: "List", text: "通知列表" },
          },
          {
            path: "detail/:pk",
            name: "inform_detail",
            component: inform_detail,
            meta: { hidden: true },
          },
        ],
      },

      {
        path: "/staff",
        name: "staff",
        component: staff,
        meta: { icon: "Avatar", text: "员工管理" },
        children: [
          {
            path: "add",
            name: "staff_add",
            component: staffadd,
            meta: { icon: "CirclePlusFilled", text: "新增员工" },
          },
          {
            path: "list",
            name: "staff_list",
            component: stafflist,
            meta: { icon: "List", text: "员工列表" },
          },
        ],
      },
    ],
  },
];

export default routes;
