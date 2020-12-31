
<template>
  <el-dialog
    :title="dialogTitle"
    :visible.sync="dialogVisible"
    width="30%"
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
        label="名称"
        prop="name"
      >
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item
        label="性别"
        prop="sex"
      >
        <el-radio-group v-model="ruleForm.sex">
          <el-radio label="男"></el-radio>
          <el-radio label="女"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
      >
        <el-input
          v-model="ruleForm.password"
          show-password
          auto-complete="new-password"
        ></el-input>
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
        label="电话"
        prop="telephone"
      >
        <el-input v-model="ruleForm.telephone"></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input v-model="ruleForm.email"></el-input>
      </el-form-item>
      <el-form-item
        label="用户权限"
        prop="adminPower"
      >
        <el-radio-group v-model="ruleForm.adminPower">
          <el-radio :label="0">普通用户</el-radio>
          <el-radio :label="1">管理用户</el-radio>
        </el-radio-group>
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
import { addUser, editUser } from '@/api/user'
export default {
  props: {
    isShow: Boolean,
    dialogRow: {
      type: Object,
    },
    type: String,
  },
  data() {
    const validateTel = (rule, value, callback) => {
      if (value == '') {
        callback('请输入手机号码')
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('手机号码有误，请重填'))
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '',
      dialogVisible: this.isShow,
      ruleForm: {
        name: '',
        sex: '男',
        disable: 0,
        password: '',
        telephone: '',
        email: '',
        adminPower: 1,
      },
      rules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
            trigger: ['blur', 'change'],
          },
        ],
        telephone: [
          {
            required: true,
            trigger: 'blur',
            validator: validateTel,
          },
        ],
        disable: [
          { required: true, trigger: 'change', message: '请选择是否禁用' },
        ],
        adminPower: [
          { required: true, trigger: 'change', message: '请选择用户权限' },
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
            addUser(this.ruleForm).then((res) => {
              if (res.success) {
                this.$message.success('添加成功')
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('refeshTable')
              }
            })
          } else {
            editUser(this.ruleForm).then((res) => {
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