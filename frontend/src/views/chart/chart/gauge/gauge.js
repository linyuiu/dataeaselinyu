import { componentStyle } from '../common/common'
import { hexColorToRGBA } from '@/views/chart/chart/util'
import { DEFAULT_THRESHOLD } from '@/views/chart/chart/chart'

export function baseGaugeOption(chart_option, chart) {
  // 处理shape attr
  let customAttr = {}
  if (chart.customAttr) {
    customAttr = JSON.parse(chart.customAttr)
    if (customAttr.color) {
      chart_option.color = customAttr.color.colors
    }
    // tooltip
    if (customAttr.tooltip) {
      const tooltip = JSON.parse(JSON.stringify(customAttr.tooltip))
      const reg = new RegExp('\n', 'g')
      tooltip.formatter = tooltip.formatter.replace(reg, '<br/>')
      chart_option.tooltip = tooltip
    }
  }
  // 处理data
  if (chart.data) {
    chart_option.title.text = chart.title
    if (chart.data.series.length > 0) {
      chart_option.series[0].name = chart.data.series[0].name
      // size
      if (customAttr.size) {
        chart_option.series[0].min = customAttr.size.gaugeMin
        chart_option.series[0].max = customAttr.size.gaugeMax
        chart_option.series[0].startAngle = customAttr.size.gaugeStartAngle
        chart_option.series[0].endAngle = customAttr.size.gaugeEndAngle
      }
      // detail
      if (customAttr.label) {
        const label = JSON.parse(JSON.stringify(customAttr.label))
        chart_option.series[0].detail.show = label.show
        chart_option.series[0].detail.fontSize = label.fontSize
        chart_option.series[0].detail.color = label.color
        chart_option.series[0].detail.formatter = label.gaugeFormatter
      }
      chart_option.series[0].type = 'gauge'
      // color
      chart_option.series[0].itemStyle = {
        color: hexColorToRGBA(customAttr.color.colors[0], customAttr.color.alpha)
      }
      // data只取第一个
      const y = {
        // name: chart.data.x[0],
        name: chart.data.series[0].name,
        value: chart.data.series[0].data[0]
      }
      chart_option.series[0].data.push(y)
      // threshold
      if (chart.senior) {
        const range = []
        const senior = JSON.parse(chart.senior)
        const threshold = JSON.parse(JSON.stringify(senior.threshold ? senior.threshold : DEFAULT_THRESHOLD))
        if (threshold.gaugeThreshold && threshold.gaugeThreshold !== '') {
          const arr = threshold.gaugeThreshold.split(',')
          for (let i = 0; i < arr.length; i++) {
            const ele = arr[i]
            const p = parseInt(ele) / 100
            range.push([p, hexColorToRGBA(customAttr.color.colors[i % 9], customAttr.color.alpha)])
          }

          range.push([1, hexColorToRGBA(customAttr.color.colors[arr.length % 9], customAttr.color.alpha)])
          chart_option.series[0].axisLine = {
            lineStyle: {
              color: range
            }
          }

          chart_option.series[0].itemStyle = {
            color: 'auto'
          }
          chart_option.series[0].progress = {
            show: false
          }
          chart_option.series[0].axisTick = {
            lineStyle: {
              color: 'auto'
            }
          }
          chart_option.series[0].splitLine = {
            lineStyle: {
              color: 'auto'
            }
          }
          chart_option.series[0].axisLabel = {
            color: 'auto'
          }
        }
      }
    }
  }
  // console.log(chart_option);
  componentStyle(chart_option, chart)
  return chart_option
}
