<template>
  <div class="productManage">
    <div class="top-title">
      <i
        class="el-icon-back icon_back"
        @click="handleGoBack"
      ></i>
      {{productName}}
    </div>
    <searchForm
      :search-data="formInline"
      :search-form="searchForm"
      :search-handle="searchHandle"
    />
    <div class="table">
      <bTable
        :table-data="tableData"
        :row-header="tableHeader"
        :table-option="tableOption"
        :isHidden="false"
        @handleButton="handleButton"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <!-- 添加或编辑 -->
    <addProductDialog
      v-if="productFunDialog.show"
      :isShow="productFunDialog.show"
      :type="productFunDialog.type"
      :productId="productCode"
      :dialogRow="productFunDialog.row"
      @close="productFunDialog.show=false"
      @refeshTable="handleSearch"
    ></addProductDialog>
  </div>
</template>
<script>
import searchForm from '@/components/searchForm/index'
import bTable from '@/components/Table/index'
import { getProductFunction, delProductFunction } from '@/api/product'
import addProductDialog from './components/addOrEditDialog'
export default {
  name: 'UserManage',
  components: { searchForm, bTable, addProductDialog },
  data() {
    return {
      productName: '',
      formInline: {
        productId: '',
        queryMap: '',
      },
      page: {
        size: 10,
        total: 0,
        pageSizes: [10, 50, 100, 200],
        currentPage: 1,
      },
      productFunDialog: {
        show: false,
        type: 'add',
        row: {},
      },
      searchForm: [
        {
          type: 'Input',
          prop: 'queryMap',
          width: 300,
          placeholder: '请输入产品名称或标识符进行搜索',
          change: (row) => {},
        },
      ],
      searchHandle: [
        {
          label: '查询',
          type: 'primary',
          handle: () => {
            this.handleSearch()
          },
        },

        {
          label: '添加',
          type: 'primary',
          plain: true,
          handle: () => {
            this.productFunDialog.show = true
            this.productFunDialog.type = 'add'
          },
        },
      ],
      tableData: [],
      tableHeader: [
        { prop: 'type', label: '功能类型' },
        { prop: 'name', label: '功能名称' },
        { prop: 'identifier', label: '标识符' },
        { prop: 'dataType', label: '数据类型' },
        {
          prop: 'dataSpecs',
          label: '数据定义',
          render: (params) => {
            if (params.dataSpecs) {
              let data = JSON.parse(params.dataSpecs)
              if (params.dataType == 'text') {
                return `长度为${data.length}`
              } else if (params.dataType == 'enum') {
                let str = ''
                data.map((item) => {
                  for (let key in item) {
                    str += `${item[key]} - ${key},`
                  }
                })
                return `枚举值：${str}`
              } else {
                return `取值范围 ${data.min} ~ ${data.max}`
              }
            }
          },
        },
        { prop: 'describes', label: '描述' },
      ],
      tableOption: {
        label: '操作',
        width: '200',
        options: [
          // { label: '查看', type: 'text', methods: 'view' },
          {
            label: '编辑',
            type: 'text',
            methods: 'edit',
          },
          {
            label: '删除',
            type: 'text',
            methods: 'delete',
            style: 'color:rgb(245, 108, 108)',
          },
        ],
      },
    }
  },
  created() {
    this.productCode = this.$route.params.id
    this.productName = this.$route.params.name
    this.handleSearch()
  },
  methods: {
    /**返回上一页 */
    handleGoBack() {
      this.$router.go(-1)
    },
    /**
     * 查询
     */
    handleSearch() {
      this.formInline.productId = this.productCode
      getProductFunction(this.formInline).then((res) => {
        if (res.success) {
          this.tableData = res.data
        }
      })
    },
    handleButton(method, data, row, index) {
      if (method === 'edit') {
        //编辑
        this.productFunDialog.show = true
        this.productFunDialog.type = 'edit'
        this.productFunDialog.row = row
      } else if (method === 'delete') {
        this.handleDelete(data, row, index)
      } else {
      }
    },
    /** 删除 */
    handleDelete(data, row, index) {
      this.$confirm(`此操作将彻底删除${row.name}, 继续吗？`, '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delProductFunction({ productfId: row.id }).then((res) => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
              this.handleSearch()
            }
          })
        })
        .catch(() => {})
    },
    handleSizeChange(val) {
      this.page.currentPage = 1
      this.page.size = val
      this.handleSearch()
    },
    handleCurrentChange(val) {
      this.page.currentPage = val
      this.handleSearch()
    },
  },
}
</script>
<style lang="scss" scoped>
.productManage {
  .top-title {
    width: 100%;
    height: 50px;
    line-height: 50px;
    font-size: 24px;
    color: #373d41;
    font-weight: 700;
    margin-bottom: 10px;
    .icon_back {
      color: #373d41;
      font-size: 22px;
      margin-right: 10px;
      vertical-align: -3px;
      font-weight: 700;
      cursor: pointer;
    }
  }
}
</style>
