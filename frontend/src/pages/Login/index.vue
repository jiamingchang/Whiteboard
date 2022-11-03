<template>
  <div class="card">
    <el-button type="primary">Primary</el-button>
    11111
    <el-icon><CirclePlus /></el-icon>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref } from "vue";
defineProps<{ msg: string }>();

const count = ref(0);
</script>

<style scoped lang="scass"></style>
