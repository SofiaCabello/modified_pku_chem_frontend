<template>
<!-- 我的申请，包括危废申报表和购买申请表 -->
  <div class="request-container">
    <div class="buy-request">
      <h1>购买申请</h1>
      <el-table :key="buyTableKey" v-loading="buyListLoading" :data="buyList" boder fit highlight-current-row style="width: 100%" @sort-change="buySortChange">
        <el-table-column label="申请ID" prop="id" sortable align="center" width="120" :class-name="getBuySortClass('id')">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="name" sortable align="center" width="120" :class-name="getBuySortClass('name')">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="requestDate" sortable align="center" width="120" :class-name="getBuySortClass('requestDate')">
          <template slot-scope="{row}">
            <span>{{ row.requestDate }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="hazard-request">
      <h1>危废申报</h1>
      <el-table :key="hazardTableKey" v-loading="hazardListLoading" :data="hazardList" boder fit highlight-current-row style="width: 100%" @sort-change="hazardSortChange">
      <el-table-column label="申请ID" prop="id" sortable align="center" width="120" :class-name="getHazardSortClass('id')">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="name" sortable align="center" width="120" :class-name="getHazardSortClass('name')">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="申请时间" prop="requestDate" sortable align="center" width="120" :class-name="getHazardSortClass('requestDate')">
        <template slot-scope="{row}">
          <span>{{ row.requestDate }}</span>
        </template>
      </el-table-column>
      </el-table>
    </div>
  </div>

</template>

<script>
import { getListBuy } from '@/api/request/buy.js'
import { getListHazard } from '@/api/request/hazard.js'
import { mapGetters } from 'vuex'
import Pagination from '@/components/Pagination'

export default {
  name: 'request',
  components: {
    Pagination
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
      buyQuery:{
        page: 1,
        limit: 20,
        sort: '-id',
        token: this.$store.getters.token
      },
      

      hazardTableKey: 0,
      hazardList: null,
      hazardListLoading: true,
      hazardQuery:{
        page: 1,
        limit: 20,
        sort: '-id',
        token: this.$store.getters.token  
      },


    }
  },
  created(){
    this.getBuyList()
    this.getHazardList()
  },
  methods: {
    getBuyList(){
      this.buyListLoading = true
      getListBuy(this.buyQuery).then(response => {
        this.buyList = response.data.items
        this.buyListLoading = false
      })
    },
    getHazardList(){
      this.hazardListLoading = true
      getListHazard(this.hazardQuery).then(response => {
        this.hazardList = response.data.items
        this.hazardListLoading = false
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
    h1{
      font-size: 20px;
      font-weight: 700;
      color: #333333;
      margin-bottom: 20px;
    }
  }
}
</style>