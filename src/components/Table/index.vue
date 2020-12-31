<template>
  <div class="tableContainer">
    <el-table
      v-el-height-adaptive-table="{bottomOffset:70}"
      highlight-current-row
      size="medium"
      stripe
      row-key="id"
      height="650"
      :header-cell-style="{'background-color': '#ecf5ff'}"
      :data="tableData"
      style="width:100%;"
    >
      <el-table-column
        v-for="(col, index) in rowHeader"
        :key="index"
        :prop="col.prop"
        :label="col.label"
        :sortable="col.sort"
        :min-width="col.width"
        :formatter="col.formatter"
      >
        <template slot-scope="scope">
          <span v-if="col.render">{{ col.render(scope.row) }}</span>
          <span v-else>{{ scope.row[col.prop] }}</span>
        </template>
      </el-table-column>
      <slot name="pass" />
      <el-table-column
        v-if="tableOption.label"
        :min-width="tableOption.width"
        :width="tableOption.width"
        :label="tableOption.label"
        align="center"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-for="(item,index) in tableOption.options"
            :key="index"
            :style="item.style"
            :type="item.type"
            :icon="item.icon"
            size="mini"
            @click.native.stop="handleButton(item.methods,tableData,scope.row,scope.$index)"
          >{{ item.label }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 是否调用分页 -->
    <el-pagination
      v-if="isHidden"
      background
      class="tablePage"
      layout="total, sizes,prev, pager, next, jumper"
      :page-size="pageObj.size"
      :page-sizes="pageObj.pageSizes"
      :total="pageObj.total"
      :current-page="pageObj.currentPage"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
    />
  </div>
</template>
<script>
import elHeightAdaptiveTable from '@/directive/el-table/index.js'
export default {
  directives: {
    elHeightAdaptiveTable,
  },
  props: {
    isHidden: {
      type: Boolean,
      default: true,
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      },
    },
    rowHeader: {
      type: Array,
      default: () => {
        return []
      },
    },
    tableOption: {
      type: Object,
      default: () => {
        return {}
      },
    },
    pageObj: {
      type: Object | Boolean,
      default: () => {
        return {
          size: 10,
          total: 0,
          pageSizes: [10, 50, 100, 200],
          currentPage: 1,
        }
      },
    },
  },
  data() {
    return {}
  },
  mounted() {},
  methods: {
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleButton(method, data, row, index) {
      this.$emit('handleButton', method, data, row, index)
    },
  },
}
</script>
<style lang="scss" scoped>
.tableContainer {
  position: relative;
}
.tablePage {
  margin-top: 10px;
}
</style>
