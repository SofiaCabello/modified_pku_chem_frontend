<template>
  <div class="dashboard-container">
    <div class="dashboard-text">
      <el-card align="center">
        <span>欢迎回来，{{ this.currentRole }} {{ name }}</span>
      </el-card>
    </div>
    <div class="EchartsPie">
      <el-card align="center" style="width:100%">
        <div slot="header">
          <span>药品库存情况</span>
        </div>
        <EchartsPie :chartData="chartData" />
      </el-card>
    </div>
    <div class="profit-info">
      <el-card align="center" style="width:100%">
        <div slot="header">
          <span>药品盈利情况</span>
        </div>
        <el-row>
          <el-col :span="12">
            <el-card align="center">
              <span>库存药物价值</span>
              <br />
              <span>￥ {{ totalPrice }}</span>
            </el-card>
          </el-col>
          <el-col :span="12">
            <el-card align="center">
              <span>药品盈利总额</span>
              <br />
              <span>￥ {{ profit }}</span>
            </el-card>
          </el-col>
        </el-row>
      </el-card>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getEchart, getProfit } from '@/api/drug'
import EchartsPie from './components/EChartsPie'

export default {
  components: { EchartsPie },
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'roles'
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
    setEchartData(){
      getEchart().then(res => {
        this.chartData = res.data
      })
    },
    setProfitData(){
      getProfit().then(res => {
        this.totalPrice = res.data.totalPrice
        this.profit = res.data.totalProfit
      })
    }
  },
  created(){
    this.handleRole()
    this.setEchartData()
    this.setProfitData()
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
