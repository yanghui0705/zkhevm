<template>
  <div class="sys-page">
    <app-title title="测试"></app-title>
    {{tableData.condition}}
    <br/>
    {{ruleForm}}
    <div class="z-form">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item v-for="(item,index) in tableData.condition" :key="index" :label="item.name" :prop="item.key">
          <el-input v-model="ruleForm[item.key]" v-if="item.conditionType === 'text'" :placeholder="item.name" size="small"></el-input>
          <el-date-picker v-model="ruleForm[item.key]" v-if="item.conditionType === 'date'" type="date" size="small"
                          :placeholder="item.name">
          </el-date-picker>
          <el-date-picker v-model="ruleForm[item.key]" v-if="item.conditionType === 'dateRange'" type="daterange" size="small"
                          range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                          value-format="yyyy-MM-dd" :placeholder="item.name">
          </el-date-picker>
          <el-select v-model="ruleForm[item.key]" clearable :placeholder="item.name" size="small" v-if="item.conditionType === 'select'">
            <el-option
              v-for="i in item.option"
              :key="i.value"
              :label="i.label"
              :value="i.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
          <el-button @click="resetForm('ruleForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      ruleForm: {
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        creatTime: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ]
      },
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
  computed: {
    getTableCfgParam() {
      return {
        'param': {
          'serviceId': 'vendingFactory',
          'timestamp': ''
        }
      }
    }
  },
  mounted() {
    this.getTableCfg()
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.save()
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
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
        this.dealCondition(res)
      }).catch(err => {
        this.$message.error(`获取数据失败，失败码：${err.response.status}`)
      })
    },
    dealCondition(res) {
      let data = res.obj.columns
      let head = []
      for (let i = 0; i < data.length; i++) {
        if (data[i].isAdd) {
          let obj = {
            key: data[i].fieldName,
            name: data[i].fieldDesc,
            conditionType: data[i].modifyType
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
    save() {
      let columns = []
      for (let key in this.ruleForm) {
        columns.push({name: key, value: this.ruleForm[key]})
      }
      console.log(columns)

      let param = {
        'param': {
          'columns': columns,
          'serviceId': 'vendingFactory',
          'timestamp': '',
          'sign': ''
        }
      }

      this.$axios({
        url: 'baseController/insertBaseDataByParam',
        method: 'post',
        baseURL: '/proxy',
        headers: {
          'Content-Type': 'application/json'
        },
        data: param
      }).then(res => {
        this.dealCondition(res)
      }).catch(err => {
        this.$message.error(`获取数据失败，失败码：${err.response.status}`)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .z-form {
    width: 60%;
    .line {
      text-align: center;
    }
  }
</style>
