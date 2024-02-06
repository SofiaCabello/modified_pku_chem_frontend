<template>
  <!--这是库存药物列表，包含过滤器、表格、分页器-->
  <div class="drug-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-search"  class="filter-item" @click="openFilter">检索</el-button>
      <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" type="primary" class="filter-item" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-dialog title="高级检索" :visible.sync="queryFormVisible" width="50%" :close-on-click-modal="false">
      <el-form ref="queryForm" :model="listQuery" label-width="100px" size="mini">
        <el-form-item label="试剂名" prop="name">
          <el-input v-model="listQuery.name" placeholder="请输入试剂名"></el-input>
        </el-form-item>
        <el-form-item label="试剂ID" prop="id">
          <el-input v-model="listQuery.id" placeholder="请输入试剂ID"></el-input>
        </el-form-item>
        <el-form-item label="厂家 & 品牌" prop="producer">
          <el-input v-model="listQuery.producer" placeholder="请输入厂家 & 品牌"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="listQuery.specification" placeholder="请输入规格"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="nickName">
          <el-input v-model="listQuery.nickName" placeholder="请输入别名"></el-input>
        </el-form-item>
        <el-form-item label="化学式" prop="formula">
          <el-input v-model="listQuery.formula" placeholder="请输入化学式"></el-input>
        </el-form-item>
        <el-form-item label="CAS" prop="cas">
          <el-input v-model="listQuery.cas" placeholder="请输入cas"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="listQuery.location" placeholder="请输入位置"></el-input>
        </el-form-item>
        <el-form-item label="网址" prop="url">
          <el-input v-model="listQuery.url" placeholder="请输入网址"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="listQuery.stock" placeholder="请输入库存"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="queryFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFilter">确 定</el-button>
      </div>
    </el-dialog>
  

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @sort-change="sortChange">
      <el-table-column label="试剂ID" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="试剂名" prop="name" sortable="custom" width="120" align="center" :class-name="getSortClass('name')">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="别名" prop="nickName" sortable="custom" width="120" align="center" :class-name="getSortClass('nickName')">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂家 & 品牌" prop="producer" sortable="custom" width="150" align="center" :class-name="getSortClass('producer')">
        <template slot-scope="{row}">
          <span>{{ row.producer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" prop="location"  sortable="custom" width="150" align="center" :class-name="getSortClass('location')">
        <template slot-scope="{row}">
          <span>{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="specification" sortable="custom" width="120" align="center" :class-name="getSortClass('specification')">
        <template slot-scope="{row}">
          <span>{{ row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stock" width="60" align="center" sortable="custom" :class-name="getSortClass('stock')">
        <template slot-scope="{row}">
          <span>{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="化学式" prop="formula" width="120" align="center" sortable="custom" :class-name="getSortClass('formula')">
        <template slot-scope="{row}">
          <span>{{ row.formula }}</span>
        </template>
      </el-table-column>
      <el-table-column label="CAS" prop="cas" width="120" align="center" sortable="custom" :class-name="getSortClass('cas')">
        <template slot-scope="{row}">
          <span>{{ row.cas }}</span>
        </template>
      </el-table-column>
    <el-table-column label="网址" prop="url" width="120" align="center" sortable="custom" :class-name="getSortClass('url')">
      <template slot-scope="{row}">
        <span>{{ row.url }}</span>
      </template>"
    </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="purchaseVisible = true; purchaseTemp = row">
            购买申请
          </el-button>
          <el-button type="warning" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="danger" size="mini" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="购买申请" :visible.sync="purchaseVisible">
      <el-form ref="dataForm" :model="purchaseTemp" label-position="left" label-width="120px" style="width: 400px; margin-left: 50px;">
        <el-form-item label="当前药物信息" prop="name">
          编号为{{purchaseTemp.id}}，{{purchaseTemp.producer}}生产的{{ purchaseTemp.specification }}规格的{{ purchaseTemp.name }}
        </el-form-item>
        <el-form-item label="请选择购买渠道" prop="name">
          <el-radio-group v-model="purchaseTemp.purchaseChannel">
            <el-radio label="1">京东</el-radio>
            <el-radio label="2">淘宝</el-radio>
            <el-radio label="3">其他</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="当前日期" prop="name">
          {{ new Date().toLocaleDateString() }}
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click="purchaseVisible = false">取 消</el-button>
          <el-button type="primary" @click="handlePurchaseRequest">确 定</el-button>
        </div>
    </el-dialog>

    <!--分页器-->
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left: 50px;">
        <el-form-item label="试剂名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入试剂名"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="nickName">
          <el-input v-model="temp.nickName" placeholder="请输入别名"></el-input>
        </el-form-item>
        <el-form-item label="厂家 & 品牌" prop="producer">
          <el-input v-model="temp.producer" placeholder="请输入厂家 & 品牌"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-input v-model="temp.location" placeholder="请输入位置"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="temp.specification" placeholder="请输入规格"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="temp.stock" placeholder="请输入库存"></el-input>
        </el-form-item>
        <el-form-item label="化学式" prop="formula">
          <el-input v-model="temp.formula" placeholder="请输入化学式"></el-input>
        </el-form-item>
        <el-form-item label="CAS" prop="cas">
          <el-input v-model="temp.cas" placeholder="请输入CAS"></el-input>
        </el-form-item>
        <el-form-item label="网址" prop="url">
          <el-input v-model="temp.url" placeholder="请输入网址"></el-input>
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
import { postPurchaseRequest } from '@/api/request/buy'
import { fetchList, updateDrug, createDrug, deleteDrug } from '@/api/drug'

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
        sort:'+id',
        name: undefined,
        id: undefined,  
        producer: undefined,
        specification: undefined,
        nickName: undefined,
        formula: undefined,
        cas: undefined,
        location: undefined,
        url: undefined,
        stock: undefined,
      },
      purchaseVisible: false,
      sortOptions:[{label:'编号升序',key:'+id'},{label:'编号降序',key:'-id'}],
      temp: {
        id: undefined,
        name: '',
        producer: '',
        specification: '',
        nickName: '',
        formula: '',
        cas: '',
        location: '',
        url: '',
        stock: '',
      },
      purchaseTemp: {
        id: undefined,
        name: '',
        producer: '',
        specification: '',
        nickName: '',
        formula: '',
        cas: '',
        location: '',
        url: '',
        stock: '',
      },
      dialogFormVisible: false,
      queryFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑试剂',
        create: '添加试剂'
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
    openFilter(){
      this.queryFormVisible = true
    },
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
      this.queryFormVisible = false
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
      this.$confirm('此操作将永久删除该试剂, 是否继续?', '提示', {
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
    },
    handlePurchaseRequest(){
      const tempData = Object.assign({},this.purchaseTemp)
      postPurchaseRequest(tempData).then(() => {
        this.purchaseVisible = false
      })
    }
    
    
  }
  
}

</script>

<style lang="scss" scoped>
.filter-container{
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 15px;
}

</style>
