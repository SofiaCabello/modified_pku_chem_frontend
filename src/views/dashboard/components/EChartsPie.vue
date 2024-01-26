<template>
    <div ref="chart" style="width: 100%; height: 400px;"></div>
  </template>
  
  <script>
  import * as echarts from 'echarts';
  
  export default {
    name: 'EChartsPie',
    props: {
      chartData: {
        type: Array,
        required: true
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.initChart();
      });
    },
    methods: {
      initChart() {
        this.myChart = echarts.init(this.$refs.chart);
        this.updateChart();
      },
      updateChart() {
        const option = {
          legend: {
            top: 'bottom'
          },
          toolbox: {
            show: true,
            feature: {
              mark: { show: true },
              dataView: { show: true, readOnly: false },
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          series: [
            {
              name: 'Nightingale Chart',
              type: 'pie',
              radius: [50, 250],
              center: ['50%', '50%'],
              roseType: 'area',
              itemStyle: {
                borderRadius: 8
              },
              data: this.chartData
            }
          ]
        };
        this.myChart.setOption(option);
      }
    },
    watch: {
      chartData: 'updateChart'
    },
    beforeDestroy() {
      if (this.myChart) {
        this.myChart.dispose();
      }
    }
  };
  </script>
  
  <style>
  /* Add your component styles here */
  </style>
  