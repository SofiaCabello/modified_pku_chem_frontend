<template>
  <!--这是库存药物列表，包含过滤器、表格、分页器-->
  <div class="drug-container">
    <div class="filter-container">
      <el-button type="primary" icon="el-icon-search"  class="filter-item" @click="openFilter">检索</el-button>
      <el-button type="primary" icon="el-icon-edit" style="margin-left: 10px" @click="handleCreate">添加</el-button>
      <el-button :loading="downloadLoading" type="primary" class="filter-item" icon="el-icon-download" @click="handleDownload">导出</el-button>
      <span v-if="isAdmin" style="margin-left: 10px">
        <el-button type="primary" icon="el-icon-upload2" class="filter-item" @click="handleUpload">导入</el-button>
        <el-button type="primary" icon="el-icon-document" class="filter-item" @click="getUploadTemplate">模板</el-button>
        <!--在这里做一个帮助按钮，悬浮时显示-->
        <el-tooltip effect="light"
          content="导入时请使用模板。stock为0表示无货，1表示有货。lab、location、layer为实验室、存储位置、层数，layer可为空。化学式中的数字会被自动转化为下标。" 
          placement="top" style="margin-left: 5px; color : #409EFF;">
          <i class="el-icon-question filter-item"></i>
        </el-tooltip>
        <transition name="fade">
          <span class="mutiple-selection" v-if="multipleSelection.length > 0" style="margin-left: 13px">
            <el-button type="danger" icon="el-icon-delete" @click="handleMutipleDelete">批量删除</el-button>
            <el-button type="warning" icon="el-icon-edit" @click="handleMutipleUpdate">批量编辑</el-button>
          </span>
        </transition>
      </span>
    </div>

    <el-dialog title="高级检索" :visible.sync="queryFormVisible" width="50%" :close-on-click-modal="false">
      <el-form ref="queryForm" :model="listQuery" label-width="100px" size="mini">
        <el-form-item label="试剂名/别名" prop="name">
          <el-input v-model="listQuery.name" placeholder="请输入试剂名/别名"></el-input>
        </el-form-item>
        <el-form-item label="厂家 & 品牌" prop="producer">
          <!-- <el-select v-model="listQuery.producer" placeholder="请选择厂家 & 品牌" style="width: 80%" class="filter-item">
            <el-option v-for="item in tagList.producerTags" :key="item" :label="item" :value="item"/>
          </el-select> -->
          <el-autocomplete
            style="width: 80%"
            class="inline-input"
            v-model="listQuery.producer"
            :fetch-suggestions="querySearch"
            placeholder="请输入厂家并选择"
            :trigger-on-focus="false"
            @select="handleQuerySelect"
            @change="handleQueryChange"
          ></el-autocomplete>
          <el-button @click="listQuery.producer = ''" style="margin-left: 10px; width: 15%;">重置</el-button>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="listQuery.specification" placeholder="请输入规格"></el-input>
        </el-form-item>
        <el-form-item label="化学式" prop="formula">
          <el-input v-model="listQuery.formula" placeholder="请输入化学式"></el-input>
        </el-form-item>
        <el-form-item label="CAS" prop="cas">
          <el-input v-model="listQuery.cas" placeholder="请输入cas"></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-select v-model="listQuery.lab" placeholder="选择实验室" style="width: 30%" class="filter-item">
            <el-option v-for="item in tagList.labTags" :key="item" :label="item" :value="item"/>
          </el-select>
          <el-select v-model="listQuery.location" placeholder="选择存储位置" style="width: 30%; margin-left: 10px" class="filter-item">
            <el-option v-for="item in tagList.locationTags" :key="item" :label="item" :value="item"/>
          </el-select>
          <span>
            第<el-input v-model="listQuery.layer" style="width: 10%;"></el-input>层/号
          </span>
          <el-button style="width: 15%; margin-left: 10px;" @click="listQuery.lab = ''; listQuery.location = ''; listQuery.layer = ''">重置</el-button>
        </el-form-item>
        <el-form-item label="购买渠道" prop="url">
          <el-input v-model="listQuery.url" placeholder="请输入购买渠道"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-select v-model="listQuery.stock" placeholder="请选择库存" style="width: 80%" class="filter-item">
            <el-option label="有货" value=1></el-option>
            <el-option label="无货" value=0></el-option>
          </el-select>
          <el-button style="width: 15%; margin-left:10px" @click="listQuery.stock = ''">重置</el-button>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="listQuery.note" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="购买人" prop="realName">
          <el-input v-model="listQuery.realName" placeholder="请输入购买人"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="queryFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleFilter">确 定</el-button>
      </div>
    </el-dialog>
  

    <el-table :key="tableKey" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%" @sort-change="sortChange" @selection-change="handleSelectionChange">
      <el-table-column type="selection" align="center" v-if="isAdmin"></el-table-column>
      <el-table-column label="试剂名" prop="name" width="120" sortable align="center" :class-name="getSortClass('name')">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图片" prop="image" width="200" align="center">
        <template slot-scope="{row}">
          <template v-if="row.image">
            <img :src="row.image" style="width: 150px; height: auto; object-fit: contain;">
          </template>
          <template v-if="row.cas === null">

          </template>
          <template v-else>
            <img :src="'https://www.chemicalbook.com/CAS/GIF/' + row.cas + '.gif'" style="width: 100px; height: auto; object-fit: contain; border-radius: 5px;">
          </template>
        </template>
      </el-table-column>
      <el-table-column label="别名" prop="nickName" width="120" sortable align="center" :class-name="getSortClass('nickName')">
        <template slot-scope="{row}">
          <span>{{ row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="厂家 & 品牌" prop="producer" width="150" sortable align="center" :class-name="getSortClass('producer')">
        <template slot-scope="{row}">
          <span>{{ row.producer }}</span>
        </template>
      </el-table-column>
      <el-table-column label="位置" prop="lab" width="150" sortable align="center" :class-name="getSortClass('lab')">
        <template slot-scope="{row}">
          <span v-if="row.layer">{{ row.lab }}{{ row.location }}第{{ row.layer }}层/号</span>
          <span v-else>{{ row.lab }}{{ row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column label="规格" prop="specification" sortable="custom" width="120" align="center" :class-name="getSortClass('specification')">
        <template slot-scope="{row}">
          <span>{{ row.specification }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" prop="stock" width="60" align="center" sortable="custom" :class-name="getSortClass('stock')">
        <template slot-scope="{row}">
          <span v-if="row.stock === 1">有货</span>
          <span v-else>无货</span>
        </template>
      </el-table-column>
      <el-table-column label="化学式" prop="formula" width="120" align="center" sortable="custom" :class-name="getSortClass('formula')">
        <template slot-scope="{row}">
          <span v-html="formatFormula(row.formula)"></span>
        </template>
      </el-table-column>
      <el-table-column label="CAS" prop="cas" width="120" align="center" sortable="custom" :class-name="getSortClass('cas')">
        <template slot-scope="{row}">
          <a :href="chemsrcUrl(row.cas)" target="_blank" style="color: royalblue">{{ row.cas }}</a>
        </template>
      </el-table-column>
    <el-table-column label="购买渠道" prop="url" width="180" align="center" :class-name="getSortClass('url')">
      <template slot-scope="{row}">
          <a v-if="row.url.startsWith('http')" :href="row.url" target="_blank" style="color: royalblue">{{ row.url }}</a>
          <span v-else>{{ row.url }}</span>
      </template>
    </el-table-column>
    <el-table-column label="备注" prop="note" width="200" align="center">
      <template slot-scope="{row}">
        <span>{{ row.note }}</span>
      </template>
    </el-table-column>
    <el-table-column label="操作" align="center" width="400px" class-name="small-padding fixed-width">
      <template slot-scope="{row,$index}">
        <el-button type="primary" size="mini" @click="purchaseVisible = true; purchaseTemp = row">
          购买申请
        </el-button>
        <el-button type="info" size="mini" @click="handleRecord(row)">
          购买记录
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

    <el-dialog title="购买记录" :visible.sync="recordVisible">
      <el-table :data="recordList" border fit highlight-current-row >
        <el-table-column label="购买数量" prop="quantity" align="center">
          <template slot-scope="{row}">
            <span>{{ row.purchaseRecord.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="批准日期" prop="date" align="center">
          <template slot-scope="{row}">
            <span>{{ row.purchaseRecord.approveDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="购买人" prop="buyer" align="center">
          <template slot-scope="{row}">
            <span>{{ row.buyerName }}</span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="total>0" :total="recordTotal" :page.sync="recordQuery.page" :limit.sync="recordQuery.limit" @pagination="getList" style="width: 100%" />
    </el-dialog>

    <el-dialog title="购买申请" :visible.sync="purchaseVisible">
      <el-form ref="dataForm" :model="purchaseTemp" label-position="left" label-width="180px" style="width: 400px; margin-left: 50px;">
        <el-form-item label="当前试剂信息" prop="name">
          {{purchaseTemp.producer}}生产的{{ purchaseTemp.specification }}规格的{{ purchaseTemp.name }}
        </el-form-item>
        <!-- <el-form-item label="请选择购买渠道" prop="name">
          <el-select v-model="purchaseTemp.source" placeholder="请选择购买渠道" style="width: 100%" class="filter-item">
            <el-option v-for="item in tagList.sourceTags" :key="item" :label="item" :value="item"/>
          </el-select>
        </el-form-item> -->
        <el-form-item label="购买数量" prop="name">
          <el-input v-model="purchaseTemp.quantity" placeholder="请输入购买数量"></el-input>
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
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="margin-left: 30px; margin-right: 30px;">
        <el-form-item label="试剂名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入试剂名"></el-input>
        </el-form-item>
        <el-form-item label="别名" prop="nickName">
          <el-input v-model="temp.nickName" placeholder="请输入别名"></el-input>
        </el-form-item>
        <el-form-item label="厂家 & 品牌" prop="producer">
          <el-autocomplete
            style="width: 100%"
            class="inline-input"
            v-model="temp.producer"
            :fetch-suggestions="querySearch"
            placeholder="请输入厂家并选择"
            :trigger-on-focus="false"
            @select="handleAddSelect"
            @change="handleAddChange"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item label="位置" prop="location">
          <el-select v-model="temp.lab" placeholder="选择实验室" style="width: 35%" class="filter-item">
            <el-option v-for="item in tagList.labTags" :key="item" :label="item" :value="item"/>
          </el-select>
          <el-select v-model="temp.location" placeholder="选择存储位置" style="width: 35%" class="filter-item">
            <el-option v-for="item in tagList.locationTags" :key="item" :label="item" :value="item"/>
          </el-select>
          <span style="width: 30%;">
            第<el-input v-model="temp.layer" style="width: 50px"></el-input>层/号
          </span>
        </el-form-item>
        <el-form-item label="规格" prop="specification">
          <el-input v-model="temp.specification" placeholder="请输入规格"></el-input>
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-select v-model="temp.stock" placeholder="请选择库存" style="width: 100%" class="filter-item">
            <el-option v-for="item in [{label : '有货', value : 1},{label : '无货', value : 0}]" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="化学式" prop="formula">
          <el-input v-model="temp.formula" placeholder="请输入化学式"></el-input>
        </el-form-item>
        <el-form-item label="CAS" prop="cas">
          <el-input v-model="temp.cas" placeholder="请输入CAS"></el-input>
        </el-form-item>
        <el-form-item label="购买渠道" prop="url">
          <el-input v-model="temp.url" placeholder="请输入购买渠道"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note">
          <el-input v-model="temp.note" placeholder="请输入备注"></el-input>
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            list-type="picture-card"
            :data="{ id: temp.id }"
            :limit="1"
            :on-preview="handlePictureCardPreview"
            :on-remove="handleRemove"
            :before-upload="beforeImageUpload">
            <i class="el-icon-plus"></i>
          </el-upload>
          <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
          </el-dialog>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleStatusConfirm(dialogStatus)">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index'
import { getRole } from '@/api/user'
import { postPurchaseRequest } from '@/api/request/buy'
import { fetchList, updateDrug, createDrug, deleteDrug, getRecord, getAll, multipleUpdateDrug } from '@/api/drug'
import { getDictionary } from '@/api/dictionary'
import XLSX from 'xlsx';

class AsyncQueue {
  constructor(maxConcurent = 1){
    this.maxConcurent = maxConcurent
    this.tasks = []
    this.currentlyRunning = 0
  }

  push(promiseFactory) {
    this.tasks.push(promiseFactory)
    this.next()
  }

  next(){
    if(this.currentlyRunning >= this.maxConcurent){
      return
    }

    this.currentlyRunning++
    const promiseFactory = this.tasks.shift()
    promiseFactory().finally(() => {
      this.currentlyRunning--
      this.next()
    })
  }
}

export default{
  name:'drugTable',
  components:{ Pagination },
  mounted(){
    // 接受来自跳转的参数
    this.listQuery.id = this.$route.query.id
    console.log(this.listQuery.id)
    this.getList()
  },
  filters:{
    typeFilter(type){
      return typeKeyValue[type]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      allList: null,
      total: 0,
      recordTotal: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        sort:'+name',
        name: undefined,
        id: undefined,  
        producer: undefined,
        specification: undefined,
        nickName: undefined,
        formula: undefined,
        cas: undefined,
        lab: undefined,
        location: undefined,
        layer: undefined,
        url: undefined,
        stock: undefined,
        note: undefined,
        realName: undefined,
      },
      purchaseVisible: false,
      sortOptions:[
        {label:'编号升序',key:'+id'},
        {label:'编号降序',key:'-id'},
        {label:'库存升序',key:'+stock'},
        {label:'库存降序',key:'-stock'},
        {label:'别名升序',key:'+nickName'},
        {label:'别名降序',key:'-nickName'},
      ],
      temp: {
        id: undefined,
        name: '',
        producer: '',
        specification: '',
        nickName: '',
        formula: '',
        cas: '',
        lab: '',
        location: '',
        layer: '',
        url: '',
        stock: undefined,
      },
      purchaseTemp: {
        drug_id: undefined,
        source: '',
        quantity: undefined,
      },
      dialogFormVisible: false,
      queryFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑试剂',
        create: '添加试剂',
        multipleUpdate: '批量编辑试剂'
      },
      rules:{ 
        name:[
          {required: true, message: '请输入试剂名', trigger: 'blur'}
        ],
        producer:[
          {required: true, message: '请输入厂家 & 品牌', trigger: 'blur'}
        ],
        location:[
          {required: true, message: '请输入位置', trigger: 'blur'}
        ],
      },
      downloadLoading: false,
      tagList:{
        producerTags: [],
        labTags: [],
        locationTags: [],
        sourceTags: [],
        wasteTags: [],
      },
      producerSuggestions: [],
      purchaseVisible: false,
      recordVisible: false,
      recordList: null,
      recordQuery:{
        page: 1,
        limit: 10,
        sort:'+id',
        id: undefined,
      },
      currentName: '',
      isAdmin: false,
      lastSelectedAddValue: '',
      lastSelectedQueryValue: '',
      multipleSelection: [],
      multiTemp: {
        ids: undefined,
        name: '',
        producer: '',
        specification: '',
        nickName: '',
        formula: '',
        cas: '',
        lab: '',
        location: '',
        layer: '',
        url: '',
        stock: '',
        note: '',
      },
    }
  },
  created() {
    this.getList()
    this.initTags()
    this.getRole()
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
    getRole(){
      getRole().then(response => {
        this.isAdmin = response.data === 'admin'
      })
    },
    handleFilter(){
      this.listQuery.page = 1
      this.getList()
      // reset temp
      this.queryFormVisible = false
    },
    sortChange(data){
      const { prop,order } = data
      if(prop === 'name'){
        this.sortByName(order)
      }if(prop === 'producer'){
        this.sortByProducer(order)
      }if(prop === 'lab'){
        this.sortByLab(order)
      }if(prop === 'id'){
        this.sortByID(order)
      }if(prop === 'stock'){
        this.sortByStock(order)
      }if(prop === 'nickName'){
        this.sortByNickName(order)
      }if(prop === 'specification'){
        this.sortBySpecification(order)
      }if(prop === 'formula'){
        this.sortByFormula(order)
      }if(prop === 'cas'){
        this.sortByCas(order)
      }
    },
    sortByLab(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+lab'
      }else{
        this.listQuery.sort = '-lab'
      }
      this.getList()
    },
    sortByName(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+name'
      }else{
        this.listQuery.sort = '-name'
      }
      this.getList()
    },
    sortByProducer(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+producer'
      }else{
        this.listQuery.sort = '-producer'
      }
      this.getList()
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
    sortByNickName(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+nickName'
      }else{
        this.listQuery.sort = '-nickName'
      }
      this.getList()
    },
    sortBySpecification(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+specification'
      }else{
        this.listQuery.sort = '-specification'
      }
      this.getList()
    },
    sortByFormula(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+formula'
      }else{
        this.listQuery.sort = '-formula'
      }
      this.getList()
    },
    sortByCas(order){
      if(order === 'ascending'){
        this.listQuery.sort = '+cas'
      }else{
        this.listQuery.sort = '-cas'
      }
      this.getList()
    },
    resetTemp(){
      this.temp = {
        id: undefined,
        name: '',
        producer: '',
        specification: '',
        nickName: '',
        formula: '',
        cas: '',
        lab: '',
        location: '',
        layer: '',
        url: '',
        stock: '',
        note: '',
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
            this.resetTemp()
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
              this.resetTemp()
              this.getList()
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
    getAllDataUnderCurrentQuery(){
      return getAll(this.listQuery).then(response => {
        this.allList = response.data
      })
    },
    handleDownload(){
      this.downloadLoading = true
      this.getAllDataUnderCurrentQuery().then(() => {
        import('@/vendor/Export2Excel').then(excel =>{

          const tHeader = ['试剂ID','试剂名','别名','厂家 & 品牌','实验室','位置','层数','规格','库存','化学式','CAS','购买渠道','备注']
          const filterVal = ['id','name','nickName','producer','lab','location','layer','specification','stock','formula','cas','url','note']
          const resultList = this.formatJson(filterVal, this.allList)
          excel.export_json_to_excel({
            header: tHeader,
            data: resultList,
            filename: '药物列表'
          })
          this.downloadLoading = false
        })
      })
    },
    formatJson(filterVal){  
      return this.allList.map(v => filterVal.map(j => {
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
    },
    initTags(){
      getDictionary().then(response => {
        this.tagList.producerTags = response.data.producerTags
        this.tagList.labTags = response.data.labTags
        this.tagList.locationTags = response.data.locationTags
        this.tagList.sourceTags = response.data.sourceTags
        this.tagList.wasteTags = response.data.wasteTags
      })
    },
    formatFormula(formula) {
      return formula.replace(/(\d+)/g, '<sub>$1</sub>');
    },
    handleRecord(row){
      this.recordVisible = true
      this.recordQuery.id = row.id
      this.currentName = row.name
      getRecord(this.recordQuery).then(response => {
        this.recordList = response.data
        this.recordTotal = response.total
      })
    },
    resetRecord(){
      this.recordList = null
      this.currentName = ''
      this.recordQuery = {
        page: 1,
        limit: 10,
        sort:'+id',
        id: undefined,
      }
    },
    handleUpload(){
      this.handleImport()
    },
    handleImport() {
      const input = document.createElement('input');
      input.type = 'file';
      input.onchange = e => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = e => {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          for(let i = 0; i < jsonData.length; i++){
            createDrug(jsonData[i]).then(() => {
              this.getList()
            })
          }
        };
        reader.readAsArrayBuffer(file);
      };
      input.click();
    },
    getUploadTemplate(){
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel =>{
        const tHeader = ['name','nickName','producer','lab','location','layer','specification','stock','formula','cas','url','note']
        const filterVal = []
        const list = []
        list.push(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data: list,
          filename: '药物模板'
        })
        this.downloadLoading = false
      })
    },
    chemsrcUrl(cas){
       return `https://www.chemicalbook.com/Search.aspx?keyword=${cas}`
    },
    querySearch(queryString, cb){
      if(queryString){
        this.producerSuggestions = this.tagList.producerTags.map(item => {
          return {value: item}
        })
        const results = queryString ? this.createFilter(queryString) : this.producerSuggestions
        cb(results)
      }else{
        cb(this.producerSuggestions)
      }
    },
    createFilter(queryString) {
      return this.producerSuggestions.filter(item => {
        return item.value.toLowerCase().indexOf(queryString.toLowerCase()) > -1;
      });
    },
    handleAddSelect(item){
      this.temp.producer = item.value
      this.lastSelectedValue = item.value
    },
    handleAddChange(value){
      // 强制用户选择建议中的值
      if(!this.producerSuggestions.some(item => item.value === value)){
        this.$message({
          type: 'error',
          message: '请选择建议中的值'
        })
        this.temp.producer = this.lastSelectedValue
      }
    },
    handleQuerySelect(item){
      this.listQuery.producer = item.value
      this.lastSelectedQueryValue = item.value
    },
    handleQueryChange(value){
      // 强制用户选择建议中的值
      if(!this.producerSuggestions.some(item => item.value === value)){
        this.$message({
          type: 'warning',
          message: '请选择建议中的值'
        })
        this.listQuery.producer = this.lastSelectedQueryValue
      }
    },
    handleSelectionChange(val){
      this.multipleSelection = val
    },
    handleMutipleDelete(){
      this.$confirm('此操作将永久删除这些试剂, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() =>{
        for(let i = 0; i < this.multipleSelection.length; i++){
          deleteDrug(this.multipleSelection[i].id)
        }
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
        this.getList()
      })
    },
    handleMutipleUpdate(){
      this.resetTemp()
      this.dialogStatus = 'multipleUpdate'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    multipleUpdateData(){
      this.$refs['dataForm'].validate((valid) => {
        if(valid){
          let idArr = []
          for(let i = 0; i < this.multipleSelection.length; i++){
            idArr.push(this.multipleSelection[i].id)
          }
          const tempData = Object.assign({},this.temp)
          tempData.ids = idArr
          multipleUpdateDrug(tempData).then(() => {
            this.getList()
            this.dialogFormVisible = false
            this.resetTemp()
          })
        }
      })
    },
    handleStatusConfirm(status){
      if(status === 'create'){
        this.createData()
      }else if(status === 'update'){
        this.updateData()
      }else if(status === 'multipleUpdate'){
        this.multipleUpdateData()
      }
    }
  },
  handlePictureCardPreview(file){
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  },
  handleRemove(file, fileList){
    this.fileList = fileList
  },
  beforeImageUpload(file){
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isGIF = file.type === 'image/gif'
    const isLt2M = file.size / 1024 / 1024 < 2

    if(!isJPG && !isPNG && !isGIF){
      this.$message.error('上传图片只能是 JPG/PNG/GIF 格式!')
    }
    if(!isLt2M){
      this.$message.error('上传图片大小不能超过 2MB!')
    }
    return (isJPG || isPNG || isGIF) && isLt2M
  }
}

</script>

<style lang="scss" scoped>
.filter-container{
  margin-top: 15px;
  margin-bottom: 15px;
  margin-left: 15px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
