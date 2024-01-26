<template>
  <div class="profile-container">
    <el-card style="margin-bottom: 30px">
      <div slot="header" class="clearfix">
        <span>个人中心</span>
      </div>

      <div class="user-profile">
        <div class="user-name text-center">{{ name }}</div>
        <div class="user-role text-center text-muted">
          用户权限：{{ roles[0] }}
        </div>
      </div>
      <div class="action-container">
        <el-button type="primary" size="small" @click="handleUpdate">修改信息</el-button>
      </div>
    </el-card>

    <el-dialog title="用户信息修改" :visible.sync="dialogFormVisible">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left: 50px;">
            <el-form-item label="用户名" prop="name">
                <el-input v-model="temp.name"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input v-model="temp.password"/>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateData">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import { mapGetters } from "vuex";
import { getInfo, updateInfo } from "@/api/user";
import { getToken } from '@/utils/auth';

export default {
  computed: {
    ...mapGetters(["name", "roles","id"]),
  },
  data(){
    return{
        dialogFormVisible: false,
        temp: {
            id: "",
            name: "",
            password: ""
        },
        rules: {
            name: [
            { required: true, message: "请输入用户名", trigger: "blur" },
            { min: 3, max: 20, message: "长度在 3 到 20 个字符", trigger: "blur" }
            ],
            password: [
            { required: true, message: "请输入密码", trigger: "blur" },
            { min: 6, max: 20, message: "长度在 6 到 20 个字符", trigger: "blur" }
            ]
        }
    }
  },
  methods: {
    handleUpdate() {
      this.dialogFormVisible = true;
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
            const tempData = {
                id: this.id,
                username: this.temp.name,
                password: this.temp.password
            }
            updateInfo(tempData).then((res) => {
                if (res.code === 200) {
                    this.$message({
                        message: "修改成功",
                        type: "success",
                    });
                    this.dialogFormVisible = false;
                    // 重新登录
                    this.$store.dispatch("user/resetToken").then(() => {
                        location.reload();
                    });
            
                }
            });
        } else {
          return false;
        }
      });
    },
  }
};
</script>
  
<style lang="scss" scoped>
.text-muted {
  color: #777;
}

.action-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
}

.user-profile {
  display: flex;
  flex-direction: column;
  align-items: center; /* 居中对齐子元素 */
  
  .user-name {
    font-weight: bold;
  }
  .user-role {
    padding-top: 10px;
    font-weight: 400;
    font-size: 14px;
  }
}
</style>
  