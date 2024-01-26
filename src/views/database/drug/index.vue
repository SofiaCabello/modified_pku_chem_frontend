<template>
  <!--这是库存药物列表，包含过滤器、表格、分页器-->
  <div class="drug-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="药物名称" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"></el-input>
      <el-input v-model="listQuery.id" placeholder="药物编码" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"></el-input>
      <el-input v-model="listQuery.manufacturer" placeholder="生产厂家" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"></el-input>
      <el-select v-model="listQuery.type" placeholder="药物类型" class="filter-item" clearable style="width: 110px">
        <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>     
      <el-button type="primary" icon="el-icon-search"  class="filter-item" @click="handleFilter">检索</el-button>
      <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" type="primary" class="filter-item" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @sort-change="sortChange">
      <el-table-column label="药物编码" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="药物名称" prop="name" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="药物类型" prop="type" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="生产厂家" prop="manufacturer" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.manufacturer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="药品描述" prop="description" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.description }}</span>
        </template>
      </el-table-column>
      <el-table-column label="药物存量" prop="stock" width="120" align="center" sortable="custom" :class-name="getSortClass('stock')">
        <template slot-scope="{row}">
          <span>{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="药物售价" prop="priceOut" width="120" align="center" sortable="custom" :class-name="getSortClass('priceOut')">
        <template slot-scope="{row}">
          <span>{{ row.priceOut }}</span>
        </template>
      </el-table-column>
      <el-table-column label="药物进价" prop="priceIn" width="120" align="center" sortable="custom" :class-name="getSortClass('priceIn')">
        <template slot-scope="{row}">
          <span>{{ row.priceIn }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--分页器-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left: 50px;">
        <el-form-item label="药物名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入药物名称"></el-input>
        </el-form-item>
        <el-form-item label="药物类型" prop="type">
          <el-select v-model="temp.type" placeholder="请选择药物类型" style="width: 100%" class="filter-item">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item> 
        <el-form-item label="生产厂家" prop="manufacturer">
          <el-input v-model="temp.manufacturer" placeholder="请输入生产厂家"></el-input>
        </el-form-item>
        <el-form-item label="药品描述" prop="description">
          <el-input v-model="temp.description" placeholder="请输入药品描述"></el-input>
        </el-form-item>
        <el-form-item label="药物存量" prop="stock">
          <el-input v-model="temp.stock" placeholder="请输入药物存量"></el-input>
        </el-form-item>
        <el-form-item label="药物售价" prop="priceOut">
          <el-input v-model="temp.priceOut" placeholder="请输入药物单价"></el-input>
        </el-form-item>
        <el-form-item label="药物进价" prop="priceIn">
          <el-input v-model="temp.priceIn" placeholder="请输入药物进价"></el-input>
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
import Pagination from '@/components/Pagination/index'
import { fetchList, updateDrug, createDrug, deleteDrug } from '@/api/drug'

const typeOptions = [
  {key: '中药', label: '中药'},
  {key: '西药', label: '西药'},
  {key: '中成药', label: '中成药'},
  {key: '其他', label: '其他'},
]

const typeKeyValue = typeOptions.reduce((acc,cur) => {
  acc[cur.key] = cur.label
  return acc
},{})

export default{
  name:'drugTable',
  components:{ Pagination },
  filters:{
    typeFilter(type){
      return typeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: undefined,
        type: undefined,
        manufacturer: undefined,
        description: undefined,
        stock: undefined,
        priceOut: undefined,
        priceIn: undefined,
        sort:'+id',
      },
      typeOptions,
      sortOptions:[{label:'编号升序',key:'+id'},{label:'编号降序',key:'-id'}],
      temp: {
        id: undefined,
        name: '',
        type: undefined,
        manufacturer: '',
        description: '',
        stock: undefined,
        priceOut: undefined,
        priceIn: undefined,
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑药物',
        create: '添加药物'
      },
      rules:{
        name: [
          { required: true, message: '请输入药物名称', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '请选择药物类型', trigger: 'change' }
        ],
        manufacturer: [
          { required: true, message: '请输入生产厂家', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入药品描述', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        stock: [
          { required: true, message: '请输入药物存量', trigger: 'blur' },
        ],
        priceOut: [
          { required: true, message: '请输入药物售价', trigger: 'blur' },
        ],
        priceIn: [
          { required: true, message: '请输入药物进价', trigger: 'blur' },
        ],
      },
      downloadLoading: false
    }
  },
  created() {
    this.getList()
  },
  methods:{
    getList(){
      this.listLoading = true
      fetchList(this.listQuery).then(response => {
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
      const { prop,order } = data
      if(prop === 'id'){
        this.sortByID(order)
      }if(prop === 'stock'){
        this.sortByStock(order)
      }if(prop === 'priceOut'){
        this.sortBypriceOut(order)
      }if(prop === 'priceIn'){
        this.sortBypriceIn(order)
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
    sortByStock(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+stock'
      }else{
        this.listQuery.sort = '-stock'
      }
      this.getList()
    },
    sortBypriceOut(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+priceOut'
      }else{
        this.listQuery.sort = '-priceOut'
      }
      this.getList()
    },
    sortBypriceIn(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+priceIn'
      }else{
        this.listQuery.sort = '-priceIn'
      }
      this.getList()
    },
    resetTemp(){
      this.temp = {
        id: undefined,
        name: '',
        type: '',
        manufacturer: '',
        description: '',
        stock: '',
        priceOut: '',
        priceIn: '',
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
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          const tempData = Object.assign({},this.temp)
          createDrug(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
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
    updateData(){
        this.$refs['dataForm'].validate((valid) => {
          if(valid){
            const tempData = Object.assign({},this.temp)
            updateDrug(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index,1,this.temp)
              this.dialogFormVisible = false
            })
          }
        })
    },
    handleDelete(row, index){
      this.$confirm('此操作将永久删除该药物, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>{
        deleteDrug(row.id).then(() => {
          this.list.splice(index,1)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    handleDownload(){
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel =>{
        const tHeader = ['药物编号','药物名称','药物类型','生产厂家','药物描述','药物存量','药物售价','药物进价']
        const filterVal = ['id','name','type','manufacturer','description','stock','priceOut','priceIn']
        const list = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data: list,
          filename: '药物列表'
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