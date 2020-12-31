<template>
  <div class="tagManage">
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
    <addTagDialog
      v-if="tagDialog.show"
      :tagDialogRow="tagDialog"
      @close="tagDialog.show=false"
    ></addTagDialog>
  </div>
</template>
<script>
import searchForm from '@/components/searchForm/index'
import bTable from '@/components/Table/index'
import { getProductData } from '@/api/product'
// import { getCompanyList } from '@/api/company'
import { getCompanyTags, delCompanyTags } from '@/api/tagManage'
import addTagDialog from './components/addOrEditDialog'

export default {
  name: 'tagManage',
  components: { searchForm, bTable, addTagDialog },
  data() {
    return {
      formInline: {
        productCode: '',
        labelName: '',
      },
      page: {
        size: 10,
        total: 0,
        pageSizes: [10, 50, 100, 200],
        currentPage: 1,
      },
      tagDialog: { show: false, type: 'add', row: {} },
      searchForm: [
        {
          type: 'Select',
          prop: 'productCode',
          options: [],
          placeholder: '选择产品',
          change: (row) => {
            this.page.currentPage=1
            this.handleSearch()
          },
        },
        {
          type: 'Input',
          prop: 'labelName',
          width: 300,
          placeholder: '请输入标签名称进行搜索',
          change: (row) => {},
        },
      ],
      searchHandle: [
        {
          label: '查询',
          type: 'primary',
          handle: () => {
            this.page.currentPage=1
            this.handleSearch()
          },
        },
        {
          label: '添加',
          type: 'primary',
          plain: true,
          handle: () => {
            const { productCode } = this.formInline
            if (productCode == '') {
              return this.$message.error('请选择产品')
            }

            this.tagDialog.show = true
            this.tagDialog.type = 'add'
            this.tagDialog.row = { productCode }
          },
        },
      ],
      tableData: [],
      tableHeader: [
        { prop: 'productCode', label: '产品编码' },
        { prop: 'labelName', label: '标签名称' },
      ],
      tableOption: {
        label: '操作',
        options: [
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
    this.init() //获取产品
  },
  methods: {
    init() {
      getProductData({ pageNum: 1, pageSize: 1000 }).then((res) => {
        if (res.success) {
          const { list } = res.data
          const arr = list.map((item) => {
            return { label: item.name, value: item.productCode }
          })
          this.searchForm[0].options = arr
        }
      })
    },
    handleSearch() {
      this.formInline.pageNo = this.page.currentPage
      this.formInline.pageSize = this.page.size
      getCompanyTags(this.formInline).then((res) => {
        if (res.success) {
          this.tableData = res.data.list
          this.page.total = res.data.total
        }
      })
    },
    handleButton(method, data, row, index) {
      if (method === 'edit') {
        //编辑
        // this.tagDialog.show = true
        // this.tagDialog.type = 'edit'
        // this.tagDialog.row = row
      } else if (method === 'delete') {
        this.handleDelete(data, row, index)
      }
    },
    /** 删除 */
    handleDelete(data, row, index) {
      this.$confirm(`此操作将彻底删除${row.labelName}, 继续吗？`, '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delCompanyTags({
            productCode: row.productCode,
            labelName: row.labelName,
          }).then((res) => {
            if (res.success) {
              data.splice(index, 1)
              this.$message({
                type: 'success',
                message: '删除成功!',
              })
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
.tagManage {
}
</style>
