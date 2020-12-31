<template>
  <div class="updatePassword">
    <div class="title"> 修改密码</div>
    <el-form
      ref="form"
      :model="form"
      label-width="120px"
      label-position="top"
      :rules="rules"
    >
      <el-form-item
        label="原始密码"
        prop="originalPwd"
      >
        <el-input
          v-model="form.originalPwd"
          show-password
          auto-complete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newPwd"
      >
        <el-input
          v-model="form.newPwd"
          show-password
          auto-complete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="againPwd"
      >
        <el-input
          v-model="form.againPwd"
          show-password
          auto-complete="new-password"
        ></el-input>
      </el-form-item>
      <el-form-item style="margin-top:40px;">
        <el-button
          type="primary"
          @click="submitForm('form')"
        >提交</el-button>
        <el-button @click="resetForm('form')">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { updatePassword } from '@/api/user'
export default {
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        if (this.form.againPwd !== '') {
          this.$refs.form.validateField('againPwd')
        }
        callback()
      }
    }
    var validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.newPwd) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      form: {
        originalPwd: '',
        newPwd: '',
        againPwd: '',
      },
      rules: {
        originalPwd: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
        ],
        newPwd: [{ required: true, trigger: 'blur', validator: validatePass }],
        againPwd: [
          { required: true, trigger: 'blur', validator: validatePass2 },
        ],
      },
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          updatePassword(this.form).then((res) => {
            if (res.success) {
              this.$message.success(res.msg)
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
  },
}
</script>
<style lang="scss" scoped>
.updatePassword {
  height: calc(100vh - 145px);
  .title {
    color: rgba(0, 0, 0, 0.85);
    font-size: 20px;
    font-weight: 500;
    line-height: 28px;
    margin-bottom: 20px;
  }
}
</style>