<template>
  <!--未完成的订单表-->
  <div class="unfinished-container">
    <div class="filter-container">
      <el-input v-model="listQuery.orderID" placeholder="订单ID" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"/>
      <el-input v-model="listQuery.drugName" placeholder="药物名称" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"/>
      <el-input v-model="listQuery.custom" placeholder="客户名称" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"/>
      <el-select v-model="listQuery.orderType" placeholder="订单类型" class="filter-item" clearable style="width: 210px">
        <el-option v-for="item in orderTypeOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select>
      <el-date-picker v-model="listQuery.time" type="datetime" placeholder="订单创建时间" />
      <el-button type="primary" icon="el-icon-search" @click="handleFilter">检索</el-button>
      <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px" @click="handleCreate">添加</el-button>
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
      <el-table-column label="订单创建时间" prop="time" sortable="custom" align="center" width="180" :class-name="getSortClass('time')" >
        <template slot-scope="{row}">
          <span>{{ row.time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="info" size="mini" @click="handleFinish(row)">
            完成
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="110px" style="width: 400px; margin-left: 50px;">
        <el-form-item label="药物" prop="name" >
          <el-transfer
            filterable
            :filter-method="filterMethod"
            filter-placeholder="请输入药物名称"
            :data="drugOptions"
            v-model="temp.id"
            :titles="['可选药物', '已选药物']"
            :right-check-change="handleDrugChange"
            >
          </el-transfer>
        </el-form-item>
        <el-form-item label="药物数量" prop="quantity">
          <el-input v-model="temp.quantity" placeholder="请输入药物数量（用英文逗号隔开）" />
        </el-form-item>
        <el-form-item label="客户" prop="custom">
          <el-input v-model="temp.custom" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="订单类型" prop="orderType">
          <el-select v-model="temp.orderType" placeholder="请选择订单类型" clearable>
            <el-option v-for="item in orderTypeOptions" :key="item.label" :label="item.value" :value="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="订单创建时间" prop="time">
          <el-date-picker v-model="temp.time" type="datetime" placeholder="请选择订单创建时间" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getUnfinished, createUnfinished, updateUnfinished, deleteUnfinished, finishUnfinished } from '@/api/order';
import { getDrugList } from '@/api/drug';
import Pagination from '@/components/Pagination';

const orderTypeOptions = [
  {key:'in' , label:'进货'},
  {key:'out' , label:'销售'}
]

const orderKeyValue = orderTypeOptions.reduce((acc,cur) => {
  acc[cur.key] = cur.value
  return acc
},{})

export default{
  name: 'Unfinished',
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
      },
      drugOptions: [],
      value: [],
      transferQuery:{
        // 这是el-transfer的查询条件
        id: undefined,
        name: undefined
      },
      orderTypeOptions,
      downloadLoading: false,
      temp:{
        id: undefined,
        custom: undefined,
        orderType: undefined,
        time: undefined,
        quantity: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑订单',
        create: '新增订单'
      },
      rules:{
        quantity: [
          { required: true, message: '请输入药物数量', trigger: 'blur' }
        ],
        custom: [
          { required: true, message: '请输入客户名称', trigger: 'blur' }
        ],
        orderType: [
          { required: true, message: '请选择订单类型', trigger: 'blur' }
        ],
        time: [
          { required: true, message: '请选择订单创建时间', trigger: 'blur' }
        ]
        
      },
      downloadLoading: false
    }

  },
  created(){
    this.getList()
    this.getDrugOptions() 
  },
  methods:{
    getList(){
      this.listLoading = true
      getUnfinished(this.listQuery).then(response => {
        this.list = response.data
        this.total = response.total
        this.listLoading = false
      })
    },
    getDrugOptions(){
      console.log('getDrugOptions 被调用')
      // 获取药物列表
      getDrugList().then(response => {
          response.data.forEach(item => {
            this.drugOptions.push({
              key: item['id'],
              label: item['name']
            })
          })
      })
    },
    handleDrugChange(selectedData){
      // 选择药物后的回调，将选择药物的id数组赋值给listQuery.drugID
      this.listQuery.drugID = selectedData
    },
    filterMethod(query, item){
      // 按照药物名称进行筛选
      return item['label'].indexOf(query) > -1  
    },
    toLowerCase(str){
      return str.toLowerCase()
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
    resetTemp(){
      this.temp = {
        id: undefined,
        name: undefined,
        custom: undefined,
        orderType: undefined,
        time: undefined
      }
    },
    handleCreate(){
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData(){
      this.$refs['dataForm'].validate(valid => {
        if(valid){
          createUnfinished(this.temp).then(() => {
            this.$message({
              message: '创建成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleUpdate(row){
      this.temp = Object.assign({},row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData(row,index){
      this.$refs['dataForm'].validate(valid => {
        if(valid){
          const tempData = Object.assign({},this.temp)
          updateUnfinished(tempData, row.id).then(() => {
            this.$message({
              message: '更新成功',
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleDelete(row,index){
      this.$confirm('此操作将永久删除该订单, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUnfinished(row.id).then(() => {
          this.list.splice(index,1)
          this.$message({
            message: '删除成功',
            type: 'success'
          })
        })
      })
    },
    handleDownload(){
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel =>{
        const tHeader = ['订单编号','药品名称','客户名称','订单类型','订单创建时间','订单利润']
        const filterVal = ['id','name','custom','type','time','profit']
        const list = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data: list,
          filename: '已完成订单列表'
        })
        this.downloadLoading = false
      })
    },
    handleFinish(row,index){
      this.$confirm('此操作将该订单标记为已完成, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        finishUnfinished(row.id).then(() => {
          this.list.splice(index,1)
          this.$message({
            message: '标记成功',
            type: 'success'
          })
        })
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
