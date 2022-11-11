<script setup lang="ts">
  import { ref } from "vue";
  import { useRouter } from "vue-router";
  import { Paths } from "@/router";
  import { CreateRoom, JoinRoom, DeleteUser, exitRoom } from "@/service";
  import { StorageKey } from "@/store/state";
  import { ElMessage } from "element-plus";
  const router = useRouter();

  const uid = ref();
  const dialogVisible = ref(false);

  const handleCreate = async () => {
    const res = await CreateRoom({
      read_only: 1,
    });
    ElMessage.success(res.message);
    sessionStorage.setItem(StorageKey.UID, res.data.uid);
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
    try {
      await exitRoom({});
    } catch (err) {
      console.log(err);
    }
    // 清除缓存刷新一遍
    sessionStorage.clear();
    router.go(0);
  };
</script>

<template>
  <div class="enter">
    <h1>已登录</h1>
    <div class="content">
      <el-button color="#35456a" class="button" @click="handleCreate">创建白板</el-button>
      <el-button color="#35456a" class="button" @click="dialogVisible = true">
        加入白板
      </el-button>
    </div>

    <el-dialog v-model="dialogVisible" title="项目ID" width="300px" align-center draggable>
      <el-input v-model="uid" autocomplete="off" />
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleEnter"> 加入 </el-button>
        </span>
      </template>
    </el-dialog>

    <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" :icon="InfoFilled" icon-color="#626AEF"
      title="确认退出吗？" @confirm="logOut" @cancel="cancelEvent">
      <template #reference>
        <el-button class="logout">退出登录-</el-button>
      </template>
    </el-popconfirm>
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