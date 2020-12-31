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
           <span v-if="scope.row.disable != 0" style="color:red;">禁用</span>
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
      v-if="userDialog.show"
      :isShow="userDialog.show"
      :type="userDialog.type"
      :dialogRow="userDialog.row"
      @close="userDialog.show=false"
      @refeshTable="handleSearch"
    ></addUserDialog>
  </div>
</template>
<script>
import searchForm from '@/components/searchForm/index'
import bTable from '@/components/Table/index'
import { getUserList, delUser, resetPassword } from '@/api/user'
import addUserDialog from './components/addOrEditDialog'
export default {
  name: 'UserManage',
  components: { searchForm, bTable, addUserDialog },
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
      userDialog: {
        show: false,
        type: 'add',
        row: {},
      },
      searchForm: [
        {
          type: 'Input',
          prop: 'name',
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
            this.page.currentPage=1
            this.handleSearch()
          },
        },
        {
          label: '添加',
          type: 'primary',
          plain: true,
          handle: () => {
            this.userDialog.show = true
            this.userDialog.type = 'add'
          },
        },
      ],
      tableData: [],
      tableHeader: [
        { prop: 'name', label: '姓名' },
        { prop: 'sex', label: '性别' },
        { prop: 'email', label: '邮箱' },
        { prop: 'telephone', label: '电话' },
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
     * 查询列表
     */
    handleSearch() {
      const { currentPage, size } = this.page
      this.formInline.pageNum = currentPage
      this.formInline.pageSize = size
      getUserList(this.formInline).then((res) => {
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
        this.userDialog.show = true
        this.userDialog.type = 'edit'
        this.userDialog.row = row
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
      resetPassword({ userId: id }).then((res) => {
        if (res.success) {
          this.$message.success('重置密码成功')
          this.handleSearch()
        }
      })
    },
    /** 删除用户 */
    handleDelete(data, row, index) {
      this.$confirm(`此操作将彻底删除${row.name}用户, 继续吗？`, '提示', {
        cancelButtonClass: 'btn-custom-cancel',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          delUser({ userId: row.id }).then((res) => {
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
