<template>
  <!--已完成的订单表-->
  <div class="finished-container">
    <div class="filter-container">
      <el-input v-model="listQuery.orderID" placeholder="订单ID" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"/>
      <el-input v-model="listQuery.drugName" placeholder="药物名称" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"/>
      <el-input v-model="listQuery.custom" placeholder="客户名称" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"/>
      <el-select v-model="listQuery.orderType" placeholder="订单类型" class="filter-item" clearable style="width: 210px">
        <el-option v-for="item in orderTypeOptions" :key="item.key" :label="item.value" :value="item.key" />
      </el-select>
      <el-date-picker v-model="listQuery.time" type="datetime" placeholder="订单完成时间" />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">检索</el-button>
      <el-button :loading="downloadLoading" type="primary" class="filter-item" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @sort-change="sortChange">
      <el-table-column label="订单ID" prop="id" sortable="custom" align="center" width="120" :class-name="getSortClass('id')" >
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="药物名称" prop="name"  align="center" width="120" :class-name="getSortClass('drugName')" >
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="custom"  align="center" width="120" :class-name="getSortClass('custom')" >
        <template slot-scope="{row}">
          <span>{{ row.custom }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" prop="orderType"  align="center" width="120" :class-name="getSortClass('orderType')" >
        <template slot-scope="{row}">
          <span>{{ row.orderType }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单完成时间" prop="time" sortable="custom" align="center" width="180" :class-name="getSortClass('time')" >
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="利润" prop="profit" sortable="custom" align="center" width="120" :class-name="getSortClass('profit')" >
        <template slot-scope="{row}">
          <span>{{ row.profit }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  </div>
</template>

<script>
import { getFinished } from '@/api/order';
import Pagination from '@/components/Pagination';

const orderTypeOptions = [
  {key:'in' , value:'进货'},
  {key:'out' , value:'销售'}
]

const orderKeyValue = orderTypeOptions.reduce((acc,cur) => {
  acc[cur.key] = cur.value
  return acc
},{})

export default{
  name: 'Finished',
  components: { Pagination },
  filters: {
    orderTypeFilter(orderType){
      return orderKeyValue[orderType]
    }
  },
  data(){
    return{
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        orderID: undefined,
        drugName: undefined,
        custom: undefined,
        orderType: undefined,
        time: undefined,
        sort:'+id'
      },
      orderTypeOptions,
      downloadLoading: false
    }
  },
  created(){
    this.getList()
  },
  methods:{
    getList(){
      this.listLoading = true
      getFinished(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
    },
    sortChange(data){
      const { prop, order } = data
      if( prop === 'id'){
        this.sortByID(order)
      }
      if( prop === 'time'){
        this.sortByTime(order)
      }
      if( prop === 'profit'){
        this.sortByProfit(order)
      }
    },
    sortByID(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+id'
      }else{
        this.listQuery.sort = '-id'
      }
      this.getList()
    },
    sortByTime(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+time'
      }else{
        this.listQuery.sort = '-time'
      }
      this.getList()
    },
    sortByProfit(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+profit'
      }else{
        this.listQuery.sort = '-profit'
      }
      this.getList()
    },
    handleDownload(){
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel =>{
        const tHeader = ['订单ID','药物名称','客户名称','订单类型','订单完成时间','利润']
        const filterVal = ['orderID','drugName','custom','orderType','time','profit']
        const list = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data: list,
          filename: '已完成订单列表'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal){  
      return this.list.map(v => filterVal.map(j => {
        if(j === 'type'){
          return typeKeyValue[v[j]]
        }else{
          return v[j]
        }
      }))
    },
    getSortClass: function(key){
      const sort = this.listQuery.sort
      return sort === key ? 'ascending' : sort === '-' + key ? 'descending' : ''
    }
  }
}
</script>
