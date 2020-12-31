<template>
  <div class="productManage">
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
        :pageObj="page"
        @handleButton="handleButton"
        @handleCurrentChange="handleCurrentChange"
        @handleSizeChange="handleSizeChange"
      />
    </div>
    <!-- 添加或编辑 -->

    <addProductDialog
      v-if="productDialog.show"
      :isShow="productDialog.show"
      :type="productDialog.type"
      :dialogRow="productDialog.row"
      @close="productDialog.show=false"
      @refeshTable="handleSearch"
    ></addProductDialog>
  </div>
</template>
<script>
import searchForm from '@/components/searchForm/index'
import bTable from '@/components/Table/index'
import { getProductData, delProduct } from '@/api/product'
import addProductDialog from './components/addOrEditDialog'
export default {
  name: 'UserManage',
  components: { searchForm, bTable, addProductDialog },
  data() {
    return {
      formInline: {
        SelectMap: '',
      },
      page: {
        size: 10,
        total: 0,
        pageSizes: [10, 50, 100, 200],
        currentPage: 1,
      },
      productDialog: {
        show: false,
        type: 'add',
        row: {},
      },
      searchForm: [
        {
          type: 'Input',
          prop: 'SelectMap',
          width: 300,
          placeholder: '请输入产品名称进行搜索',
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
            this.productDialog.show = true
            this.productDialog.type = 'add'
          },
        },
      ],
      tableData: [],
      tableHeader: [
        { prop: 'name', label: '产品名称' },
        { prop: 'productKey', label: '产品Key' },
        { prop: 'productSecretKey', label: '产品密钥' },
        { prop: 'productUrl', label: '产品url' },
        { prop: 'shadow', label: '影子' },
        { prop: 'remarks', label: '备注' },
      ],
      tableOption: {
        label: '操作',
        width: '200',
        options: [
          { label: '查看', type: 'text', methods: 'view' },
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
    this.handleSearch()
  },
  methods: {
    /**
     * 查询
     */
    handleSearch() {
      const { currentPage, size } = this.page
      this.formInline.pageNum = currentPage
      this.formInline.pageSize = size
      getProductData(this.formInline).then((res) => {
        if (res.success) {
          const { total, list } = res.data
          this.tableData = list
          this.page.total = total
        }
      })
    },
    handleButton(method, data, row, index) {
      if (method === 'edit') {
        //编辑
        this.productDialog.show = true
        this.productDialog.type = 'edit'
        this.productDialog.row = row
      } else if (method === 'delete') {
        this.handleDelete(data, row, index)
      } else {
        this.$router.push(
          `/productManage/function/${row.name}/${row.productCode}`
        )
      }
    },
    /** 删除用户 */
    handleDelete(data, row, index) {
      this.$confirm(`此操作将彻底删除${row.name}产品, 继续吗？`, '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delProduct({ productId: row.productCode }).then((res) => {
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
}
</style>
