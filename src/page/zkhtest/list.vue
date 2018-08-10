<template>
  <div class="sys-page">
    <app-title title="测试"></app-title>
    <div class="sys-search">
      <el-form :model="searchForm" :inline="true" ref="searchForm">
        <el-form-item v-for="(item,index) in tableData.condition" :key="index" :prop="item.key">
          <el-input v-model="searchForm[item.key]" v-if="item.conditionType === 'text'" :placeholder="item.name" size="small"></el-input>
          <el-date-picker v-model="searchForm[item.key]" v-if="item.conditionType === 'date'" type="date" size="small"
                          value-format="yyyy-MM-dd" :placeholder="item.name">
          </el-date-picker>
          <el-date-picker v-model="searchForm[item.key]" v-if="item.conditionType === 'dateRange'" type="daterange" size="small"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                          value-format="yyyy-MM-dd" :placeholder="item.name">
          </el-date-picker>
          <el-select v-model="searchForm[item.key]" clearable :placeholder="item.name" size="small" v-if="item.conditionType === 'select'">
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
          <el-button size="small" @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="sys-toolbar left">
      <el-button type="primary" size="small" @click="toAddPage">新增</el-button>
    </div>
    <!-- 表格体 -->
    <table-mixin :pageSize="pageSize" :pageNum="pageNum" :total="total" :pageSizes="pageSizes"
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
            <el-button type="text" size="small" @click="deleteOpt(scope.row)">删除</el-button>
            <el-button type="text" size="small" @click="toEditPage(scope.row)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </table-mixin>
  </div>
</template>

<script>
import {tableDataMixin} from '../../common/js/mixin'
import {mapMutations} from 'vuex'

export default {
  name: 'zkhtestlist',
  mixins: [tableDataMixin],
  data() {
    return {
      serviceId: this.$route.params.id,
      searchForm: {
      },
      pageNum: 1,
      pageSize: 10,
      pageSizes: [],
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
          'serviceId': this.serviceId,
          'timestamp': ''
        }
      }
    },
    getTableDataParam() {
      let columns = []
      for (let key in this.searchForm) {
        columns.push({name: key, value: this.searchForm[key]})
      }

      return {
        'param': {
          'condition': columns,
          'orderName': this.sortName,
          'orderType': this.sortValue,
          'pageInfo': {
            'pageNum': this.pageNum,
            'pageSize': this.pageSize
          },
          'serviceId': this.serviceId,
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
        this.dealHead(res)
        this.dealCondition(res)
        this.dealOption(res)
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
      // 设置分页参数
      this.pageSizes = res.obj.pageInfo.pageNums.split(',')
      this.pageSize = res.obj.pageInfo.pageSize
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
      this.tableData.loading = true
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
    },
    toAddPage() {
      this.setEditData({})
      this.$router.push('/add/' + this.serviceId)
    },
    toEditPage(row) {
      this.setEditData(row)
      this.$router.push('/add/' + this.serviceId)
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    deleteOpt(row) {
      this.$confirm('确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteById(row.id)
      }).catch(() => {
        this.$message.info('已取消删除')
      })
    },
    deleteById(id) {
      let columns = []
      columns.push({name: 'id', value: id})

      let param = {
        'param': {
          'condition': columns,
          'serviceId': this.serviceId,
          'timestamp': '',
          'sign': ''
        }
      }

      this.$axios({
        url: 'baseController/deleteBaseDataByParam',
        method: 'post',
        baseURL: '/proxy',
        headers: {
          'Content-Type': 'application/json'
        },
        data: param
      }).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.getTableData()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    ...mapMutations({
      setEditData: 'setEditData'
    })
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
