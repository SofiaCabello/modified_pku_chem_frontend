<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-card align="center">
        <span>欢迎回来，{{ this.currentRole }} {{ username }}</span>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: { },
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'roles',
      'username'
    ])
  },
  data(){
    return{
      currentRole: "",
      chartData: [],
      totalPrice: 0,
      profit: 0
    }
  },
  methods:{
    handleRole(){
      if(this.roles[0] == "admin"){
        this.currentRole = "管理员"
      }else if(this.roles[0] == "user"){
        this.currentRole = "普通用户"
      }
    },
  },
  created(){
    this.handleRole()
  }
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.EchartsPie {
  margin-top: 30px;
  /*居中*/
  display: flex;
}
</style>
