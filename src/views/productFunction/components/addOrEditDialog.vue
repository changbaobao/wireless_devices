
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
        label="功能名称"
        prop="name"
      >
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>

      <el-form-item
        label="功能类型"
        prop="type"
      >
        <el-select
          v-model="ruleForm.type"
          placeholder="请选择类型"
          style="width:100%;"
        >
          <el-option
            label="属性"
            value="属性"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item
        label="标识符"
        prop="identifier"
      >
        <el-input v-model="ruleForm.identifier"></el-input>
      </el-form-item>

      <el-form-item
        label="数据类型"
        prop="dataType"
      >
        <el-select
          v-model="ruleForm.dataType"
          placeholder="请选择数据类型"
          style="width:100%;"
        >
          <el-option
            v-for="item in dataTypeOption"
            :key="item"
            :label="item"
            :value="item"
          >
          </el-option>
        </el-select>

      </el-form-item>
      <el-row v-if="ruleForm.dataType!=='enum'&&ruleForm.dataType!=='text'&&ruleForm.dataType!==''">
        <el-row>
          <el-form-item
            style="margin-bottom:0;"
            label="取值范围"
            prop="min"
          >
            <el-col :span="11">
              <el-form-item prop="min">
                <el-input
                  v-model="ruleForm.min"
                  style="width:100%;"
                  placeholder="最小值"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              class="line"
              :span="2"
              style="text-align:center;"
            >--</el-col>
            <el-col :span="11">
              <el-form-item prop="max">
                <el-input
                  v-model="ruleForm.max"
                  placeholder="最大值"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="步长"
            prop="step"
          >
            <el-input v-model="ruleForm.step"></el-input>
          </el-form-item>
          <el-form-item
            label="单位"
            prop="unit"
          >
            <el-input v-model="ruleForm.unit"></el-input>
          </el-form-item>
        </el-row>
      </el-row>
      <!-- 枚举类型 -->
      <el-row
        v-if="ruleForm.dataType=='enum'"
        :gutter="10"
      >
        <em class="star">*</em>
        <el-form-item
          style="margin-bottom:0;"
          label="枚举值"
        >
          <div
            v-for="(domain, index) in ruleForm.enum"
            :key="index"
          >
            <el-col :span="10">
              <el-form-item
                :prop="'enum.' + index + '.value'"
                :rules="rules.enumVal"
              >
                <el-input
                  v-model="domain.value"
                  placeholder="参数值"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="11">
              <el-form-item
                :prop="'enum.' + index + '.name'"
                :rules="rules.enumName"
              >
                <el-input
                  v-model="domain.name"
                  placeholder="参数描述"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col
              :span="3"
              style="text-align:right;"
            >
              <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-col>
          </div>
        </el-form-item>
      </el-row>

      <el-form-item v-if="ruleForm.dataType=='enum'">
        <el-button
          icon="el-icon-plus"
          type="primary"
          plain
          @click="addDomain"
          size="mini"
        >添加枚举项</el-button>
      </el-form-item>
      <el-form-item
        label="数据长度"
        prop="length"
        v-if="ruleForm.dataType=='text'"
      >
        <el-input
          v-model="ruleForm.length"
          placeholder="请输入数据长度"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="读写类型"
        prop="rwFlag"
      >
        <el-radio-group v-model="ruleForm.rwFlag">
          <el-radio :label="0">读写</el-radio>
          <el-radio :label="1">只读</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        label="排序"
        prop="sort"
      >
      <el-input
          v-model="ruleForm.sort"
          placeholder="请输入数字类型排序"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="描述"
        prop="describes"
      >
        <el-input
          type="textarea"
          v-model="ruleForm.describes"
          maxlength="100"
          show-word-limit
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
import { addProductFunction, editProductFunction } from '@/api/product'
export default {
  props: {
    isShow: Boolean,
    dialogRow: {
      type: Object,
    },
    type: String,
    productId: String,
  },
  data() {
    return {
      dialogTitle: '',
      dialogVisible: this.isShow,
      dataTypeOption: ['init32', 'float', 'double', 'enum', 'text'], //数据类型
      ruleForm: {
        productCode: '',
        name: '',
        type: '',
        identifier: '',
        dataType: '',
        rwFlag: 0,
        enum: [{ name: '', value: '' }],
        max: 0,
        min: 0,
        step: '',
        unit: '',
        length: 0, //长度
        sort:0,
        describes: '',
      },
      rules: {
        name: [{ required: true, message: '请输入功能名称', trigger: 'blur' }],
        type: [{ required: true, message: '请输入功能类型', trigger: 'blur' }],
        identifier: [
          { required: true, message: '请输入标识符', trigger: 'blur' },
        ],
        dataType: [
          { required: true, message: '请选择数据类型', trigger: 'change' },
        ],
        enum: [{ required: true }],
        enumVal: [{ required: true, message: '值不能为空', trigger: 'blur' }],
        enumName: [
          { required: true, message: '描述不能为空', trigger: 'blur' },
        ],
        max: [{ required: true, message: '最大值不能为空', trigger: 'blur' }],
        min: [{ required: true, trigger: 'blur', message: '最小值不能为空' }],
        step: [{ required: true, message: '步长不能为空', trigger: 'blur' }],
        unit: [{ required: true, message: '单位不能为空', trigger: 'blur' }],
        length: [
          { required: true, message: '数据长度不能为空', trigger: 'blur' },
        ], //长度
        rwFlag: [
          { required: true, message: '请选择读写类型', trigger: 'change' },
        ],
        sort:[{required: true, message: '请输入数字类型排序', trigger: 'blur'}]
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
      this.edit()
      // this.ruleForm = { ...this.dialogRow }
    }
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    /**
     * 编辑
     */
    edit() {
      const {
        id,
        name,
        type,
        dataType,
        identifier,
        dataSpecs,
        describes,
        rwFlag,
        sort
      } = this.dialogRow

      const dataJson = JSON.parse(dataSpecs)

      this.ruleForm.productCode = this.productCode
      this.ruleForm.id = id
      this.ruleForm.name = name
      this.ruleForm.type = type
      this.ruleForm.dataType = dataType
      this.ruleForm.identifier = identifier
      this.ruleForm.rwFlag = rwFlag
      this.ruleForm.describes = describes
      this.ruleForm.sort=sort
      if (this.ruleForm.dataType == 'text') {
        this.ruleForm.length = dataJson.length
      } else if (this.ruleForm.dataType == 'enum') {
        let dataArr = []
        dataJson.map((item) => {
          for (let key in item) {
            dataArr.push({ name: key, value: item[key] })
          }
        })
        this.ruleForm.enum = dataArr
      } else {
        // debugger
        this.ruleForm.max = Number(dataJson.max)
        this.ruleForm.min = Number(dataJson.min)
        this.ruleForm.step = dataJson.step
        this.ruleForm.unit = dataJson.unit
      }
    },
    /**
     * 添加枚举框
     */
    addDomain() {
      this.ruleForm.enum.push({
        value: '',
        name: '',
      })
    },
    /**
     * 移除枚举
     */
    removeDomain(item) {
      var index = this.ruleForm.enum.indexOf(item)
      if (index !== -1) {
        this.ruleForm.enum.splice(index, 1)
      }
    },
    initParam() {
      this.ruleForm.productCode = this.productId
      const {
        productCode,
        name,
        type,
        identifier,
        dataType,
        max,
        min,
        step,
        unit,
        length,
        rwFlag,
        describes,
        sort
      } = this.ruleForm
      let param = {
        productCode,
        name,
        type,
        identifier,
        dataType,
        rwFlag,
        describes,
        sort
      }
      if (dataType == 'text') {
        param.dataSpecs = JSON.stringify({ length: length })
      } else if (dataType == 'enum') {
        let enumArr = this.ruleForm.enum
        let eArr = enumArr.map((item) => {
          return { [item.name]: item.value }
        })
        param.dataSpecs = JSON.stringify(eArr)
      } else {
        param.dataSpecs = JSON.stringify({
          max,
          min,
          step,
          unit,
        })
      }
      return param
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          const params = this.initParam()
          if (this.type == 'add') {
            addProductFunction(params).then((res) => {
              if (res.success) {
                this.$message.success('添加成功')
                this.$refs[formName].resetFields()
                this.dialogVisible = false
                this.$emit('refeshTable')
              }
            })
          } else {
            let obj = Object.assign({}, params, { id: this.ruleForm.id })
            editProductFunction(obj).then((res) => {
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
<style lang="scss">
.star {
  position: absolute;
  color: red;
  font-style: normal;
  left: 35px;
  top: 8px;
}
</style>