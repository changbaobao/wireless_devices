<template>
  <div class="userManage">

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
      >
        <el-table-column
          slot="pass"
          label="禁用状态"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="scope.row.disable!= 0"
              style="color:red;"
            >禁用</span>
            <span v-else>启用</span>
          </template>
        </el-table-column>
        <el-table-column
          slot="pass"
          label="密码"
          align="center"
        >
          <template slot-scope="scope">
            <span style="display:flex;justify-content: center;align-items: center;">
              <el-input
                v-model="scope.row.password"
                :type="scope.row.passwordType"
                class="pawwordInput"
                :readonly="true"
                placeholder="请输入密码"
              />
              <span
                class="show-pwd"
                @click="showPwd(scope.row,scope.$index)"
              >
                <svg-icon
                  :icon-class="scope.row.passwordType === 'password' ? 'eye' : 'eye-open'"
                  style="width:14px;height:14px;"
                />
              </span>
            </span>
          </template>
        </el-table-column>

      </bTable>
    </div>
    <!-- 添加或编辑弹框 -->
    <addUserDialog
      v-if="userCompanyDialog.show"
      :isShow="userCompanyDialog.show"
      :type="userCompanyDialog.type"
      :dialogRow="userCompanyDialog.row"
      @close="userCompanyDialog.show=false"
      @refeshTable="handleSearch"
    ></addUserDialog>
  </div>
</template>
<script>
import searchForm from '@/components/searchForm/index'
import bTable from '@/components/Table/index'
import {
  getCompanyUser,
  resetCompanyPassword,
  delCompanyUser,
} from '@/api/user'
import { getCompanyList } from '@/api/company'
import addUserDialog from './components/addOrEditDialog'
export default {
  name: 'UserManage',
  components: { searchForm, bTable, addUserDialog },
  data() {
    return {
      formInline: {
        userOrgName: '',
        companyCode: '',
        companyName: '',
      },
      page: {
        size: 10,
        total: 0,
        pageSizes: [10, 50, 100, 200],
        currentPage: 1,
      },
      userCompanyDialog: {
        show: false,
        type: 'add',
        row: {},
      },
      searchForm: [
        {
          type: 'Select',
          prop: 'companyCode',
          options: [],
          placeholder: '选择公司',
          change: (row) => {
            const arr = this.searchForm[0].options.filter(
              (item) => item.value == row
            )
            if (arr.length !== 0) {
              this.formInline.companyName = arr[0].label
            } else {
              this.formInline.companyName = ''
            }
            this.page.currentPage=1
            this.handleSearch()
          },
        },
        {
          type: 'Input',
          prop: 'userOrgName',
          width: 300,
          placeholder: '手机号/邮箱/姓名进行搜索...',
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
            if (this.formInline.companyCode == '')
              return this.$message.error('请选择公司')
            this.userCompanyDialog.show = true
            this.userCompanyDialog.type = 'add'
            this.userCompanyDialog.row = {
              companyCode: this.formInline.companyCode,
            }
          },
        },
      ],
      tableData: [],
      tableHeader: [
        { prop: 'companyName', label: '公司名称' },
        { prop: 'companyCode', label: '公司编码' },
        { prop: 'userOrgName', label: '姓名' },
        { prop: 'email', label: '邮箱' },
        // {
        //   props: 'disable',
        //   label: '禁用状态',
        //   render: (params) => {
        //     if (params.disable != 0) {
        //       return '禁用'
        //     } else {
        //       return '启用'
        //     }
        //   },
        // },
        {
          prop: 'registerState',
          label: '注册状态',
          render: (params) => {
            if (params.registerState == 0) {
              return '已审核'
            } else {
              return '未审核'
            }
          },
        },
      ],
      tableOption: {
        label: '操作',
        width: '200',
        options: [
          {
            label: '重置密码',
            type: 'text',
            methods: 'resetPass',
          },
          // {
          //   label: '编辑',
          //   type: 'text',
          //   methods: 'edit',
          // },
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
    this.getCompanyData()
    this.handleSearch()
  },
  methods: {
    /**
     * 查询公司列表
     */
    getCompanyData() {
      getCompanyList({
        name: '',
        pageNum: 1,
        pageSize: 1000,
      }).then((res) => {
        if (res.success) {
          const { total, list } = res.data
          const arr = list.map((item) => {
            return { label: item.name, value: item.code }
          })
          this.searchForm[0].options = arr
        }
      })
    },
    /**
     * 查询列表
     */
    handleSearch() {
      const { userOrgName, companyName } = this.formInline
      const { currentPage, size } = this.page
      let params = {
        userOrgName,
        companyName,
        pageNo: currentPage,
        pageSize: size,
      }
      getCompanyUser(params).then((res) => {
        if (res.success) {
          const { total, list } = res.data
          const arr = list.map((item) => {
            item.passwordType = 'password'
            return item
          })
          this.tableData = arr
          this.page.total = total
        }
      })
    },
    /** 密码显示隐藏 */
    showPwd(row, index) {
      if (row.passwordType === 'password') {
        row.passwordType = ''
      } else {
        row.passwordType = 'password'
      }
    },
    handleButton(method, data, row, index) {
      if (method === 'edit') {
        //编辑
        this.userCompanyDialog.show = true
        this.userCompanyDialog.type = 'edit'

        this.userCompanyDialog.row = row
      } else if (method === 'delete') {
        this.handleDelete(data, row, index)
      } else if (method == 'resetPass') {
        //重置密码
        this.handleResetPassword(row.id)
      }
    },
    /**
     * 重置密码
     */
    handleResetPassword(id) {
      resetCompanyPassword({ userId: id }).then((res) => {
        if (res.success) {
          this.$message.success('重置密码成功')
          this.handleSearch()
        }
      })
    },
    /** 删除用户 */
    handleDelete(data, row, index) {
      this.$confirm(
        `此操作将彻底删除${row.userOrgName}用户, 继续吗？`,
        '提示',
        {
          cancelButtonClass: 'btn-custom-cancel',
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          delCompanyUser({ id: row.id }).then((res) => {
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
.userManage {
  .show-pwd {
    cursor: pointer;
  }
  /deep/.pawwordInput .el-input__inner {
    border: 1px solid #fff;
    text-align: center;
  }
}
</style>
