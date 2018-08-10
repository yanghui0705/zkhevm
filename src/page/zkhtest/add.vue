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
                          value-format="yyyy-MM-dd" :placeholder="item.name">
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
import {mapGetters} from 'vuex'

export default {
  data() {
    return {
      serviceId: this.$route.params.id,
      ruleForm: {
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        delFlag: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
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
    ...mapGetters([
      'editData'
    ]),
    getTableCfgParam() {
      return {
        'param': {
          'serviceId': this.serviceId,
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
          this.save(this.ruleForm.id)
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
        if (this.editData.id) {
          this.ruleForm = this.editData
          this.dealCondition(res, 'isUpdate')
        } else {
          this.dealCondition(res, 'isAdd')
        }
      })
    },
    dealCondition(res, flag) {
      let data = res.obj.columns
      let head = []
      for (let i = 0; i < data.length; i++) {
        if (data[i][flag]) {
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
    save(id) {
      let url = 'baseController/insertBaseDataByParam'
      let condition = []
      if (id) {
        url = 'baseController/updateBaseDataByParam'
        condition.push({name: 'id', value: id})
      }

      let columns = []
      for (let key in this.ruleForm) {
        columns.push({name: key, value: this.ruleForm[key]})
      }

      let param = {
        'param': {
          'columns': columns,
          'condition': condition,
          'serviceId': this.serviceId,
          'timestamp': '',
          'sign': ''
        }
      }

      this.$axios({
        url: url,
        method: 'post',
        baseURL: '/proxy',
        headers: {
          'Content-Type': 'application/json'
        },
        data: param
      }).then(res => {
        if (res.success) {
          this.$message.success('操作成功')
          this.$router.push('/list/' + this.serviceId)
        } else {
          this.$message.error(res.msg)
        }
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
