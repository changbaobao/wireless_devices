<template>
  <el-dialog
    title="批量修改"
    :visible.sync="allEidtRow.show"
    width="35%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <el-form label-width="100px">
      <el-row :gutter="10">
        <el-col
          :span="12"
          v-for="item in searchForm"
          :key="item.name"
        >
          <el-form-item
            :label="item.name"
            :prop="item.identifier"
          >
            <el-input
              v-model="item.value"
              :disabled="item.rwFlag==1"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-form-item>
          <el-button
            type="primary"
            @click="submitForm()"
          >确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { getDeviceShadow, deviceEidtShadow } from '@/api/devManage'
import { getProductFunction } from '@/api/product'
export default {
  props: ['allEidtRow'],
  data() {
    return {
      productCode: '',
      searchForm: [],
    }
  },
  mounted() {
    this.productCode = this.allEidtRow.selectList[0].productCode
    this.getProduct()
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    getProduct() {
      getProductFunction({ productId: this.productCode }).then((res) => {
        if (res.success) {
          const result = res.data.map((item) => {
            return { ...item, value: 0 }
          })
          this.searchForm = result
        }
      })
    },
    /**
     * 批量修改影子
     */
    submitForm() {
      let list = this.allEidtRow.selectList
      let deviceNameArr = list.map((item) => {
        return item.equipmentName
      })
      let jsonArr = this.searchForm.filter((item) => item.value !== 0)
      let jsonObj = {}
      jsonArr.map((item) => {
        jsonObj[item.identifier] = item.value
      })

      let params = {
        ProductKey: this.productCode,
        DeviceName: deviceNameArr.join(','),
        ShadowMessage: JSON.stringify(jsonObj),
      }

      deviceEidtShadow(params).then((res) => {
        if (res.success) {
          this.$message.success(res.msg)
          this.handleClose()
        }
      })
    },
  },
}
</script>