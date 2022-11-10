<script setup lang="ts">
import { reactive, ref, computed, watch } from "vue";
import Enter from "@/components/Enter.vue";
import { Login, Register, getUser } from "@/service";
import { Md5 } from "ts-md5";
import { StorageKey } from "@/store/state";
import { ElMessage } from "element-plus";

const hasUid = ref(true);

// 登入临时值
const isTmpLogin = ref(false);

// 登入状态，以防刷新，这个差不多就是uselocalStroage的实现方式
const isLogin = computed(() =>
  isTmpLogin.value || sessionStorage.getItem(StorageKey.TOKEN) ? true : false
);

// 登入成功存取用户信息
watch(
  () => isLogin.value,
  (val) => {
    if (val) {
      getUser({}).then((res) => {
        sessionStorage.setItem(StorageKey.USER_NAME, (res.data as any).name);
      });
    }
  }
);

const userInfo = reactive({
  true_name: "",
  name: "123456",
  password: "111111",
});

// 登入
const handleLogin = async () => {
  const res = await Login({
    name: userInfo.name,
    password: Md5.hashStr(userInfo.password),
  });
  sessionStorage.setItem(StorageKey.TOKEN, res.data as string);
  isTmpLogin.value = true;
};

// 注册
const handleRegister = async () => {
  const res = await Register({
    true_name: userInfo.true_name,
    name: userInfo.name,
    password: Md5.hashStr(userInfo.password),
  });
  ElMessage.success(res.message);
};
</script>

<template>
  <Enter v-if="isLogin" />
  <div v-else class="content">
    <div class="loginCard">
      <h1>{{ hasUid ? "LOGIN" : "REGISTER" }}</h1>
      <div class="input">
        <el-input v-model="userInfo.name" placeholder="账号" />
        <el-input
          v-if="!hasUid"
          v-model="userInfo.true_name"
          placeholder="昵称"
        />
        <el-input
          v-model="userInfo.password"
          type="password"
          placeholder="密码"
          show-password
        />
      </div>
      <div v-if="hasUid">
        <el-button color="#35456a" @click="handleLogin">登 录</el-button>
      </div>
      <div v-else>
        <el-button color="#35456a" @click="handleRegister">注 册</el-button>
      </div>
    </div>
    <div class="loginSwitch">
      <div></div>
      <h1>协作白板</h1>
      <div v-if="hasUid">
        <span>没有账号？</span>
        <el-button color="#5169a3" size="small" @click="hasUid = false"
          >去 注 册</el-button
        >
      </div>
      <div v-else>
        <span>已有账号？</span>
        <el-button color="#5169a3" size="small" @click="hasUid = true"
          >去 登 录</el-button
        >
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  height: 360px;
  width: 600px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 8px 15px rgb(157, 157, 157);
  display: flex;
  flex-direction: row;
}

.loginCard {
  height: 400px;
  width: 300px;
  position: relative;
  top: -20px;
  left: 20px;
  background-color: #5169a3;
  padding: 50px;
  box-sizing: border-box;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}

.input {
  height: 110px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.loginSwitch {
  height: 360px;
  width: 300px;
  position: relative;
  left: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
</style>
