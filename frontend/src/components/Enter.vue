<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Paths } from "@/router";
import { CreateRoom, JoinRoom, DeleteUser, getUser, exitRoom } from "@/service";
import { ElMessage } from "element-plus";
const router = useRouter();

const uid = ref();
const dialogVisible = ref(false);

const handleCreate = async () => {
  const res = await CreateRoom({
    read_only: 2,
  });
  ElMessage.success(res.message);
  router.push(Paths.WHITEBOARD);
};

const handleEnter = async () => {
  console.log(typeof uid.value);
  const res = await JoinRoom({
    uid: +uid.value,
  });
  ElMessage.success(res.message);
  router.push(Paths.WHITEBOARD);
};

const logOut = async () => {
  await exitRoom({});
  // 清除缓存刷新一遍
  sessionStorage.clear();
  router.go(0);
};
</script>

<template>
  <div class="enter">
    <h1>已登录</h1>
    <el-button class="logout" @click="logOut">退出登录</el-button>
    <div class="content">
      <el-button color="#35456a" class="button" @click="handleCreate"
        >创建项目</el-button
      >
      <el-button color="#35456a" class="button" @click="dialogVisible = true">
        加入项目
      </el-button>
    </div>
    <el-dialog v-model="dialogVisible" title="项目ID" width="340px">
      <el-input v-model="uid" autocomplete="off" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEnter"> 加入 </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped lang="scss">
.enter {
  height: 360px;
  width: 500px;
  color: aliceblue;
  background-color: #5169a3;
  border-radius: 10px;
  padding: 50px;
  box-sizing: border-box;
  box-shadow: 3px 8px 15px rgb(157, 157, 157);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.content {
  width: 300px;
  height: 270px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.button {
  height: 120px;
  width: 140px;
}

.logout {
  height: 18px;
  width: 60px;
  font-size: 12px;
  margin-top: 10px;
}

.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
