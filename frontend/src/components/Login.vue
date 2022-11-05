<script setup lang="ts">
import { defineComponent, reactive, ref } from "vue";
import { Register } from '@/service/index.ts';
import { Md5 } from 'ts-md5';
// defineProps<{ msg: string }>();

const count = ref(0);
const isLogin = ref(false);
const hasUid = ref(true);
const stateText = ref("");

const userInfo = reactive({
  true_name: "",
  name: "",
  password: "",
});

const handleLogin = () => {
  hasUid.value = true;
};

const handleRegister = async () => {
  const res = await Register({
    true_name: userInfo.true_name,
    name: userInfo.name,
    password: userInfo.password,
    // password: Md5.hashStr(userInfo.password),
  });
  if(!res || res.isSuccess == false) {
    ElMessage.error(res.message || '注册失败')
  }
};
</script>

<template>
  <div v-if="isLogin" class="enter"></div>
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
        <el-input v-model="userInfo.password" placeholder="密码" />
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

.enter {
  height: 360px;
  width: 400px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 3px 8px 15px rgb(157, 157, 157);
}
</style>
