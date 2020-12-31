<template>
  <el-dialog
    title="查看历史"
    :visible.sync="historyRow.show"
    width="40%"
    :close-on-click-modal="false"
    @close="handleClose"
  >
    <searchForm
      :search-data="formInline"
      :search-form="searchForm"
      :labelWidth="labelWidth"
      :search-handle="searchHandle"
    />
    <div
      id="hisChart"
      style="height:500px;width:100%;"
    />
  </el-dialog>
</template>
<script>
import searchForm from '@/components/searchForm/index'
import echarts from 'echarts'
import { parseTime } from '@/utils/index'
import { getDevHistory } from '@/api/devManage'
export default {
  props: ['historyRow'],
  components: { searchForm },
  data() {
    return {
      labelWidth: '80px',
      formInline: {
        beginTime: '',
        endTime: '',
        step: '0',
        pageNum: 1,
        pageSize: 10000,
      },
      chart: null,
      seriesData: [],
      searchForm: [
        {
          label: '开始时间',
          type: 'DateTime',
          prop: 'beginTime',
          width: 180,
          placeholder: '开始时间',
          change: (row) => {},
        },
        {
          label: '结束时间',
          type: 'DateTime',
          prop: 'endTime',
          width: 180,
          placeholder: '结束时间',
          change: (row) => {},
        },
        // {
        //   type: 'Select',
        //   prop: 'step',
        //   options: [
        //     { label: '秒', value: '0' },
        //     { label: '分', value: '1' },
        //     { label: '小时', value: '2' },
        //     { label: '天', value: '3' },
        //   ],
        //   width: 80,
        //   placeholder: '选择步长',
        //   change: (row) => {},
        // },
      ],
      searchHandle: [
        {
          label: '查询',
          type: 'primary',
          handle: () => {
            this.handleSearch()
          },
        },
      ],
    }
  },
  mounted() {
    let curDate = new Date()
    var preDate = new Date(curDate.getTime() - 24 * 60 * 60 * 1000) //前一天
    var nextDate = new Date(curDate.getTime() + 24 * 60 * 60 * 1000) //后一天

    this.formInline.beginTime = parseTime(preDate, '{y}-{m}-{d} {h}:{i}:{s}')
    this.formInline.endTime = parseTime(nextDate, '{y}-{m}-{d} {h}:{i}:{s}')
    this.handleSearch()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    handleClose() {
      this.$emit('close')
    },
    handleSearch() {
      const { productCode, equipmentName, key } = this.historyRow.row
      this.formInline.projectCode = productCode
      this.formInline.equipmentName = equipmentName
      this.formInline.fields = `deviceName,${key}`
      getDevHistory(this.formInline).then((res) => {
        if (res.success) {
          let data = res.data
          this.seriesData = data.flat()
          this.initChart(key)
        }
      })
    },
    initChart(property) {
      this.chart = echarts.init(document.getElementById('hisChart'))
      let legendData =
        this.seriesData.length == 0 ? [] : this.seriesData[0].deviceName
      let xData = this.seriesData.map((item) => {
        const date = parseTime(new Date(item.time), '{y}-{m}-{d} {h}:{i}')
        return date
      })
      let yData = this.seriesData.map((item) => {
        return item[property]
      })
      this.chart.setOption({
        title: {
          top: 20,
          text: '',
          textStyle: {
            fontWeight: 'normal',
            fontSize: 16,
            color: '#444',
          },
          left: '1%',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            lineStyle: {
              color: '#57617B',
            },
          },
        },
        legend: {
          top: 20,
          icon: 'rect',
          itemWidth: 14,
          itemHeight: 5,
          itemGap: 13,
          data: [legendData],
          right: '4%',
          textStyle: {
            fontSize: 12,
            color: '#333',
          },
        },
        grid: {
          top: 100,
          left: '8%',
          right: '8%',
          bottom: '2%',
          containLabel: true,
        },
        xAxis: [
          {
            type: 'category',
            boundaryGap: false,
            axisLine: {
              lineStyle: {
                color: '#57617B',
              },
            },
            data: xData,
          },
        ],
        yAxis: [
          {
            type: 'value',
            axisTick: {
              show: false,
            },
            axisLine: {
              show: false,
            },
            splitLine: {
              show: true,
              lineStyle: {
                color: ['#000'],
                opacity: 0.06,
              },
            },
          },
        ],
        series: [
          {
            name: legendData,
            type: 'line',
            symbol: 'circle',
            symbolSize: 5,
            showSymbol: false,
            lineStyle: {
              normal: {
                width: 1,
              },
            },
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(
                  0,
                  0,
                  0,
                  1,
                  [
                    {
                      offset: 0,
                      color: 'rgba(0, 136, 212, 0.3)',
                    },
                    {
                      offset: 0.8,
                      color: 'rgba(0, 136, 212, 0)',
                    },
                  ],
                  false
                ),
                shadowColor: 'rgba(0, 0, 0, 0.1)',
                shadowBlur: 10,
              },
            },
            itemStyle: {
              normal: {
                color: 'rgb(0,136,212)',
                borderColor: 'rgba(0,136,212,0.2)',
                borderWidth: 12,
              },
            },
            data: yData,
          },
        ],
      })
    },
  },
}
</script>
<style lang="scss" scoped>
/deep/.el-date-editor.el-input {
  width: 190px;
}
</style>