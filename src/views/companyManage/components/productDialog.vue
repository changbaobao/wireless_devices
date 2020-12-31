<template>
  <el-dialog
    title="产品"
    :visible.sync="dialogVisible"
    width="30%"
    :close-on-click-modal="false"
    @close="Close"
  >
    <div class="top-form">
      <label>应用标签：</label>
      <el-tag
        :key="index"
        v-for="(tag,index) in dynamicTags"
        closable
        class="apply-tag"
        :disable-transitions="false"
        @close="handleClose(tag,index,dynamicTags)"
      >
        {{tag.name}}
      </el-tag>
    </div>
    <div class="bottom-select">
      <el-select
        v-model="selectValue"
        placeholder="请选择未应用产品"
      >
        <el-option
          v-for="item in selectOptions"
          :key="item.productCode"
          :label="item.name"
          :value="item.productCode"
        >
        </el-option>
      </el-select>
      <el-button
        type='primary'
        @click="handleAdd"
      > + 添加</el-button>
    </div>

  </el-dialog>
</template>
<script>
import {
  getCompanyProduct,
  getFeiCompanyProduct,
  addCompanyProduct,
  delCompanyProduct,
} from '@/api/company'
import a from 'file-saver'
export default {
  name: 'productDialog',
  props: {
    isShow: Boolean,
    row: Object,
  },
  data() {
    return {
      dialogVisible: this.isShow,
      companyCode: '', //公司标识
      dynamicTags: [],
      selectValue: '',
      selectOptions: [],
    }
  },
  created() {
    this.companyCode = this.row.code
  },
  mounted() {
    this.onAllSubmit() //查询全部产品
  },
  methods: {
    Close() {
      this.$emit('close')
    },
    /**添加 */
    handleAdd() {
      if (this.selectValue == '') {
        this.$message.error('请选择要添加的产品')
        return
      }
      addCompanyProduct({
        productCode: this.selectValue,
        companyCode: this.companyCode,
      }).then((res) => {
        if (res.success) {
          const items = res.data
          const dataList = this.dynamicTags
          let index = 0
          for (let i in dataList) {
            if (dataList[i].productCode == items.productCode) {
              dataList.splice(index, 1)
            }
            index++
          }
          dataList.push(items)
          this.selectValue = ''
          this.onSubmit()
        }
      })
    },

    /**
     * 删除标签
     */
    handleClose(tag, index, data) {
      this.$confirm(`此操作将彻底删除${tag.name}, 继续吗？`, '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delCompanyProduct({
            productCode: tag.productCode,
            companyCode: this.companyCode,
          }).then((res) => {
            if (res.success) {
              data.splice(index, 1)
              this.$message.success('删除成功')
              this.onSubmit()
            }
          })
        })
        .catch(() => {})
    },
    /**查询未应用产品 */
    onSubmit() {
      return new Promise((resolve, reject) => {
        getFeiCompanyProduct({
          companyCode: this.companyCode,
        }).then((res) => {
          if (res.success) {
            this.selectOptions = res.data
            resolve(res.data)
          }
        })
      })
    },
    async onAllSubmit() {
      const noCompanyList = await this.onSubmit() //未应用
      getCompanyProduct({
        companyCode: this.companyCode,
        pageNo: 1,
        pageSize: 1000,
      }).then((res) => {
        if (res.success) {
          const { list } = res.data //全部产品
          // 计算已经应用的，取两个数组差集
          let arr = [...list].filter((x) =>
            [...noCompanyList].every((y) => y.productCode !== x.productCode)
          )
          this.dynamicTags = arr
        }
      })
    },
  },
}
</script>
<style lang="scss" scoped>
.top-form {
  margin-bottom: 20px;
  .apply-tag {
    margin-left: 10px;
  }
}
</style>