
export const tableData = {
  methods: {
    search_bottom() {
      this.getTableData_bottom()
    },
    handleSizeChange_bottom(val) {
      this.pageSize_bottom = val
      this.getTableData_bottom()
    },
    handleCurrentChange_bottom(val) {
      this.pageNum_bottom = val
      this.getTableData_bottom()
    },
    tableHeaderClassName_bottom({row, rowIndex}) {
      if (rowIndex === 0) {
        return 'header-row'
      }
      return ''
    },
    handleSortChange_bottom({prop, order}) {
      this.sortName_bottom = prop
      if (order === 'descending') {
        this.sortValue_bottom = 'desc'
      } else {
        this.sortValue_bottom = 'asc'
      }
      this.getTableData_bottom()
    },
    dealTableResponse_bottom(res) {
      if (res.success) {
        this.tableData_bottom.loading = false
        this.tableData_bottom.body = res.obj.list
        this.pageNum_bottom = res.obj.pageNum > 0 ? res.obj.pageNum : 1
        this.pageSize_bottom = res.obj.pageSize
        this.total_bottom = res.obj.total
      } else {
        this.tableData_bottom.loading = false
        this.$message({
          showClose: true,
          message: res.msg,
          type: 'error'
        })
      }
    }
  }
}
