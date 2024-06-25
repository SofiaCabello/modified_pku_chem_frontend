<template>
  <div class="dashboard-container">
    <el-card class="echart-card" style="width: 100%; ">
      <div slot="header" class="clearfix" style="display: flex;">
        <span>厂商比例统计</span>
      </div>
      <div id="echart-package-origin" style="width: 100%; height: 600px" class="echart"></div>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import * as echarts from 'echarts'
import { getProducerRatio } from '@/api/echart'

export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      
    }
  },
  created() {
  },
  mounted() {
    this.initProducerRatioChart()
  },
  methods:{
    async initProducerRatioChart(){
  const myChart = echarts.init(document.getElementById('echart-package-origin'))
  const originData = await getProducerRatio()
  let data = originData.data

  data.sort((a, b) => a.value - b.value)
  
  const option = {
    backgroundColor: 'white',
    title: {
      text: '化学试剂生产商占比',
      top: 20,
      textStyle: {
        color: '#000'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    visualMap: {
      show: false,
      min: 0,
      max: data[0].value,
      inRange: {
        colorLightness: [0, 1.3]
      }
    },
    series: [
      {
        name: '化学试剂生产商占比',
        type: 'pie',
        radius: '90%',
        center: ['45%', '60%'],
        data: data,
        roseType: 'radius',
        label: {
          color: 'rgba(0, 0, 0, 0.3)',
        },
        labelLine: {
          lineStyle: {
            color: 'rgba(0, 0, 0, 0.3)'
          },
          smooth: 0.2,
          length: 10,
          length2: 20
        },
        itemStyle:{
          shadowBlur: 30,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        },
        animationType: 'expansion',
        animationEasing: 'cubicInOut',
        animationDelay: function(idx) {
          return Math.random() * 200
        }
      }
    ]
  }
  option && myChart.setOption(option)
},
    async updateData(){
      const logisticData = await getLogistic(this.param)
      const data = this.parseJsonData(logisticData.data)
      const option = {
        xAxis: {
          data: data.map(item => item.province)
        },
        series: [
          {
            data: data.map(item => item.value)
          }
        ]
      }
      option && this.LChart.setOption(option)
    },
    parseJsonData(data){
      const result = []
      for (const key in data) {
        result.push({
          province: key,
          value: data[key][0]
        })
      }
      result.sort((a, b) => b.value - a.value)
      return result
    }
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

.dashboard-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .echart-card {
    .clearfix {
      height: 40px;
      // 垂直居中
      display: flex;
      align-items: center;
    }
    .echart {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>