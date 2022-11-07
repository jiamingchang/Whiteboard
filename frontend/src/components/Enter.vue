<script setup lang="ts">
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { Paths } from "@/router/index.ts";
import { CreateRoom, JoinRoom, DeleteUser } from "@/service/index.ts";
import { ElMessageBox } from "element-plus";
import { useStore } from 'vuex'
import { StorageKey } from "@/store/state.ts";

const store = useStore();
const router = useRouter();

const uid = ref(2471648225);
const isClick = ref(false);
const dialogVisible = ref(false);


const handleCreate = async () => {
  const res = await CreateRoom({
    read_only: "1",
  });
  if (!res || res.isSuccess == false) {
    ElMessage.error(res.message || "创建失败");
    return;
  }
  router.push(Paths.WHITEBOARD);
};

const handleEnter = async () => {
  console.log(uid.value);
  const res = await JoinRoom({
    uid: uid.value,
  });
  if (!res || res.isSuccess == false) {
    ElMessage.error(res.message || "加入失败");
    return;
  }
  router.push(Paths.WHITEBOARD);
};

const logOut = async () => {
  const res = await DeleteUser();
  if (!res || res.isSuccess == false) {
    ElMessage.error(res.message || "加入失败");
    return;
  }
  localStorage.removeItem(StorageKey.TOKEN);
  localStorage.removeItem(StorageKey.IS_LOGIN);
  store.state.isLogin = false
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
