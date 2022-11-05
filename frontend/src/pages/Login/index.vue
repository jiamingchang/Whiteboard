<script setup lang="ts">
  import Login from '@/components/Login.vue'
import { defineComponent, ref } from "vue";
// defineProps<{ msg: string }>();

const count = ref(0);

// 登录后 返回的token存入 vuex， 在请求中带上
// let { code, token } = await login(account, password)
// localStorage.setItem("token", token)
</script>

<template>
  <div class="page">
    <Login></Login>
  </div>
</template>

<style scoped lang="scss">
.page {
  height: 100vh;
  width: 100vw;
  background-image: linear-gradient(45deg, #cfd7ea, white);
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
