<!--
 * @Date: 2024-09-11 21:07:11
 * @Author: Poco Ray
 * @FilePath: \oafront\src\views\login\login.vue
 * @Description: 登录进行邮箱密码校验, 成功后跳转到OA系统首页
-->
<script setup name="login">
import login_img from "@/assets/image/login.png";
import { reactive } from "vue";
// import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import authHttp from "@/api/authHttp";
import { ElMessage } from "element-plus";

const authStore = useAuthStore();
const router = useRouter();

let form = reactive({
  email: "",
  password: "",
});

const onSubmit = async () => {
  //   console.log(form.email, form.password);
  let emailRgx = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
  let pwdRgx = /^[0-9a-zA-Z_-]{6,20}$/;

  if (!emailRgx.test(form.email)) {
    // alert("邮箱格式错误!");
    ElMessage.error("邮箱格式错误!");
    return;
  }
  if (!pwdRgx.test(form.password)) {
    // alert("密码格式错误!");
    ElMessage.error("密码格式错误!");
    return;
  }

  // axios
  // promise
  // 配置: 设置超时时间
  // url: 完整的URL地址

  /* 第一个版本: 直接使用axios发送请求;
  axios
    .post("http://127.0.0.1:8000/auth/login", {
      email: form.email,
      password: form.password,
    })
    .then((res) => {
      //  then: 请求成功的回调;
      //  console.log(res);
      let data = res.data;
      let token = data.token;
      let user = data.user;
      //  console.log(token, user);
      //  使用pinia存储token和user信息
      authStore.setUserToken(user, token);

      //  跳转到首页
      router.push({ name: "frame" });
    })
    .catch((err) => {
      //   catch: 请求失败的回调
      //   console.log(err);
      let detail = err.response.data.detail;
      alert(detail);
    }); */

  /* 第二个版本: 使用封装的axios发送请求
  authHttp
    .login(form.email, form.password)
    .then((res) => {
      let data = res.data;
      let token = data.token;
      let user = data.user;
      authStore.setUserToken(user, token);
      router.push({ name: "frame" });
    })
    .catch((err) => {
      let detail = err.response.data.detail;
      alert(detail);
    }); */

  // 第三个版本: 使用异步函数发送请求
  try {
    let data = await authHttp.login(form.email, form.password);
    let token = data.token;
    let user = data.user;
    authStore.setUserToken(user, token);
    router.push({ name: "frame" });
  } catch (detail) {
    // alert(detail);
    ElMessage.error(detail);
  }
};
</script>

<template>
  <div class="dowebok">
    <div class="container-login100">
      <div class="wrap-login100">
        <div class="login100-pic js-tilt" data-tilt>
          <img :src="login_img" alt="IMG" />
        </div>

        <div class="login100-form validate-form">
          <span class="login100-form-title"> 员工登陆 </span>

          <div class="wrap-input100 validate-input">
            <input
              class="input100"
              type="text"
              name="email"
              placeholder="邮箱"
              v-model="form.email"
            />
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="iconfont icon-fa-envelope" aria-hidden="true"></i>
            </span>
          </div>

          <div class="wrap-input100 validate-input">
            <input
              class="input100"
              type="password"
              name="password"
              placeholder="密码"
              v-model="form.password"
            />
            <span class="focus-input100"></span>
            <span class="symbol-input100">
              <i class="iconfont icon-fa-lock" aria-hidden="true"></i>
            </span>
          </div>

          <div class="container-login100-form-btn">
            <button class="login100-form-btn" @click="onSubmit">登陆</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- scoped: 限制样式只在当前组件生效 -->
<style scoped src="@/assets/css/login.css"></style>
<style scoped src="@/assets/iconfont/iconfont.css"></style>
