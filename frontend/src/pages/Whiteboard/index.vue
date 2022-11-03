<template>
  <div class="content">whiteboard</div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineProps<{ msg: string }>();

const count = ref(0);
</script>

<style scoped lang="scass"></style>
