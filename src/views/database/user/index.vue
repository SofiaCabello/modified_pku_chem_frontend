<template>
  <!--这是系统用户列表，包含过滤器、表格、分页器-->
  <div class="drug-container">
    <div class="filter-container">
      <el-input v-model="listQuery.username" placeholder="用户名" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"></el-input>
      <el-input v-model="listQuery.id" placeholder="用户ID" class="filter-item" @keyup.enter.native="handleFilter" style="width: 210px"></el-input>
      <el-select v-model="listQuery.role" placeholder="用户角色" class="filter-item" clearable style="width: 110px">
        <el-option v-for="item in roleOptions" :key="item.key" :label="item.label" :value="item.key"/>
      </el-select>     
      <el-button type="primary" icon="el-icon-search"  class="filter-item" @click="handleFilter">检索</el-button>
      <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" type="primary" class="filter-item" icon="el-icon-download" @click="handleDownload">导出</el-button>
    </div>

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @sort-change="sortChange">
      <el-table-column label="用户编号" prop="id" sortable="custom" align="center" width="80" :class-name="getSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="username" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户角色" prop="role" width="120" align="center">
        <template slot-scope="{row}">
          <span>{{ row.role }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password">
          <el-input v-model="temp.password" placeholder="请输入用户密码"></el-input>
        </el-form-item>
        <el-form-item label="用户角色" prop="role">
          <el-select v-model="temp.role" placeholder="请选择用户角色" style="width: 100%" class="filter-item">
            <el-option v-for="item in roleOptions" :key="item.key" :label="item.label" :value="item.key"/>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="createData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { createUser, deleteUser, updateUser, fetchList } from '@/api/userTable'

const roleOptions = [
  { key: 'admin', label: '管理员' },
  { key: 'user', label: '一般用户' },
]

const roleKeyValue = roleOptions.reduce((acc,cur) => {
  acc[cur.key] = cur.label
  return acc
},{})

export default{
  name:'userTable',
  components:{ Pagination },
  filters:{
    roleFilter(role){
      return roleKeyValue[role]
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
        username: undefined,
        id: undefined,
        role: undefined,
        sort:'+id',
      },
      roleOptions,
      temp: {
        id: undefined,
        username: '',
        password: '',
        role: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        create: '添加用户',
      },
      rules:{
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入用户密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        role: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
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

        // 模拟请求完成后停止loading
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
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
      }if(prop === 'username'){
        this.sortByUsername(order)
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
    sortByUsername(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+username'
      }else{
        this.listQuery.sort = '-username'
      }
      this.getList()
    },
    resetTemp(){
      this.temp = {
        id: undefined,
        username: '',
        password: '',
        role: ''
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
          createUser(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete(row, index){
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>{
        deleteUser(row.id).then(() => {
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
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '用户名', '用户角色']
        const filterVal = ['id', 'username', 'role']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '用户列表'
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