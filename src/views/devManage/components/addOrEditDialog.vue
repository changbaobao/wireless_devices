
<template>
  <el-dialog
    :title="addOrEdit.type=='add'?'添加':'编辑'"
    :visible.sync="addOrEdit.show"
    width="26%"
    :close-on-click-modal="false"
    @close="clearForm"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item
        label="设备名称"
        prop="equipmentName"
        :rules="[{ required: true, message: '请输入设备名称', trigger: 'blur' }]"
      >
        <el-input v-model="ruleForm.equipmentName"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确定</el-button>
        <el-button @click="clearForm()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { addDevList, editDevList } from '@/api/devManage'
import { getProductData } from '@/api/product'
import { getCompanyList } from '@/api/company'
export default {
  props: ['addOrEdit'],
  data() {
    return {
      ruleForm: {
        equipmentName: '',
      },
    }
  },
  created() {},
  mounted() {
    if (this.addOrEdit.type == 'add') {
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.addOrEdit.type == 'add') {
            let params = Object.assign({}, this.addOrEdit.row, this.ruleForm)
            addDevList(params).then((res) => {
              if (res.success) {
                this.$message.success('添加成功')
                this.$parent.handleSearch()
                this.clearForm()
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    clearForm() {
      this.$refs.ruleForm.resetFields()
      this.$emit('close')
    },
  },
}
</script>