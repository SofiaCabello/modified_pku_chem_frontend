<template>
<!-- 我的申请，包括危废申报表和购买申请表 -->
  <div class="request-container">
    <div class="buy-request">
      <h1>购买申请</h1>
      <el-table :key="buyTableKey" v-loading="buyListLoading" :data="buyList" boder fit highlight-current-row style="width: 100%" @sort-change="buySortChange">
        <el-table-column label="项目名称" prop="name" sortable align="center"  :class-name="getBuySortClass('name')">
          <template slot-scope="{row}">
            <span>{{ row.requestDate }} 申请购买的 {{ row.drug.producer }} 制造的 {{ row.drug.specification }} 的 {{  row.drug.name }}，数量 {{ row.quantity }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="requestDate" sortable align="center"  :class-name="getBuySortClass('requestDate')">
          <template slot-scope="{row}">
            <span>{{ row.requestDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="status" sortable align="center"  :class-name="getBuySortClass('status')">
          <template slot-scope="{row}">
            <span v-if="row.status === 'pending'" style="color: #FFA500">待处理</span>
            <span v-else-if="row.status === 'approved'" style="color: #32CD32">
              已批准<el-button type="primary" size="mini" style="margin-left: 5px;" @click="handleBuyRead(row)">标记为已读</el-button>
            </span>
            <span v-else-if="row.status === 'rejected'" style="color: #FF0000">
              被驳回<el-button type="primary" size="mini" style="margin-left: 5px;" @click="handleBuyRead(row)">标记为已读</el-button>
            </span>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="buyTotal>0" :total="buyTotal" :page.sync="buyQuery.page" :limit.sync="buyQuery.limit" @pagination="getBuyList" />
    </div>

    <div class="hazard-request">
      <div class="hazard-title">
        <h1>危废申报</h1>
        <el-button type="primary" size="small" @click="createRequest">新建申请</el-button>
      </div>
      <el-table :key="hazardTableKey" v-loading="hazardListLoading" :data="hazardList" boder fit highlight-current-row style="width: 100%" @sort-change="hazardSortChange">
      <el-table-column label="项目名称" prop="name" sortable align="center"  :class-name="getHazardSortClass('name')">
        <template slot-scope="{row}">
            <span>位于 {{ row.location }} 的 {{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="requestDate" sortable align="center"  :class-name="getHazardSortClass('requestDate')">
        <template slot-scope="{row}">
          <span>{{ row.requestDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" sortable align="center"  :class-name="getHazardSortClass('status')">
        <template slot-scope="{row}">
          <span v-if="row.status === 'pending'" style="color: #FFA500">待处理</span>
          <span v-else-if="row.status === 'approved'" style="color: #32CD32">
            已批准<el-button type="primary" size="mini" style="margin-left: 5px;" @click="handleHazardRead(row)">标记为已读</el-button>
          </span>
          <span v-else-if="row.status === 'rejected'" style="color: #FF0000">
            被驳回<el-button type="primary" size="mini" style="margin-left: 5px;" @click="handleHazardRead(row)">标记为已读</el-button>
          </span>
        </template>
      </el-table-column>  
    </el-table>
      <pagination v-show="hazardTotal>0" :total="hazardTotal" :page.sync="hazardQuery.page" :limit.sync="hazardQuery.limit" @pagination="getHazardList" />
      
      <el-dialog title="新建申请" :visible.sync="createRequestVisible" width="50%" :close-on-click-modal="false">
        <el-form ref="queryForm" :model="temp" label-position="left" label-width="90px" style="margin-left: 30px; margin-right: 30px;">
          <el-form-item label="垃圾类型" prop="type">
            <el-select v-model="temp.type" placeholder="请选择垃圾类型" style="width: 80%" class="filter-item">
              <el-option v-for="item in wasteOptions" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="垃圾位置" prop="location">
            <el-select v-model="temp.location" placeholder="请选择实验室" style="width: 80%" class="filter-item">
              <el-option v-for="item in labOptions" :key="item" :label="item" :value="item"/>
            </el-select>
          </el-form-item>
          <el-form-item label="当前日期" prop="date">
            <!-- 显示当前日期 -->
            {{ new Date().toLocaleDateString() }}
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="createRequestVisible = false">取 消</el-button>
          <el-button type="primary" @click="handleCreate">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>

</template>

<script>
import { getListBuy, setBuyRead } from '@/api/request/buy.js'
import { getListHazard, createHazardRequest, setHazardRead } from '@/api/request/hazard.js'
import { mapGetters } from 'vuex'
import { getWasteDictionary, getLocationDictionary, getLabDictionary } from '@/api/dictionary.js'
import Pagination from '@/components/Pagination/index.vue'

export default {
  name: 'request',
  components: {
    Pagination,
  },
  computed: {
    ...mapGetters([
      'token'
    ])
  },
  data(){
    return{
      buyTableKey: 0,
      buyList: null,
      buyListLoading: true,
      buyTotal: 0,
      buyQuery:{
        page: 1,
        limit: 20,
        sort: '-id',
      },
      buyReadQuery: {
        requestId: 0,
      },
      hazardTableKey: 0,
      hazardList: null,
      hazardListLoading: true,
      hazardTotal: 0,
      hazardQuery:{
        page: 1,
        limit: 20,
        sort: '-id',
      },
      hazardReadQuery: {
        requestId: 0,
      },
      createRequestVisible: false,
      tempString: '',
      layer: '',
      temp: {
        type: '',
        location: '',
      },
      userToken: this.$store.getters.token,
      wasteOptions:[],
      locationOptions:[],
      labOptions:[],
    }
  },
  created(){
    this.getBuyList()
    this.getHazardList()
    this.getWasteList()
    this.getLocationList()
    this.getLabList()
  },
  methods: {
    getBuyList(){
      this.buyListLoading = true
      getListBuy(this.buyQuery, this.$store.token).then(response => {
        this.buyList = response.data
        this.buyListLoading = false
        this.buyTotal = response.total
      })
    },
    getHazardList(){
      this.hazardListLoading = true
      getListHazard(this.hazardQuery,this.$store.token).then(response => {
        this.hazardList = response.data
        this.hazardListLoading = false
        this.hazardTotal = response.total
      })
    },
    getWasteList(){
      getWasteDictionary().then(response => {
        this.wasteOptions = response.data
      })
    },
    getLocationList(){
      getLocationDictionary().then(response => {
        this.locationOptions = response.data
      })
    },  
    getLabList(){
      getLabDictionary().then(response => {
        this.labOptions = response.data
      })
    },
    buySortChange(data){
      console.log(data)
    },
    getBuySortClass: function(key){
      const sort = this.buyQuery.sort
      return sort === key ? 'ascending' : sort === '-' + key ? 'descending' : ''
    },
    hazardSortChange(data){
      console.log(data)
    },
    getHazardSortClass: function(key){
      const sort = this.hazardQuery.sort
      return sort === key ? 'ascending' : sort === '-' + key ? 'descending' : ''
    },
    
    createRequest(){
      this.createRequestVisible = true
    },
    handleCreate(){
      createHazardRequest(this.temp,this.userToken).then(response => {
        this.createRequestVisible = false
        this.getHazardList()
        this.resetTemp()
      })
    },
    handleBuyRead(row){
      this.buyReadQuery.requestId = row.id
      setBuyRead(this.buyReadQuery, this.$store.token).then(response => {
        this.getBuyList()
      })
    },
    handleHazardRead(row){
      this.hazardReadQuery.requestId = row.id
      setHazardRead(this.hazardReadQuery, this.$store.token).then(response => {
        this.getHazardList()
      })
    },
    resetTemp(){
      this.temp = {
        type: '',
        location: '',
      }
      this.tempString = ''
      this.layer = ''
    }
  },
}
</script>

<style lang="scss" scoped>
.request-container{
  .buy-request{
    margin-left: 15px;
    h1{
      font-size: 20px;
      font-weight: 700;
      color: #333333;
      margin-bottom: 20px;
    }
  }
  .hazard-request{
    margin-left: 15px;
    .hazard-title{
      display: flex;
      align-items: center;
      h1{
        margin-right: 15px ;  
        font-size: 20px;
        font-weight: 700;
        color: #333333;
        margin-bottom: 20px;
      }
    }
  }
}
</style>