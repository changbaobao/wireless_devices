
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
        ></el-input>
      </el-form-item>
      <el-form-item
        label="是否审核"
        prop="registerState"
      >
        <el-switch
          v-model="ruleForm.registerState"
          :active-value="0"
          active-text="已审核"
          :inactive-value="1"
          disabled
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
        label="用户权限"
        prop="adminPower"
      >
        <el-radio-group
          v-model="ruleForm.adminPower"
          disabled
        >
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
import { addCompanyUser, editCompanyUser } from '@/api/user'
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
      var tel = /^0\d{2,3}-?\d{7,8}$/
      var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/
      if (value.length == 11) {
        if (!phone.test(value)) {
          callback(new Error('请输入正确的手机号码'))
        }
      } else if (value.length == 13 && value.indexOf('-') != -1) {
        if (!phone.test(value)) {
          callback(new Error('请输入正确的电话号码'))
        }
      } else {
        callback()
      }
    }
    return {
      dialogTitle: '',
      dialogVisible: this.isShow,
      ruleForm: {
        companyCode: '',
        formTo: 1,
        name: '',
        sex: '男',
        disable: 0,
        password: '',
        telephone: '',
        email: '',
        registerState: 0,
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
            message: '请输入电话号码',
          },
        ],
        registerState: [
          {
            required: true,
            trigger: 'change',
            message: '请选择是否注册',
          },
        ],
        disable: [
          {
            required: true,
            trigger: 'change',
            message: '请选择是否禁用',
          },
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
      const {
        userOrgName,
        telephone,
        password,
        id,
        email,
        sex,
        registerState,
        disable,
        adminPower,
      } = this.dialogRow
      this.ruleForm.id = id
      this.ruleForm.name = userOrgName
      this.ruleForm.sex = Number(sex)
      this.ruleForm.password = password
      this.ruleForm.telephone = telephone
      this.ruleForm.email = email
      this.ruleForm.telephone = telephone
      this.ruleForm.registerState = registerState
      this.ruleForm.disable = disable
      this.ruleForm.adminPower = adminPower
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
            this.ruleForm.companyCode = this.dialogRow.companyCode
            addCompanyUser(this.ruleForm).then((res) => {
              if (res.success) {
                this.$message.success('添加成功')
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('refeshTable')
              }
            })
          } else {
            editCompanyUser(this.ruleForm).then((res) => {
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