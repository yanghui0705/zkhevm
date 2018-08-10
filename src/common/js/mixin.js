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
      this.tableData.loading = false
      if (res.success) {
        this.tableData.body = res.obj.list
        this.pageNum = res.obj.pageNum > 0 ? res.obj.pageNum : 1
        this.pageSize = res.obj.pageSize
        this.total = res.obj.total
      } else {
        this.$message.error(res.msg)
      }
    }
  }
}
