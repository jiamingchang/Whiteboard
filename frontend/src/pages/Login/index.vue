<script setup lang="ts">
  import Login from '@/components/Login.vue'
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
