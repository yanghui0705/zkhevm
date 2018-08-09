const transType = [
  {
    name: '预测入库',
    value: '1'
  },
  {
    name: '补货',
    value: '2'
  },
  {
    name: '差异退货',
    value: '3'
  },
  {
    name: 'SAP调拨退货',
    value: '4'
  },
  {
    name: '拨入销售仓',
    value: '5'
  },
  {
    name: '盘盈入库',
    value: '6'
  },
  {
    name: '盘亏出库',
    value: '7'
  },
  {
    name: '拨出销售仓',
    value: '8'
  },
  {
    name: '领料',
    value: '9'
  },
  {
    name: 'SAP退货取消',
    value: '10'
  },
  {
    name: 'SAP补货取消',
    value: '11'
  },
  {
    name: '销售虚拟仓补货',
    value: '12'
  }
]

const replenishmentStatus = [
  {
    name: '待同步',
    value: '1'
  },
  {
    name: '同步成功',
    value: '2'
  },
  {
    name: '异常关闭',
    value: '3'
  },
  {
    name: '关闭',
    value: '4'
  }
]

export {transType, replenishmentStatus}
