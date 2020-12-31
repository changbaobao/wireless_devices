<template>
  <div class="app-container devManage">
    <div class="top-search">
      <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item>
          <el-select
            v-model="formInline.productCode"
            placeholder="选择产品"
            @change="handleProductChange"
          >
            <el-option
              v-for="item in productOptions"
              :key="item.productCode"
              :label="item.name"
              :value="item.productCode"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="formInline.companyCode"
            placeholder="选择公司"
            clearable
            @change="handleCompanyChange"
          >
            <el-option
              v-for="item in companyOptions"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="formInline.name"
            placeholder="请输入设备名称进行搜索"
            style="width:200px;"
          >
            <i
              class="el-icon-search"
              slot="suffix"
              style="display: inline-block;line-height: 32px;margin-right: 5px;cursor:pointer;font-size: 16px;"
              @click="handleCompanyChange"
            >
            </i>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-select
            v-model="formInline.systemTag"
            placeholder="选择平台标签"
            clearable
            @change="handleSearch"
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
        <!-- <el-form-item> -->
        <el-button type="primary" @click="handleAddOrEdit('add')"
          >添加</el-button
        >
        <el-button type="primary" plain @click="handleAll(0)"
          >绑定/解绑</el-button
        >
        <el-button type="primary" plain @click="handleAll(1)"
          >批量修改</el-button
        >
        <el-button type="primary" plain @click="handleAll(2)"
          >批量标签</el-button
        >
        <span style="display:inline-block;margin:0 10px;">
          <el-upload
            :headers="myHeaders"
            :http-request="submitUpload"
            action=""
            :show-file-list="false"
          >
            <el-button type="success">导入</el-button>
          </el-upload>
        </span>

        <el-button type="success" plain @click="downTemplate"
          >下载模板</el-button
        >
        <el-button type="success" plain @click="handleAll(4)">导出</el-button>
        <!-- </el-form-item> -->
      </el-form>
    </div>
    <div class="table">
      <el-table
        :data="tableData"
        stripe
        ref="table"
        height="650"
        v-el-height-adaptive-table="{ bottomOffset: 80 }"
        size="medium"
        :header-cell-style="{ 'background-color': '#ecf5ff' }"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"> </el-table-column>
        <el-table-column
          label="设备名称"
          prop="equipmentName"
          width="140"
          sortable
        ></el-table-column>
        <!-- 动态属性 -->
        <el-table-column
          v-for="item in tableTitle"
          :key="item.prop"
          :label="item.label"
        >
          <template slot-scope="scope">
            <el-tooltip
              class="item"
              v-if="item.label == 'IMEI码'"
              effect="dark"
              :content="scope.row[item.prop] + ''"
              placement="top-start"
            >
              <span v-html="stateFormat(scope.row, item.prop)">{{
                scope.row[item.prop]
              }}</span>
            </el-tooltip>
            <el-tooltip
              class="item"
              v-else-if="item.label == 'SIM卡号'"
              effect="dark"
              :content="scope.row[item.prop] + ''"
              placement="top-start"
            >
              <span v-html="stateFormat(scope.row, item.prop)">{{
                scope.row[item.prop]
              }}</span>
            </el-tooltip>
            <span
              v-else-if="item.label == '温度' || item.label == '湿度'"
              v-html="fixFormat(scope.row, item.prop)"
              >{{ scope.row[item.prop] }}</span
            >
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="140" align="center">
          <template slot-scope="scope">
            {{ scope.row.dt | parseTime("{y}-{m}-{d} {h}:{i}") }}
          </template>
        </el-table-column>
        <el-table-column label="平台标签" width="200px" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="(tag, index) in scope.row.platformTag"
              :key="index"
              closable
              style="margin:0 5px 5px 0;"
              @close="handleClose(tag, index, scope.row, 'platformTag')"
            >
              {{ tag }}
            </el-tag>
            <span v-if="scope.row.inputSystemVisible" class="tagSelect">
              <el-select
                v-model="scope.row.inputSystemValue"
                placeholder="请选择"
                size="mini"
                style="min-width:100px;"
                class="input-new-tag"
              >
                <el-option
                  v-for="item in scope.row.tagSystemOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
              <el-button
                class="button-new-tag"
                size="mini"
                @click="
                  handleInputConfirm(
                    scope.$index,
                    scope.row,
                    'inputSystemValue',
                    'platformTag',
                    'inputSystemVisible'
                  )
                "
                >确定</el-button
              >
            </span>
            <el-button
              v-else
              class="button-new-tag"
              size="mini"
              style="padding:6px 8px;"
              icon="el-icon-plus"
              @click="scope.row.inputSystemVisible = true"
            ></el-button>
          </template>
        </el-table-column>

        <el-table-column
          label="公司名称"
          prop="name"
          align="center"
        ></el-table-column>

        <el-table-column label="公司标签" width="200px" align="center">
          <template slot-scope="scope">
            <el-tag
              v-for="(tag, index) in scope.row.companyTag"
              :key="tag"
              closable
              style="margin:0 5px 5px 0;"
              @close="handleClose(tag, index, scope.row, 'companyTag')"
            >
              {{ tag }}
            </el-tag>
            <span v-if="scope.row.companyCode">
              <span v-if="scope.row.inputVisible" class="tagSelect">
                <el-select
                  v-model="scope.row.inputValue"
                  placeholder="请选择"
                  size="mini"
                  clearable
                  style="min-width:100px;"
                  class="input-new-tag"
                >
                  <el-option
                    v-for="item in scope.row.tagCompanyOptions"
                    :key="item"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
                <el-button
                  class="button-new-tag"
                  size="mini"
                  @click="
                    handleInputConfirm(
                      scope.$index,
                      scope.row,
                      'inputValue',
                      'companyTag',
                      'inputVisible'
                    )
                  "
                  >确定</el-button
                >
              </span>
              <el-button
                v-else
                class="button-new-tag"
                size="mini"
                style="padding:6px 8px;"
                icon="el-icon-plus"
                @click="handleCompanyTagAdd(scope.row)"
              ></el-button>
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" align="center" width="150" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click.stop="handleAddOrEdit('data', scope.$index, scope.row)"
              >数据</el-button
            >
            <el-button
              type="text"
              v-if="scope.row.companyCode && scope.row.companyCode !== ''"
              @click.stop="handleBind(scope.$index, scope.row)"
              >解绑</el-button
            >
            <el-button
              type="text"
              v-else
              @click.stop="handleBind(scope.$index, scope.row)"
              >绑定</el-button
            >
            <el-button
              type="text"
              style="color:red;"
              @click.stop="handleDelete(scope.$index, scope.row, data)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div class="tablePage">
        <el-pagination
          background
          class="tablePage"
          layout="total, sizes,prev, pager, next, jumper"
          :page-size="page.size"
          :page-sizes="page.pageSizes"
          :total="page.total"
          :current-page="page.currentPage"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <!-- 添加或编辑弹框 -->
    <addOrEidtDialog
      v-if="addOrEdit.show"
      @close="addOrEdit.show = false"
      :addOrEdit="addOrEdit"
    ></addOrEidtDialog>
    <!-- 批量修改弹框 -->

    <!-- 批量绑定解绑 -->
    <bindingDialog
      v-if="allBindDialog.show"
      :prodCode="formInline.productCode"
      :bindingRow="allBindDialog"
      @close="allBindDialog.show = false"
    ></bindingDialog>

    <!-- 批量标签 -->
    <allTagsDialog
      v-if="allTagsDialog.show"
      :allTagsRow="allTagsDialog"
      @close="allTagsDialog.show = false"
    ></allTagsDialog>

    <!-- 批量修改 -->
    <allEidtParams
      v-if="eidtParamsDialog.show"
      :allEidtRow="eidtParamsDialog"
      @close="eidtParamsDialog.show = false"
    >
    </allEidtParams>
  </div>
