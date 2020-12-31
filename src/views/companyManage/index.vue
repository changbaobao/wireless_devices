<template>
  <div class="companyManage">
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
        @handleSizeChange="handleSizeChange"
        @handleCurrentChange="handleCurrentChange"
      />
    </div>
    <!-- 添加或编辑公司 -->
    <addCompanyDialog
      v-if="companyDialog.show"
      :isShow="companyDialog.show"
      :type="companyDialog.type"
      :dialogRow="companyDialog.row"
      @close="companyDialog.show=false"
      @refeshTable="handleSearch"
    ></addCompanyDialog>
    <!-- 产品弹框 -->
    <product-dialog
      v-if="productDialog.show"
      :isShow="productDialog.show"
      :row="productDialog.row"
      @close="productDialog.show=false"
    ></product-dialog>
  </div>
</template>
<script>
import searchForm from '@/components/searchForm/index'
import bTable from '@/components/Table/index'
import { getCompanyList, delCompany } from '@/api/company'
import addCompanyDialog from './components/addOrEditDialog'
import productDialog from './components/productDialog'
export default {
  name: 'companyManage',
  components: { searchForm, bTable, addCompanyDialog, productDialog },
  data() {
    return {
      formInline: {
        name: '',
      },
      page: {
        size: 10,
        total: 0,
        pageSizes: [10, 50, 100, 200],
        currentPage: 1,
      },
      companyDialog: { show: false, type: 'add', row: {} },
      searchForm: [
        {
          type: 'Input',
          prop: 'name',
          width: 300,
          placeholder: '请输入名称进行搜索',
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
            this.companyDialog.show = true
            this.companyDialog.type = 'add'
          },
        },
      ],
      tableData: [],
      tableHeader: [
        { prop: 'name', label: '公司名称' },
        { prop: 'abbreviation', label: '公司简称' },
        { prop: 'mailbox', label: '公司邮箱' },
        { prop: 'secretKey', label: '密钥' },
        { prop: 'timeValidity', label: '有效期' },
      ],
      tableOption: {
        label: '操作',
        width: '200',
        options: [
          {
            label: '产品',
            type: 'text',
            methods: 'product',
          },
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
      productDialog: { show: false, row: {} }, //产品弹框
    }
  },
  created() {
    this.handleSearch()
  },
  mounted() {
   
  },
  methods: {
    handleSearch() {
      const { currentPage, size } = this.page
      getCompanyList({
        name: this.formInline.name,
        pageNum: currentPage,
        pageSize: size,
      }).then((res) => {
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
        this.companyDialog.show = true
        this.companyDialog.type = 'edit'
        this.companyDialog.row = row
      } else if (method === 'delete') {
        this.handleDelete(data, row, index)
      } else {
        //查看
        this.productDialog.show = true
        this.productDialog.row = row
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
          delCompany({ code: row.code }).then((res) => {
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
.companyManage {
}
</style>
