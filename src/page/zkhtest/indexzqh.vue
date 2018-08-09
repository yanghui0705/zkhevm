<template>
  <div class="sys-page">
    <app-title title="测试"></app-title>
    <!-- 搜索 -->{{tableData.condition}}
    <div class="sys-search">
      <el-form :inline="true">
        <el-form-item v-for="(item,index) in tableData.condition" :key="index" v-if="item.conditionType === 'text'">
          <el-input v-model="item.value" :placeholder="item.name" size="small"></el-input>
        </el-form-item>
        <el-form-item v-for="(item,index) in tableData.condition" :key="index" v-if="item.conditionType === 'date'">
          <el-date-picker v-model="item.value" type="date" size="small" value-format="yyyy-MM-dd" :placeholder="item.name">
          </el-date-picker>
        </el-form-item>
        <el-form-item v-for="(item,index) in tableData.condition" :key="index" v-if="item.conditionType === 'select'">
          <el-select v-model="item.value" clearable :placeholder="item.name" size="small">
            <el-option
              v-for="i in item.option"
              :key="i.value"
              :label="i.label"
              :value="i.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="search">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="sys-toolbar left">
      <el-button type="primary" size="small">新增</el-button>
      <el-button type="primary" size="small">修改</el-button>
    </div>
    <!-- 表格体 -->
    <table-mixin :pageSize="pageSize" :pageNum="pageNum" :total="total"
                 :handleSizeChange="handleSizeChange" :handleCurrentChange="handleCurrentChange">
      <el-table v-loading="tableData.loading" :data="tableData.body" border stripe
                :header-row-class-name="tableHeaderClassName" @sort-change="handleSortChange"
                size="small">
        <el-table-column type="selection" width="55" align="center"></el-table-column>
        <el-table-column v-for="(item,index) in tableData.head" :prop="item.key" :label="item.name" sortable="custom"
                         align="center" :formatter="formatter"
                         :key="index" show-overflow-tooltip></el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small">查看详情</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-mixin>
  </div>
</template>

<script>
import {tableDataMixin} from '../../common/js/mixin'

export default {
  name: 'themeChange',
  mixins: [tableDataMixin],
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      sortName: '',
      sortValue: '',
      tableData: {
        loading: true,
        head: [],
        body: [],
        option: [],
        condition: []
      }
    }
  },
  mounted() {
    this.getTableCfg()
    this.getTableData()
  },
  computed: {
    getTableCfgParam() {
      return {
        'param': {
          'serviceId': 'vendingFactory',
          'timestamp': ''
        }
      }
    },
    getTableDataParam() {
      let c = this.tableData.condition.map(item => {
        return {name: item.key, value: item.value ? item.value : ''}
      })
      console.log(c)

      return {
        'param': {
          'condition': '',
          'orderName': this.sortName,
          'orderType': this.sortValue,
          'pageInfo': {
            'pageNum': this.pageNum,
            'pageSize': this.pageSize
          },
          'serviceId': 'vendingFactory',
          'timestamp': '',
          'sign': ''
        }
      }
    }
  },
  methods: {
    getTableCfg() {
      this.$axios({
        url: 'baseController/queryServiceInfoByName',
        method: 'post',
        baseURL: '/proxy',
        headers: {
          'Content-Type': 'application/json'
        },
        data: this.getTableCfgParam
      }).then(res => {
        this.tableData.loading = false
        this.dealHead(res)
        this.dealCondition(res)
        this.dealOption(res)
      }).catch(err => {
        this.$message.error(`获取数据失败，失败码：${err.response.status}`)
      })
    },
    dealHead(res) {
      let data = res.obj.columns
      let head = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].isShow) {
          let obj = {
            key: data[i].fieldName,
            name: data[i].fieldDesc
          }
          head.push(obj)
        }
      }
      this.tableData.head = head
    },
    dealCondition(res) {
      let data = res.obj.columns
      let head = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].isCondition) {
          let obj = {
            key: data[i].fieldName,
            name: data[i].fieldDesc,
            conditionType: data[i].conditionType
          }

          if (data[i].dicList) {
            let option = data[i].dicList.map(item => {
              return {label: item.value, value: item.key}
            })
            obj.option = option
          }

          head.push(obj)
        }
      }
      this.tableData.condition = head
    },
    dealOption(res) {
      let data = res.obj.columns
      let head = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].isDic) {
          let obj = {
            key: data[i].fieldName
          }

          if (data[i].dicList) {
            let option = data[i].dicList.map(item => {
              return {label: item.value, value: item.key}
            })
            obj.option = option
          }

          head.push(obj)
        }
      }
      this.tableData.option = head
    },
    getTableData() {
      this.$axios({
        url: 'baseController/queryBaseDataByParam',
        method: 'post',
        baseURL: '/proxy',
        headers: {
          'Content-Type': 'application/json'
        },
        data: this.getTableDataParam
      }).then(res => {
        this.dealTableResponse(res)
      }).catch(err => {
        this.$message.error(`获取数据失败，失败码：${err.response.status}`)
      })
    },
    formatter(row, column, cellValue, index) {
      let formatValue = cellValue
      let condition = this.tableData.option
      for (let a = 0; a < condition.length; a++) {
        if (column.property === condition[a].key && condition[a].option) {
          let option = condition[a].option
          for (let i = 0; i < option.length; i++) {
            if (option[i].value === cellValue) {
              formatValue = option[i].label
              break
            }
          }
          break
        }
      }
      return formatValue
    }
  }
}
</script>

<style lang="scss" scoped>
  .layout-list {
    &:after {
      clear: both;
      overflow: hidden;
    }
    ul {
      padding: 5px;
      overflow: hidden;
    }
    ul li {
      float: left;
      background: #fff;
      margin-right: 20px;
      padding: 10px;
      box-shadow: 0 0 3px #ccc;
      &:hover, &.cur:hover {
        box-shadow: 0 0 10px #ccc;
      }
      &.cur {
        border: 1px solid #ccc;
        box-shadow: none;
      }
      img {
        width: 140px;
      }
      p {
        height: 40px;
        line-height: 40px;
        text-align: center;
        font-size: 14px;
      }
    }
  ;;
  }
</style>