</template>
<script>
import {
  exportTemplate,
  delDevList,
  getDevList,
  addTags,
  delTags,
  getAllTags,
  getAllCompanyTags,
  allExport,
  unBindAllDev,
  devExport
} from "@/api/devManage";
import { getProductData } from "@/api/product";
import { getCompanyList } from "@/api/company";
import elHeightAdaptiveTable from "@/directive/el-table/index.js";
import {
  bindingDialog,
  allTagsDialog,
  addOrEidtDialog,
  allEidtParams
} from "./components";

import { parseTime } from "@/utils/index";
import { getProductFunction } from "@/api/product";
export default {
  name: "devManage",
  components: { bindingDialog, allTagsDialog, allEidtParams, addOrEidtDialog },
  directives: {
    elHeightAdaptiveTable
  },
  data() {
    return {
      myHeaders: { token: this.$store.state.token },
      productOptions: [], //产品列表
      companyOptions: [], //公司列表
      systemTagOptions: [], //平台标签列表
      productFunctionList: [], //产品功能
      formInline: {
        productCode: "", //产品编码
        companyCode: "", //公司编码
        systemTag: "", //公司标签
        name: ""
      },
      multipleSelection: [],
      tableTitle: [], //动态表头
      tableData: [],
      page: {
        size: 10,
        currentPage: 1,
        pageSizes: [10, 20, 50, 100],
        total: 0
      },
      addOrEdit: {
        //添加设备
        show: false,
        type: "add",
        row: {}
      },
      allTagsDialog: { show: false, row: {}, selectList: [] },
      allBindDialog: {
        //批量绑定
        show: false,
        row: {},
        selectList: []
      },
      eidtParamsDialog: {
        //批量修改
        show: false,
        selectList: []
      }
    };
  },
  created() {
    this.getCompany(); //获取公司
    this.init(); //初始化
  },
  /* 监听table数据对象 */
  watch: {
    tableData(val) {
      this.doLayout();
    }
  },
  methods: {
    stateFormat(row, property) {
      let pro = row[property];
      if (pro) {
        let str = pro.toString();
        let restr = str.substring(str.length - 5, str.length);
        return restr;
      } else {
        return "";
      }
    },
    fixFormat(row, property) {
      let val = row[property];
      if (val) {
        return val.toFixed(2);
      } else {
        return val;
      }
    },
    /* 重新渲染table组件 */
    doLayout() {
      let that = this;
      this.$nextTick(() => {
        that.$refs.table.doLayout();
      });
    },
    /**导入 */
    submitUpload(item) {
      const { productCode } = this.formInline;
      if (productCode == "") return this.$message.error("请选择产品");
      let formData = new FormData();
      formData.append("productCode", productCode);
      formData.append("excelFile", item.file);
      allExport(formData).then(res => {
        if (res.success) {
          this.$message.success(res.msg);
        }
      });
    },
    async init() {
      const code = await this.getProduct();
      await this.getTagsList(); //平台标签
      await this.getProductFun(); //产品功能
      await this.handleSearch();
    },
    getProduct() {
      //查询产品
      return new Promise(resolve => {
        getProductData({ pageNum: 1, pageSize: 1000 }).then(res => {
          if (res.success) {
            const { list } = res.data;
            this.productOptions = list;
            this.formInline.productCode =
              list && list.length !== 0 ? list[0].productCode : "";
            resolve(list[0].productCode);
          }
        });
      });
    },
    getCompany() {
      //查询公司
      getCompanyList({ name: "", pageNum: 1, pageSize: 1000 }).then(res => {
        if (res.success) {
          const { list } = res.data;
          let st = [{ code: 1, name: "全部" }];
          this.companyOptions = [...st, ...list];
        }
      });
    },
    getProductFun() {
      // 查询产品功能
      return new Promise(resolve => {
        getProductFunction({ productId: this.formInline.productCode }).then(
          res => {
            if (res.success) {
              this.productFunctionList = res.data;
              resolve(res.data);
            }
          }
        );
      });
    },
    /**产品发生改变 */
    async handleProductChange(val) {
      await this.getTagsList();
      await this.getProductFun();
      this.page.currentPage = 1;
      this.page.size = 10;
      await this.handleSearch();
    },
    handleCompanyChange() {
      this.page.currentPage = 1;
      this.page.size = 10;
      this.handleSearch();
    },
    /**公司标签添加 */
    async handleCompanyTagAdd(row) {
      row.inputVisible = true;
      const { companyTag, companyCode } = row;
      const tagData = await this.getCompanyTags(companyCode);
      let diffCom = tagData.filter(function(val) {
        return companyTag.indexOf(val) === -1;
      });

      row.tagCompanyOptions = [...new Set(diffCom)];
    },
    /**
     * 获取公司所有标签
     */
    getCompanyTags(code) {
      return new Promise(resolve => {
        getAllCompanyTags({
          productCode: this.formInline.productCode,
          companyCode: code
        }).then(res => {
          if (res.success) {
            let data = res.data;
            const arr = data.map(item => {
              return item.labelName;
            });
            this.companyTagOptions = arr;
            resolve(arr);
          }
        });
      });
    },
    // 获取平台标签列表
    getTagsList() {
      return new Promise(resolve => {
        getAllTags({
          productCode: this.formInline.productCode,
          pageNo: 1,
          pageSize: 1000
        }).then(res => {
          if (res.success) {
            const { list } = res.data;
            const arr = list.map(item => {
              return item.labelName;
            });
            this.systemTagOptions = arr;
            resolve(arr);
          }
        });
      });
    },
    /**查询 */
    async handleSearch() {
      const { size, currentPage } = this.page;
      const { data: res } = await getDevList({
        ...this.formInline,
        pageNum: currentPage,
        pageSize: size
      });
      const tagsPlat = this.systemTagOptions; //平台全部标签
      const list = res.list;

      const result = list.map(item => {
        const tagCompany = item.companyTag ? JSON.parse(item.companyTag) : [];
        const tagSystem = item.platformTag ? JSON.parse(item.platformTag) : [];
        item.companyTag = tagCompany;
        item.platformTag = tagSystem;

        let diff = tagsPlat.filter(function(val) {
          return tagSystem.indexOf(val) === -1;
        });

        return {
          ...item,
          tagSystemOptions: diff,
          tagCompanyOptions: [],
          inputValue: "",
          inputVisible: false,
          inputSystemValue: "",
          inputSystemVisible: false
        };
      });
      this.tableData = result;
      this.getTitleList();
      this.page.total = res.total;
    },
    getTitleList() {
      let titleArr = [];
      this.productFunctionList.map(ele => {
        this.tableData.map(item => {
          for (let key in item) {
            if (ele.identifier === key) {
              titleArr.push({ label: ele.name, prop: key });
            }
          }
        });
      });

      let obj = {};
      let peon = titleArr.reduce((cur, next) => {
        obj[next.label] ? "" : (obj[next.label] = true && cur.push(next));
        return cur;
      }, []); //设置cur默认类型为数组，并且初始值为空的数组

      this.tableTitle = peon;
    },
    /**表格选中值 */
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleCurrentChange(val) {
      this.page.currentPage = val;
      this.handleSearch();
    },
    handleSizeChange(val) {
      this.currentPage = 1;
      this.page.size = val;
      this.handleSearch();
    },
    /**批量解绑或绑定 */
    handleAll(index) {
      if (this.multipleSelection.length == 0 && index !== 4)
        return this.$message.error("请勾选要操作的设备列表");
      if (index == 0) {
        this.allBindDialog.show = true;
        this.allBindDialog.type = "all";
        this.allBindDialog.selectList = this.multipleSelection;
        //批量解绑绑定
      } else if (index == 1) {
        //批量修改
        this.eidtParamsDialog.show = true;
        this.eidtParamsDialog.selectList = this.multipleSelection;
      } else if (index == 2) {
        // 批量标签
        this.allTagsDialog.show = true;
        this.allTagsDialog.selectList = this.multipleSelection;
        const { productCode, companyCode } = this.formInline;
        this.allTagsDialog.row = { productCode, companyCode };
      } else if (index == 4) {
        //导出
        this.$store.commit("app/SET_ISPOP", true);
        const { productCode, companyCode } = this.formInline;
        devExport({ productCode, companyCode, symbol: 0 }).then(response => {
          const disposition = response.headers["content-disposition"];
          let fileName = disposition.substring(
            disposition.indexOf("filename=") + 9,
            disposition.length
          );
          // iso8859-1的字符转换成中文
          // fileName = decodeURI(escape(fileName))
          // console.error(fileName,'123123123')
          this.download(response.data, "设备.csv");
          this.$store.commit("app/SET_ISPOP", false);
        });
      }
    },
    /**
     * 下载模板
     */
    downTemplate() {
      this.$store.commit("app/SET_ISPOP", true);
      exportTemplate().then(res => {
        this.download(res.data, "模板.csv");
        this.$store.commit("app/SET_ISPOP", false);
      });
    },
    // 下载文件
    download(data, fileName) {
      if (!data) {
        return;
      }
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(
        new Blob([data], { type: "application/octet-stream;charset=utf-8" })
      );
      link.download = fileName;
      link.click();
      //释放内存
      window.URL.revokeObjectURL(link.href);
    },
    /**单个绑定 */
    handleBind(index, row) {
      const text = row.companyCode && row.companyCode !== "" ? "解绑" : "绑定";
      this.$confirm(
        `确定要${text}设备：${row.equipmentName}, 继续吗？`,
        "提示",
        {
          cancelButtonClass: "btn-custom-cancel",
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          if (text == "绑定") {
            //绑定
            this.allBindDialog.show = true;
            this.allBindDialog.type = "one";
            this.allBindDialog.row = row;
          } else {
            //解绑

            unBindAllDev({ equipmentName: [row.equipmentName] }).then(res => {
              if (res.success) {
                this.$message.success(res.msg);
                this.handleSearch();
              }
            });
          }
        })
        .catch(() => {});
    },
    // 点击数据
    handleAddOrEdit(type, index, row) {
      if (type == "data") {
        this.$router.push({
          name: "devAttribute",
          query: {
            productCode: row.productCode,
            companyCode: this.formInline.companyCode,
            SN: row.equipmentName,
            date: row.dt
          }
        });
      } else if (type == "add") {
        const { productCode, companyCode } = this.formInline;
        if (productCode == "") return this.$message.error("请选择产品");
        this.addOrEdit.show = true;
        this.addOrEdit.type = "add";
        this.addOrEdit.row = { productCode, companyCode };
      }
    },
    /**标签点击确定添加 */
    handleInputConfirm(index, row, property, property1, property2) {
      let inputValue = row[property];
      if (inputValue == "") {
        //如果没有值直接隐藏，有值添加
        row[property2] = false;
        return;
      }
      let data = row[property1];
      let params = { equipmentName: row.equipmentName };
      if (property1 == "companyTag") {
        params.companyLabel = inputValue;
      } else {
        params.platformLabel = inputValue;
      }
      addTags(params).then(res => {
        if (res.success) {
          this.$message.success("添加标签成功");
          data.push(inputValue);
          this.handleSearch();
        }
      });
      row[property2] = false;
      row[property] = "";
    },
    /**
     * 删除公司/平台标签
     */
    handleClose(tag, index, row, property) {
      let data = row[property];
      const params = {
        equipmentName: row.equipmentName
      };
      if (property == "companyTag") {
        params.companyLabel = tag;
      } else {
        params.platformLabel = tag;
      }
      delTags(params).then(res => {
        if (res.success) {
          this.$message.success("删除标签成功");
          data.splice(index, 1);
        }
      });
    },
    /**删除 */
    handleDelete(index, row, data) {
      this.$confirm(`此操作将彻底删除${row.equipmentName}, 继续吗？`, "提示", {
        cancelButtonClass: "btn-custom-cancel",
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delDevList({ equipmentName: row.equipmentName }).then(res => {
            if (res.success) {
              this.$message({
                type: "success",
                message: "删除成功!"
              });
              this.handleSearch();
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.devManage {
  .table {
    margin-top: 18px;
  }
  .tablePage {
    margin-top: 10px;
  }
  .input-new-tag {
    // width: 100px;
  }
  .tagSelect {
    display: flex;
    flex-direction: row;
    /deep/.el-button--mini {
      padding: 7px 8px;
      margin-left: 5px;
    }
  }
}
</style>
