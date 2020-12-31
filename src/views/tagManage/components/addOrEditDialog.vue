
<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="tagDialogRow.show"
    width="25%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >

      <el-form-item
        label="标签名称"
        prop="labelName"
      >
        <el-input v-model="ruleForm.labelName"></el-input>
      </el-form-item>
      <el-form-item style="margin-top:20px;">
        <el-button
          type="primary"
          @click="submitForm('ruleForm')"
        >确定</el-button>
        <el-button @click="resetForm('ruleForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { addCompanyTags } from '@/api/tagManage'
export default {
  props: ['tagDialogRow'],
  data() {
    return {
      dialogTitle: '',
      ruleForm: {
        labelName: '',
        sort: 100,
      },
      rules: {
        labelName: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
        ],
      },
    }
  },
  mounted() {
    if (this.tagDialogRow.type == 'add') {
      this.dialogTitle = '添加标签'
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    } else {
      //   this.dialogTitle = '编辑'
      //   this.ruleForm = this.tagDialogRow.row
    }
  },
  methods: {
    handleClose() {
      this.$refs['ruleForm'].resetFields()
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.tagDialogRow.type == 'add') {
            const params = Object.assign(
              {},
              this.tagDialogRow.row,
              this.ruleForm
            )

            addCompanyTags(params).then((res) => {
              if (res.success) {
                this.$message.success('添加成功')
                this.$parent.handleSearch()
                this.handleClose()
              }
            })
          } else {
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.handleClose()
    },
  },
}
</script>