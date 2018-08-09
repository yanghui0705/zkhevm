import {transType, replenishmentStatus} from '../../common/js/nameValue'

export const tableDataMixin = {
  methods: {
    search() {
      this.getTableData()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableData()
    },
    handleCurrentChange(val) {
      this.pageNum = val
      this.getTableData()
    },
    tableHeaderClassName({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'header-row'
      }
      return ''
    },
    handleSortChange({prop, order}) {
      this.sortName = prop
      if (order === 'descending') {
        this.sortValue = 'desc'
      } else {
        this.sortValue = 'asc'
      }
      this.getTableData()
    },
    dealTableResponse(res) {
      if (res.success) {
        this.tableData.loading = false
        this.tableData.body = res.obj.list
        this.pageNum = res.obj.pageNum > 0 ? res.obj.pageNum : 1
        this.pageSize = res.obj.pageSize
        this.total = res.obj.total
      } else {
        this.tableData.loading = false
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
    },
    formatter(row, column, cellValue, index) {
      let formatValue = cellValue
      if (column.property === 'transType') {
        for (let i = 0; i < transType.length; i++) {
          if (transType[i].value === cellValue) {
            formatValue = transType[i].name
            break
          }
        }
      } else if (column.property === 'status') {
        for (let i = 0; i < replenishmentStatus.length; i++) {
          if (replenishmentStatus[i].value === cellValue) {
            formatValue = replenishmentStatus[i].name
            break
          }
        }
      }
      return formatValue
    }
  }
}
