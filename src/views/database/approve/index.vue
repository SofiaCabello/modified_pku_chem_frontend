<template>
  <div class="approve-container">
    <div class="buy-request">
      <div class="buy-title">
        <h1>购买申请</h1>
        <el-button type="primary" size="small" @click="showRecentRecord">查看最近记录</el-button>
      </div>
      <el-table :key="buyTableKey" v-loading="buyListLoading" :data="buyList" boder fit highlight-current-row style="width: 100%" @sort-change="buySortChange">
        <el-table-column label="申请ID" prop="id" sortable align="center"  :class-name="getBuySortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请人" prop="realName" sortable align="center"  :class-name="getHazardSortClass('requester')">
          <template slot-scope="{row}">
            <span>{{ row.user.realName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="name" sortable align="center"  :class-name="getBuySortClass('name')">
          <template slot-scope="{row}">
            <span>{{ row.drug.producer }} 制造的 {{ row.drug.specification }} 的 {{  row.drug.name }}，数量 {{ row.quantity }} </span>
          </template>
        </el-table-column>
        <el-table-column label="网址" prop="url" align="center">
          <template slot-scope="{row}">
            <a :href="row.drug.url" target="_blank" style="color:royalblue;">{{ row.drug.url }}</a>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="requestDate" sortable align="center"  :class-name="getBuySortClass('requestDate')">
          <template slot-scope="{row}">
            <span>{{ row.requestDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="approveBuy(row.id)">审批</el-button>
            <el-button type="danger" size="small" @click="rejectBuy(row.id)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="buyTotal>0" :total="buyTotal" :page.sync="buyQuery.page" :limit.sync="buyQuery.limit" @pagination="getBuyList" />
      
      <el-dialog title="最近记录" :visible.sync="recentRecordVisible" width="fit-content" center>
        <el-timeline align="alternate">
          <el-timeline-item v-for="item in recentRecordList" :key="item.id" :timestamp="item.approveDate" placement="top">
            {{ item.processorName }}批准了{{ item.buyerName }}的{{ item.drugName }}的购买申请，数量{{ item.quantity }}
          </el-timeline-item>
        </el-timeline>
      </el-dialog>
    </div>

    <div class="hazard-request">
      <div class="hazard-title">
        <h1>危废申报</h1>
        <el-button type="primary" size="small" @click="showRecentHazard">查看最近记录</el-button>
      </div>
      <el-table :key="hazardTableKey" v-loading="hazardListLoading" :data="hazardList" boder fit highlight-current-row style="width: 100%" @sort-change="hazardSortChange">
      <el-table-column label="申请ID" prop="id" sortable align="center"  :class-name="getHazardSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请人" prop="realName" sortable align="center"  :class-name="getHazardSortClass('requester')">
        <template slot-scope="{row}">
          <span>{{ row.user.realName }}</span>
        </template>
      </el-table-column>
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
      <el-table-column label="操作" align="center" width="200px">
          <template slot-scope="{row}">
            <el-button type="primary" size="small" @click="approveHazard(row.id)">审批</el-button>
            <el-button type="danger" size="small" @click="rejectHazard(row.id)">驳回</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination v-show="hazardTotal>0" :total="hazardTotal" :page.sync="hazardQuery.page" :limit.sync="hazardQuery.limit" @pagination="getHazardList" />

      <el-dialog title="最近记录" :visible.sync="recentHazardVisible" width="fit-content" center>
      <el-timeline align="alternate">
        <el-timeline-item v-for="item in recentHazardList" :key="item.id" :timestamp="item.approveDate" placement="top">
          {{ item.processorName }}批准了{{ item.requesterName }}位于{{ item.location }}的{{ item.type}}处理申请
        </el-timeline-item>
      </el-timeline>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
import { getAllBuy, approveBuyRequest, rejectBuyRequest, getRecentRecord} from '@/api/request/buy'
import { getAllHazard, approveHazardRequest, rejectHazardRequest, getRecentHazard} from '@/api/request/hazard'

export default {
  name: "approve",
  components: {
    Pagination
  },
  data() {
    return {
      buyList: [],
      buyListLoading: false,
      buyTotal: 0,
      buyQuery: {
        page: 1,
        limit: 10,
      },
      buyTableKey: 0,
      hazardList: [],
      hazardListLoading: false,
      hazardTotal: 0,
      hazardQuery: {
        page: 1,
        limit: 10,
      },
      hazardTableKey: 0,
      requestQuery: {
        requestId: '',
      },
      recentRecordVisible: false,
      recentRecordList: [],
      recentHazardVisible: false,
      recentHazardList: [],
    };
  },
  created() {
    this.getBuyList()
    this.getHazardList()
  },
  methods: {
    getBuyList() {
      getAllBuy(this.buyQuery).then(res => {
        this.buyList = res.data;
        this.buyTotal = res.total;
      })
    },
    buySortChange() {
    },
    getHazardList() {
      getAllHazard(this.hazardQuery).then(res => {
        this.hazardList = res.data;
        this.hazardTotal = res.total;
      })
    },
    hazardSortChange() {
    },
    getBuySortClass() {
    },
    getHazardSortClass() {
    },
    approveBuy(id) {
      this.requestQuery.requestId = id
      approveBuyRequest(this.requestQuery, this.$store.token).then(res => {
        this.getBuyList()
      })
    },
    rejectBuy(id) {
      this.requestQuery.requestId = id
      rejectBuyRequest(this.requestQuery, this.$store.token).then(res => {
        this.getBuyList()
      })
    },
    approveHazard(id) {
      this.requestQuery.requestId = id
      approveHazardRequest(this.requestQuery, this.$store.token).then(res => {
        this.getHazardList()
      })
    },
    rejectHazard(id) {
      this.requestQuery.requestId = id
      rejectHazardRequest(this.requestQuery, this.$store.token).then(res => {
        this.getHazardList()
      })
    },
    showRecentRecord() {
      this.recentRecordVisible = true
      getRecentRecord().then(res => {
        this.recentRecordList = res.data
      })
    },
    showRecentHazard() {
      this.recentHazardVisible = true
      getRecentHazard().then(res => {
        this.recentHazardList = res.data
      })
    }

  }
};
</script>

<style lang="scss">
.approve-container{
  .buy-request{
    margin-left: 15px;
    .buy-title{
      display: flex;
      align-items: center;
      h1{
        margin-right: 15px ;  
        font-size: 20px;
        font-weight: 700;
        color: #333333;
      }
    
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
