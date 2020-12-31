<template>
  <div class="demo">
    <el-select v-model="value1" multiple placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      />
    </el-select>
    <!-- <div
      id="container"
      style="width:700px;height:500px;"
    ></div> -->
  </div>
</template>
<script>
// import { Line } from '@antv/g2plot'
export default {
  data() {
    return {
       value1: [],
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄',
        },
        {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄',
        },
        {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄',
        },
        {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄',
        },
      ],
      linePlot: null,
    }
  },
  mounted() {
    let o = {
        a: "foo",
        b: 12,
        c: "bar"
    }
    // let { a, ...passthrough } = o
    // console.error(a,passthrough,'1hhhahahaa')
    
    // const {a:newName,b:newName1}=o
    // console.error(newName,newName1,'123')
    // this.initChart()
  },
  methods: {
    initChart() {
      const dataArr = [
        { year: '2020-09-20 12:00', value: 3, type: '测试1' },
        { year: '2020-09-20 12:01', value: 4, type: '测试1' },
        { year: '2020-09-20 12:02', value: 3.5, type: '测试1' },
        { year: '2020-09-20 12:03', value: 5, type: '测试1' },
        { year: '2020-09-20 12:04', value: 4.9, type: '测试1' },
        { year: '2020-09-20 12:05', value: 6, type: '测试1' },
        { year: '2020-09-20 12:06', value: 7, type: '测试1' },
        { year: '2020-09-20 12:07', value: 9, type: '测试1' },
        { year: '2020-09-20 12:08', value: 13, type: '测试1' },
        { year: '2020-09-20 12:09', value: 3, type: '测试1' },
        { year: '2020-09-20 13:00', value: 4, type: '测试1' },
        { year: '2020-09-20 14:00', value: 3.5, type: '测试1' },
        { year: '2020-09-20 15:03', value: 5, type: '测试1' },
        { year: '2020-09-20 16:03', value: 4.9, type: '测试1' },
        { year: '2020-09-20 17:05', value: 6, type: '测试1' },
        { year: '2020-09-20 12:06', value: 7, type: '测试2' },
        { year: '2020-09-20 12:07', value: 9, type: '测试2' },
        { year: '2020-09-20 12:08', value: 13, type: '测试2' },
        { year: '2020-09-20 12:00', value: 3, type: '测试2' },
        { year: '2020-09-20 12:01', value: 4, type: '测试2' },
        { year: '2020-09-20 12:01', value: 3.5, type: '测试2' },
        { year: '2020-09-20 12:03', value: 5, type: '测试2' },
        { year: '2020-09-20 12:03', value: 4.9, type: '测试2' },
        { year: '2020-09-20 12:05', value: 6, type: '测试2' },
        { year: '2020-09-20 12:06', value: 7, type: '测试2' },
        { year: '2020-09-20 12:07', value: 9, type: '测试2' },
        { year: '2020-09-20 12:08', value: 13, type: '测试2' },
        { year: '2020-09-20 12:00', value: 3, type: '测试2' },
        { year: '2020-09-20 12:01', value: 4, type: '测试2' },
        { year: '2020-09-20 12:01', value: 3.5, type: '测试2' },
        { year: '2020-09-20 12:03', value: 5, type: '测试2' },
        { year: '2020-09-20 12:03', value: 4.9, type: '测试2' },
        { year: '2020-09-20 12:05', value: 6, type: '测试2' },
        { year: '2020-09-20 12:06', value: 7, type: '测试2' },
        { year: '2020-09-20 12:07', value: 9, type: '测试2' },
        { year: '2020-09-20 12:08', value: 13, type: '测试2' },
        { year: '2020-09-20 12:00', value: 3, type: '测试2' },
        { year: '2020-09-20 12:01', value: 4, type: '测试2' },
        { year: '2020-09-20 12:01', value: 3.5, type: '测试2' },
        { year: '2020-09-20 12:03', value: 5, type: '测试2' },
        { year: '2020-09-20 12:03', value: 4.9, type: '测试2' },
        { year: '2020-09-20 12:05', value: 6, type: '测试2' },
        { year: '2020-09-20 12:06', value: 7, type: '测试2' },
        { year: '2020-09-20 12:07', value: 9, type: '测试2' },
        { year: '2020-09-20 12:08', value: 13, type: '测试2' },

        { year: '2020-09-21 12:00', value: 3, type: '测试1' },
        { year: '2020-09-21 12:01', value: 4, type: '测试1' },
        { year: '2020-09-21 12:02', value: 3.5, type: '测试1' },
        { year: '2020-09-22 12:03', value: 5, type: '测试1' },
        { year: '2020-09-22 12:04', value: 4.9, type: '测试1' },
        { year: '2020-09-23 12:05', value: 6, type: '测试1' },
        { year: '2020-09-24 12:06', value: 7, type: '测试1' },
        { year: '2020-09-24 12:07', value: 9, type: '测试1' },
        { year: '2020-09-25 12:08', value: 13, type: '测试1' },
        { year: '2020-09-25 12:09', value: 3, type: '测试1' },
        { year: '2020-09-26 13:00', value: 4, type: '测试1' },
        { year: '2020-09-27 14:00', value: 3.5, type: '测试1' },
        { year: '2020-09-28 15:03', value: 5, type: '测试1' },
        { year: '2020-09-29 16:03', value: 4.9, type: '测试1' },
        { year: '2020-09-23 17:05', value: 6, type: '测试1' },
        { year: '2020-09-24 12:06', value: 7, type: '测试2' },
        { year: '2020-09-26 12:07', value: 9, type: '测试2' },
        { year: '2020-09-27 12:08', value: 13, type: '测试2' },
        { year: '2020-09-24 12:00', value: 3, type: '测试2' },
        { year: '2020-09-25 12:01', value: 4, type: '测试2' },
        { year: '2020-09-26 12:01', value: 3.5, type: '测试2' },
        { year: '2020-09-27 12:03', value: 5, type: '测试2' },
        { year: '2020-09-29 12:03', value: 4.9, type: '测试2' },
        { year: '2020-09-27 12:05', value: 6, type: '测试2' },
        { year: '2020-09-29 12:06', value: 7, type: '测试2' },
        { year: '2020-09-24 12:07', value: 9, type: '测试2' },
        { year: '2020-09-21 12:08', value: 13, type: '测试2' },
        { year: '2020-09-20 12:00', value: 3, type: '测试2' },
        { year: '2020-09-23 12:01', value: 4, type: '测试2' },
        { year: '2020-09-26 13:01', value: 3.5, type: '测试2' },
        { year: '2020-09-27 10:03', value: 5, type: '测试2' },
        { year: '2020-09-28 11:03', value: 4.9, type: '测试2' },
        { year: '2020-09-22 12:05', value: 6, type: '测试2' },
        { year: '2020-09-22 12:06', value: 7, type: '测试2' },
        { year: '2020-09-22 12:07', value: 9, type: '测试2' },
        { year: '2020-09-23 13:08', value: 13, type: '测试2' },
        { year: '2020-09-23 13:00', value: 3, type: '测试2' },
        { year: '2020-09-24 14:01', value: 4, type: '测试2' },
        { year: '2020-09-26 15:01', value: 3.5, type: '测试2' },
        { year: '2020-09-27 16:03', value: 5, type: '测试2' },
        { year: '2020-09-28 17:03', value: 4.9, type: '测试2' },
        { year: '2020-09-29 18:05', value: 6, type: '测试2' },
        { year: '2020-09-24 11:06', value: 7, type: '测试2' },
        { year: '2020-09-23 10:07', value: 9, type: '测试2' },
        { year: '2020-09-22 12:08', value: 13, type: '测试2' },
      ]

      let data = dataArr.sort(function (a, b) {
        if (a.year < b.year) {
          return -1
        } else if (a.year == b.year) {
          return 0
        } else {
          return 1
        }
      })
      this.linePlot = new Line('container', {
        data,
        padding: 'auto',
        xField: 'year',
        yField: 'value',
        seriesField: 'type',
        legend: {
          position: 'top-center',
          text: {
            style: {
              fontSize: 14,
              fill: '#333',
            },
          },
        },
        // xAxis: {
        //   type: 'dateTime',
        //   tickCount: 5,
        // },
        tooltip: {
          containerTpl:
            '<div class="g2-tooltip">' +
            '<p class="g2-tooltip-title"></p>' +
            '<table class="g2-tooltip-list"></table>' +
            '</div>', // tooltip的外层模板
          itemTpl:
            '<tr class="g2-tooltip-list-item"><td class="g2-tooltip-list-td" style="color:{color}">{name} :</td><td>{value}</td></tr>',
        },
        slider: {
          start: 0,
          // end: 0.5,
        },
      })

      this.linePlot.render()
    },
  },
}
</script>
<style lang="scss" scoped>
.demo {
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.g2-tooltip-title {
  font-size: 14px;
}
.g2-tooltip-list {
  padding: 0 0 12px 0 !important;
}
.g2-tooltip-list-item {
  line-height: 20px !important;
  font-size: 14px;
}
</style>