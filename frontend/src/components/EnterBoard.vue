<script setup lang="ts">
import { defineComponent, ref } from "vue";
</script>

<template>
  <div class="content">
    <div class="enterCard">
      <h1>加入白板</h1>
      <el-input v-model="input1" placeholder="账号" />
      <el-button color="#35456a">登 录</el-button>
      <h1>新建白板</h1>
      <el-input v-model="input2" placeholder="密码" />
      <el-button color="#35456a">注 册</el-button>
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

.enterCard {
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

</style>
