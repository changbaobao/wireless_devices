
<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="35%"
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
        label="公司编码"
        prop="code"
      >
        <el-input v-model="ruleForm.code"></el-input>
      </el-form-item>
      <el-form-item
        label="公司名称"
        prop="name"
      >
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="公司简称"
        prop="abbreviation"
      >
        <el-input v-model="ruleForm.abbreviation"></el-input>
      </el-form-item>
      <el-form-item
        label="公司邮箱"
        prop="mailbox"
      >
        <el-input v-model="ruleForm.mailbox"></el-input>
      </el-form-item>
      <el-form-item
        label="密钥"
        prop="secretKey"
      >
        <el-input v-model="ruleForm.secretKey"></el-input>
      </el-form-item>
      <el-form-item
        label="是否禁用"
        prop="disable"
      >
        <el-switch
          v-model="ruleForm.disable"
          active-color="#13ce66"
          inactive-color="#ff4949"
          :active-value="0"
          :inactive-value="1"
        ></el-switch>
      </el-form-item>
      <el-form-item
        label="有效期"
        prop="timeValidity"
      >
        <el-date-picker
          v-model="ruleForm.timeValidity"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
        >
        </el-date-picker>

      </el-form-item>
      <el-form-item>
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
import { addCompany, editCompany } from '@/api/company'
export default {
  props: {
    isShow: Boolean,
    dialogRow: {
      type: Object,
    },
    type: String,
  },
  data() {
    return {
      dialogTitle: '',
      dialogVisible: this.isShow,
      ruleForm: {
        code: '',
        name: '',
        abbreviation: '',
        mailbox: '',
        secretKey: '',
        disable: 1,
        timeValidity: '',
      },
      rules: {
        code: [{ required: true, message: '请输入公司编码', trigger: 'blur' }],
        name: [{ required: true, message: '请输入公司名称', trigger: 'blur' }],
        abbreviation: [
          { required: true, message: '请输入公司简称', trigger: 'blur' },
        ],
        mailbox: [
          { required: true, message: '请输入公司邮箱地址', trigger: 'blur' },
        ],
        secretKey: [
          { required: true, message: '请输入公司密钥', trigger: 'blur' },
        ],
        timeValidity: [
          { required: true, message: '请选择有效期', trigger: 'change' },
        ],
      },
    }
  },
  mounted() {
    if (this.type == 'add') {
      this.dialogTitle = '添加'
      this.$nextTick(() => {
        this.$refs.ruleForm.resetFields()
      })
    } else {
      this.dialogTitle = '编辑'
      this.ruleForm = { ...this.dialogRow }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type == 'add') {
            addCompany(this.ruleForm).then((res) => {
              if (res.success) {
                this.$message.success('添加成功')
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('refeshTable')
              }
            })
          } else {
            editCompany(this.ruleForm).then((res) => {
              if (res.success) {
                this.$message.success('编辑成功')
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('refeshTable')
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
      this.dialogVisible = false
    },
  },
}
</script>