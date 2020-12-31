<template>
  <el-dialog
    title=""
    :visible.sync="bindingRow.show"
    width="25%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      ref="bindForm"
      :model="bindForm"
      label-width="100px"
    >
      <el-form-item
        label="绑定/解绑"
        prop="checked"
        v-if="bindingRow.type=='all'"
      >
        <el-radio-group v-model="bindForm.checked">
          <el-radio :label="0">绑定</el-radio>
          <el-radio :label="1">解绑</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="bindForm.checked==0"
        label="绑定："
        prop="companyCode"
      >
        <el-select
          v-model="bindForm.companyCode"
          placeholder="选择公司"
          style="width:100%;"
          clearable
        >
          <el-option
            v-for="item in companyOptions"
            :key="item.companyCode"
            :label="item.companyName"
            :value="item.companyCode"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-top:20px;">
        <el-button
          type="primary"
          @click="submitForm('bindForm')"
        >确定</el-button>
        <el-button @click="resetForm('bindForm')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  bindOneDev,
  bindAllDev,
  unBindAllDev,
  getCompanyDropDown,
} from '@/api/devManage'
export default {
  props: ['bindingRow', 'prodCode'],
  data() {
    return {
      bindForm: { companyCode: '', checked: 0 },
      companyOptions: [],
      selectedArr: [],
    }
  },
  mounted() {
    this.selectedArr = this.bindingRow.selectList
    console.error(this.prodCode, 'hhehehrow')
    this.getCompany()
  },
  methods: {
    getCompany() {
      getCompanyDropDown({ productCode: this.prodCode }).then((res) => {
        if (res.success) {
          this.companyOptions = res.data
        }
      })
    },
    handleClose() {
      this.$refs.bindForm.resetFields()
      this.$emit('close')
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const list = this.selectedArr.map((item) => {
            return item.equipmentName
          })

          if (this.bindForm.checked == 0) {
            //绑定
            if (this.bindingRow.type == 'one') {
              //单个绑定
              const { equipmentName } = this.bindingRow.row
              bindOneDev({
                equipmentName: equipmentName,
                companyCode: this.bindForm.companyCode,
              }).then((res) => {
                if (res.success) {
                  this.$message.success(res.msg)
                  this.handleClose()
                  this.$parent.handleSearch()
                }
              })
            } else {
              //批量绑定
              bindAllDev({
                equipmentNames: list,
                companyCode: this.bindForm.companyCode,
              }).then((res) => {
                if (res.success) {
                  this.$message.success(res.msg)
                  this.handleClose()
                  this.$parent.handleSearch()
                }
              })
            }
          } else {
            //解绑
            unBindAllDev({ equipmentName: list }).then((res) => {
              if (res.success) {
                this.$message.success(res.msg)
                this.handleClose()
                this.$parent.handleSearch()
              }
            })
          }
        } else {
        }
      })
    },
    resetForm() {
      this.handleClose()
    },
  },
}
</script>