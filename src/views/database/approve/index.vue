<template>
  <div class="approve-container">
    <div class="buy-request">
      <h1>购买申请</h1>
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
    </div>

    <div class="hazard-request">
      <div class="hazard-title">
        <h1>危废申报</h1>
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
    </div>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination/index.vue'
import { getAllBuy, approveBuyRequest, rejectBuyRequest} from '@/api/request/buy'
import { getAllHazard, approveHazardRequest, rejectHazardRequest } from '@/api/request/hazard';

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
      }
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
    }
  }
};
</script>

<style lang="scss">
.approve-container{
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
