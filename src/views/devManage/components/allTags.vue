<template>
  <el-dialog
    title="批量标签"
    :visible.sync="allTagsRow.show"
    width="26%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form
      :model="ruleForm"
      ref="ruleForm"
      label-width="120px"
      class="demo-ruleForm"
    >
      <el-row :gutter="10">
        <el-col :span="20">
          <el-form-item
            label="平台标签:"
            prop="systemTag"
          >
            <el-select
              v-model="ruleForm.systemTag"
              placeholder="选择平台标签"
              style="width:100%;"
              clearable
            >
              <el-option
                v-for="item in systemTagOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click="handleAddTag('system',ruleForm.systemTag)">+添加</el-button>
        </el-col>
      </el-row>
      <el-form-item label="已选平台标签:">
        <el-tag
          v-for="(tag, index) in ruleForm.systemTags"
          :key="index"
          style="margin:0 8px 8px 0;"
          closable
          @close="handleTagClose(index,ruleForm.systemTags)"
        >
          {{tag}}
        </el-tag>
      </el-form-item>
      <el-row
        :gutter="10"
        v-if="tagsRow.companyCode"
      >
        <el-col :span="20">
          <el-form-item
            label="公司标签:"
            prop="companyTag"
          >
            <el-select
              v-model="ruleForm.companyTag"
              placeholder="选择公司标签"
              style="width:100%;"
              clearable
            >
              <el-option
                v-for="item in companyTagOptions"
                :key="item"
                :label="item"
                :value="item"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4">
          <el-button @click="handleAddTag('company',ruleForm.companyTag)">+添加</el-button>
        </el-col>
      </el-row>

      <el-form-item
        label="已选公司标签:"
        v-if="tagsRow.companyCode"
      >
        <el-tag
          class="tag-item"
          style="margin:0 8px 8px 0;"
          v-for="(tag ,ele) in ruleForm.companyTags"
          :key="ele"
          closable
          @close="handleTagClose(ele,ruleForm.companyTags)"
        >
          {{tag}}
        </el-tag>
      </el-form-item>
      <el-form-item style="margin-top:1%;">
        <el-button
          type="primary"
          @click="submitForm()"
        >确定</el-button>
        <el-button @click="handleClose()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {
  getAllTags,
  getAllCompanyTags,
  allAddCompanyOrSystemTag,
} from '@/api/devManage'
export default {
  props: ['allTagsRow'],
  data() {
    return {
      tagsRow: {},
      companyTagOptions: [],
      systemTagOptions: [],
      ruleForm: {
        equipmentName: '',
        systemTag: '',
        companyTag: '',
        companyTags: [],
        systemTags: [],
      },
    }
  },
  mounted() {
    this.tagsRow = this.allTagsRow.row

    this.init() //查询标签列表
  },
  methods: {
    init() {
      this.getSystemTags()
      if (this.tagsRow.companyCode) {
        //如果有公司标识
        this.getCompanyTags()
      }
    },
    /**获取平台标签 */
    getSystemTags() {
      getAllTags({
        productCode: this.tagsRow.productCode,
        pageNo: 1,
        pageSize: 1000,
      }).then((res) => {
        if (res.success) {
          const { list } = res.data
          const arr = list.map((item) => {
            return item.labelName
          })
          this.systemTagOptions = arr
        }
      })
    },
    /**查询公司标签 */
    getCompanyTags() {
      const { productCode, companyCode } = this.tagsRow
      getAllCompanyTags({
        productCode,
        companyCode,
      }).then((res) => {
        if (res.success) {
          let data = res.data
          const arr = data.map((item) => {
            return item.labelName
          })
          this.companyTagOptions = arr
        }
      })
    },
    handleClose() {
      this.$refs.ruleForm.resetFields()
      this.$emit('close')
    },
    /**添加公司或平台标签 */
    handleAddTag(type, value) {
      if (value == '') return this.$message.error('请选择需要添加的标签')
      if (type == 'system') {
        //平台标签
        let systemArr = this.ruleForm.systemTags
        systemArr.push(value)
        this.ruleForm.systemTags = [...new Set(systemArr)]
        value = ''
      } else {
        //公司标签
        let companyArr = this.ruleForm.companyTags
        companyArr.push(value)
        this.ruleForm.companyTags = [...new Set(companyArr)]
        value = ''
      }
    },
    /**关闭公司或平台标签 */
    handleTagClose(index, data) {
      data.splice(index, 1)
    },
    submitForm() {
      let eqArr = this.allTagsRow.selectList.map((item) => {
        return item.equipmentName
      }) //设备名称

      let param = {
        equipmentNames: eqArr.join(','),
        platformLabels: this.ruleForm.systemTags.join(','),
        companyLabels: this.ruleForm.companyTags.join(','),
      }

      allAddCompanyOrSystemTag(param).then((res) => {
        if (res.success) {
          this.$message.success(res.msg)
          this.handleClose()
          this.$parent.handleSearch()
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
</style>