<template>
  <div class="app-container devAttribute">
    <div class="header-title clearfix">
      <i class="el-icon-back icon_back" @click="handleGoBack"></i>
      <span>{{ devInfo.equipmentName }}</span>
    </div>
    <div class="attribute-main">
      <el-row :gutter="20" v-if="attributeList.length > 0">
        <el-col :span="6" v-for="(item, index) in attributeList" :key="index">
          <el-card>
            <div class="top-card-title">
              <span class="title">{{ item.name }}</span>
              <span class="btn-view" @click="handleHistoryView(item)"
                >查看数据</span
              >
            </div>
            <div class="middle-card-value">
              {{ item.value }}
            </div>
            <div class="bottom-card-time">
              {{ item.time | parseTime("{y}-{m}-{d} {h}:{i}") }}
            </div>
          </el-card>
        </el-col>
      </el-row>
      <div v-else class="no-scope">暂无数据</div>
    </div>
    <!-- 点击查看历史 -->
    <historyDialog
      v-if="historyDialog.show"
      :historyRow="historyDialog"
      @close="historyDialog.show = false"
    ></historyDialog>
  </div>
</template>
<script>
import { getProductFunction } from "@/api/product";
import { parseTime } from "@/utils/index";
import { getDevList } from "@/api/devManage";
import historyDialog from "./components/historyChart";
import moment from "moment"; //导入文件
export default {
  name: "devAttribute",
  components: { historyDialog },
  data() {
    return {
      form: { productCode: "", name: "" },
      devInfo: {},
      attributeList: [],
      historyDialog: {
        //历史查询
        show: false,
        row: {}
      }
    };
  },
  mounted() {
    this.init(); //初始化
  },
  methods: {
    init() {
      const { productCode, companyCode, SN } = this.$route.query;
      this.form.productCode = productCode;
      this.form.name = SN;
      this.form.companyCode = companyCode;
      this.getInfo();
    },
    async getInfo() {
      let param = { ...this.form, pageSize: 1000, pageNum: 1 };
      const data = await getDevList(param);
      if (data.success) {
        if (data.data != null) {
          const list = data.data.list;
          this.devInfo = list[0];
          this.getProductInfo();
        }
      }
    },
    getProductInfo() {
      getProductFunction({ productId: this.devInfo.productCode }).then(res => {
        if (res.success) {
          let arr = res.data;
          let result = [];
          let obj = this.devInfo;
          for (let key in obj) {
            let param = {};
            for (let i = 0; i < arr.length; i++) {
              if (key === arr[i].identifier) {
                param = {
                  key: key,
                  name: arr[i].name,
                  value: obj[key],
                  time: this.$route.query.date,
                  equipmentName: obj.equipmentName,
                  projectCode: obj.productCode
                };
                result.push(param);
              }
            }
          }
          this.attributeList = result;
        }
      });
    },
    /**返回上一页 */
    handleGoBack() {
      this.$router.go(-1);
    },
    /**
     * 点击查看历史
     */
    handleHistoryView(row) {
      this.historyDialog.show = true;
      this.historyDialog.row = { ...this.form, ...row };
    }
  }
};
</script>
<style lang="scss" scoped>
.devAttribute {
  width: 100%;
  height: calc(100vh - 140px);
  .header-title {
    height: 50px;
    line-height: 50px;
    .icon_back {
      color: #373d41;
      font-size: 22px;
      margin-right: 10px;
      vertical-align: -3px;
      cursor: pointer;
    }
    span {
      font-size: 24px;
      font-weight: 600;
    }
  }
  .attribute-main {
    padding: 0 20px;
    font-size: 14px;
    /deep/.el-col-6 {
      margin-top: 20px;
    }
    .top-card-title {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      .title {
        // font-size: 16px;
      }
      .btn-view {
        color: rgb(24, 144, 255);
        cursor: pointer;
      }
    }
    .middle-card-value {
      margin-top: 20px;
      font-size: 20px;
      height: 30px;
      line-height: 30px;
      font-weight: 700;
    }
    .bottom-card-time {
      margin-top: 20px;
      color: #666;
    }
  }
  .no-scope {
    color: #999;
    min-height: 200px;
    line-height: 200px;
    width: 100%;
    text-align: center;
  }
}
</style>
