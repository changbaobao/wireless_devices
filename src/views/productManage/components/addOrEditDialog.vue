
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
        label="产品编码"
        prop="productCode"
      >
        <el-input v-model="ruleForm.productCode"></el-input>
      </el-form-item>

      <el-form-item
        label="产品名称"
        prop="name"
      >
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="产品Key"
        prop="productKey"
      >
        <el-input v-model="ruleForm.productKey"></el-input>
      </el-form-item>
      <el-form-item
        label="产品密钥"
        prop="productSecretKey"
      >
        <el-input v-model="ruleForm.productSecretKey"></el-input>
      </el-form-item>
      <el-form-item
        label="地域名称"
        prop="region"
      >
        <el-input v-model="ruleForm.region"></el-input>
      </el-form-item>
      <el-form-item
        label="产品url"
        prop="productUrl"
      >
        <el-input v-model="ruleForm.productUrl"></el-input>
      </el-form-item>
     
      <el-form-item
        label="影子"
        prop="shadow"
      >
        <el-switch
          v-model="ruleForm.shadow"
          active-color="#13ce66"
          inactive-color="#ff4949"
        ></el-switch>
      </el-form-item>
      <el-form-item
        label="备注"
        prop="remarks"
      >
        <el-input
          type="textarea"
          v-model="ruleForm.remarks"
        ></el-input>
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
import { addProduct, editProduct } from '@/api/product'
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
        name: '',
        productCode: '',
        productKey: '',
        productSecretKey: '',
        region:'',
        productUrl: '',
        shadow: false,
        remarks: '',
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        productCode: [
          { required: true, message: '请输入产品编号', trigger: 'blur' },
        ],
        productUrl: [
          { required: true, message: '请输入产品url', trigger: 'blur' },
        ],
        region:[{required: true, message: '请输入地域名称', trigger: 'blur'}]
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
            addProduct(this.ruleForm).then((res) => {
              if (res.success) {
                this.$message.success('添加成功')
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('refeshTable')
              }
            })
          } else {
            editProduct(this.ruleForm).then((res) => {
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