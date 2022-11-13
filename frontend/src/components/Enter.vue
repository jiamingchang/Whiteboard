<script setup lang="ts">
  import { ref, computed, watch } from "vue";
  import { useRouter } from "vue-router";
  import { Paths } from "@/router";
  import {
    CreateRoom,
    JoinRoom,
    DeleteUser,
    exitRoom,
    GetUserRoom,
    GetRoomer
  } from "@/service";
  import { StorageKey } from "@/store/state";
  import { ElMessage } from "element-plus";
  import store from "@/store";
  const router = useRouter();

  // 加入房间input的value
  const uid = ref();

  const dialogVisible = ref(false);

  // 当前是否进入房间
  const isExistRoom = ref(sessionStorage.getItem(StorageKey.UID) ? true : false);

  const handleCreate = async () => {
    const res = await CreateRoom({
      read_only: 1,
    });
    ElMessage.success(res.message);
    sessionStorage.setItem(StorageKey.UID, (res.data as any).uid);
    sessionStorage.setItem(StorageKey.IS_ROOMER, true);
    store.commit("saveIsRoomer", true);
    router.push(Paths.WHITEBOARD);
  };

  const handleEnter = async () => {
    console.log(typeof uid.value);
    const res = await JoinRoom({
      uid: +uid.value,
    });
    ElMessage.success(res.message);
    sessionStorage.setItem(StorageKey.UID, uid.value);
    sessionStorage.setItem(StorageKey.IS_ROOMER, false);
    store.commit("saveIsRoomer", false);
    router.push(Paths.WHITEBOARD);
  };

  const handleExit = async () => {
    const res = await exitRoom({});
    ElMessage.success(res.message);
    sessionStorage.removeItem(StorageKey.UID);
    sessionStorage.removeItem(StorageKey.IS_ROOMER)
    isExistRoom.value = false;
  };

  const logOut = async () => {
    try {
      await DeleteUser({});
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
      <el-button color="#35456a" class="button iconfont icon-tianjia" @click="handleCreate">创建白板</el-button>
      <el-button color="#35456a" class="button" @click="dialogVisible = true">
        房间号加入
      </el-button>
    </div>
    <div class="content2">
      <el-button v-if="isExistRoom" color="#35456a" class="button" @click="router.go(1)">
        我的白板
      </el-button>
      <el-button v-if="isExistRoom" color="#35456a" class="button" @click="handleExit">
        退出所在房间
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

    <el-popconfirm confirm-button-text="确认" cancel-button-text="取消" icon-color="#626AEF" title="确认注销吗？"
      @confirm="logOut">
      <template #reference>
        <el-button class="logout">注销账号</el-button>
      </template>
    </el-popconfirm>
  </div>
</template>

<style scoped lang="scss">
  .enter {
    width: 600px;
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
    width: 380px;
    margin: 30px 0;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
  }

  .button {
    height: 100px;
    width: 150px;
  }

  .logout {
    height: 18px;
    width: 60px;
    font-size: 12px;
    margin-top: 40px;
  }

  .dialog-footer button:first-child {
    margin-right: 10px;
  }
</style>