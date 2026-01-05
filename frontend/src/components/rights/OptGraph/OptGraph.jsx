import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import * as echarts from 'echarts'
import { useDispatch } from 'react-redux'
import { setOptSelectSeries } from 'stores/storesNewUI/optselectSlice.js'

// 固定的时间标签（默认值）
const DEFAULT_TIME_LABELS = [
  '旺龙路与尖山路',
  '旺龙路与青山路',
  '青山路与尖山路',
  '望青路与青山路',
  '岳麓大道与旺龙路',
  '岳麓大道与麓谷大道',
]

export default function OptGraph() {
  const dispatch = useDispatch()
  // 缓存：按指标键保存数据，支持切换回来后恢复
  const dataCacheRef = useRef({})
  const [metricKey, setMetricKey] = useState('averageThroughput')
  const [seriesData, setSeriesData] = useState({
    current: [],
    weekly: [],
    timeLabels: DEFAULT_TIME_LABELS,
  })

  // 监听速度数据事件（新的 optSelectChanged）；兼容旧的 lightTimerChanged 仅带 series 的情况
  useEffect(() => {
    const handleSpeedChange = (event) => {
      // 兼容多种入参格式：
      // 1) { averageThroughput: { current, weekly, timeLabels }, carLine: {...}, delayTime: {...} } - 对象格式批量传入
      // 2) { key: 'averageThroughput', data: { current, weekly, timeLabels }, activate?: true } - 单个指标
      // 3) { averageThroughput: { current, weekly, timeLabels } } - 旧格式兼容

      const detail = event.detail || {}

      // 判断是否为对象格式批量传入
      const isBatchFormat =
        !('key' in detail) &&
        Object.keys(detail).some(
          (k) =>
            ['averageThroughput', 'carLine', 'delayTime'].includes(k) &&
            typeof detail[k] === 'object'
        )

      if (isBatchFormat) {
        // 批量处理所有指标数据
        let hasCurrentMetric = false
        Object.keys(detail).forEach((key) => {
          if (typeof detail[key] === 'object' && detail[key] !== null) {
            const payload = detail[key]
            // 数据对比，避免无意义更新
            const cached = dataCacheRef.current[key]
            const isSameData =
              cached &&
              JSON.stringify(cached.current) ===
                JSON.stringify(payload.current) &&
              JSON.stringify(cached.weekly) === JSON.stringify(payload.weekly)

            if (!isSameData) {
              dataCacheRef.current[key] = {
                current: Array.isArray(payload.current) ? payload.current : [],
                weekly: Array.isArray(payload.weekly) ? payload.weekly : [],
                timeLabels:
                  Array.isArray(payload.timeLabels) &&
                  payload.timeLabels.length > 0
                    ? payload.timeLabels
                    : DEFAULT_TIME_LABELS,
              }
            }

            if (key === metricKey) {
              hasCurrentMetric = true
              if (!isSameData) {
                setSeriesData(dataCacheRef.current[key])
              }
            }
          }
        })
        return
      }

      // 单个指标处理（兼容旧格式）
      let key
      let payload
      if ('key' in detail) {
        key = detail.key
        payload = detail.data || {}
      } else {
        key = Object.keys(detail)[0]
        payload = detail[key] || {}
      }

      // 数据对比，避免无意义更新
      const cached = dataCacheRef.current[key]
      const isSameData =
        cached &&
        JSON.stringify(cached.current) === JSON.stringify(payload.current) &&
        JSON.stringify(cached.weekly) === JSON.stringify(payload.weekly)

      if (!isSameData) {
        // 缓存数据（归一化为数组）
        dataCacheRef.current[key] = {
          current: Array.isArray(payload.current) ? payload.current : [],
          weekly: Array.isArray(payload.weekly) ? payload.weekly : [],
          timeLabels:
            Array.isArray(payload.timeLabels) && payload.timeLabels.length > 0
              ? payload.timeLabels
              : DEFAULT_TIME_LABELS,
        }
      }

      const shouldActivate = !!(window?.optAutoSwitchMetric || detail?.activate)
      // 如果是当前指标，或需要自动切换到该指标，立即更新图表
      if (key === metricKey || shouldActivate) {
        if (shouldActivate && key !== metricKey) setMetricKey(key)
        if (!isSameData) {
          setSeriesData(dataCacheRef.current[key])
        }
      }
      // 同步到 redux（如果全局其他地方依赖）
      if (!isSameData) {
        dispatch(setOptSelectSeries(payload))
      }
    }
    const handleMetricChanged = (event) => {
      const key = event.detail?.metric
      if (!key) return
      setMetricKey(key)
      // 切换指标时，用缓存填充；没有则清空等待数据
      const cached = dataCacheRef.current[key]
      if (cached) setSeriesData(cached)
      else
        setSeriesData({
          current: [],
          weekly: [],
          timeLabels: DEFAULT_TIME_LABELS,
        })
    }
    window.addEventListener('optSelectChanged', handleSpeedChange)
    window.addEventListener('optMetricChanged', handleMetricChanged)

    return () => {
      window.removeEventListener('optSelectChanged', handleSpeedChange)
      window.removeEventListener('optMetricChanged', handleMetricChanged)
    }
  }, [dispatch, metricKey])

  // 绘图
  useEffect(() => {
    const barEl = document.getElementById('speedbarchart1')

    if (!barEl) return
    const barChart = echarts.init(barEl)

    // 单位解析：允许外部覆盖 window.optUnits
    // - 字符串：统一单位
    // - 对象：按指标键映射 { averageThroughput: '单位：辆/分钟', carLine: '单位：km' }
    // - 函数：(metricKey) => '单位：xxx'
    const resolveUnit = (key) => {
      const defaults = {
        averageThroughput: '单位：辆/分钟',
        carLine: '单位：km',
        delayTime: '单位：分钟',
      }
      let unit = defaults[key] || '单位：分钟'
      const conf = window?.optUnits
      if (!conf) return unit
      if (typeof conf === 'string') return conf
      if (typeof conf === 'function') {
        try {
          return conf(key) || unit
        } catch {
          return unit
        }
      }
      if (typeof conf === 'object') return conf[key] || unit
      return unit
    }

    const barGraphOption = {
      // 禁用所有动画效果，避免更新时的闪动
      animation: false,
      title: {
        text: resolveUnit(metricKey),
        textStyle: { color: '#FFF', fontSize: 13, fontWeight: 'normal' },
      },
      legend: {
        show: true,
        data: ['优化前', '优化后'],
        textStyle: { color: '#FFF' },
        top: 0,
        right: 0,
      },
      xAxis: {
        type: 'category',
        data: seriesData.timeLabels,
        axisLine: { lineStyle: { color: '#ccc' } },
        // 取消旋转，居中显示，支持自动换行（通过替换空格或-为换行）
        axisLabel: {
          rotate: 0,
          interval: 0, // 强制全部显示
          color: '#FFF',
          align: 'center',
          width: 60, // 控制换行宽度
          overflow: 'break', // ECharts v5 支持
          lineHeight: 18,
          fontSize: 14,
          formatter: (value) => {
            if (typeof value !== 'string') return value
            // 优先按空格/短横拆分，其次在过长时手动插入换行
            let v = value.replace(/[\s\-]+/g, '\n')
            if (v.length > 12 && !v.includes('\n')) {
              // 简单强制分段
              const mid = Math.floor(v.length / 2)
              v = v.slice(0, mid) + '\n' + v.slice(mid)
            }
            return v
          },
        },
      },
      yAxis: {
        type: 'value',
        axisLine: { lineStyle: { color: '#ccc' } },
        axisTick: { show: true, length: 5 },
        splitNumber: 3,
        splitLine: { lineStyle: { color: '#777' } },
        splitArea: {
          show: true,
          areaStyle: { color: ['rgba(56,67,87,0.1)', 'rgba(56,67,87,0.1)'] },
        },
      },
      grid: { left: '8%', right: '4%', bottom: '15%', containLabel: true },
      series: [
        {
          name: '优化前',
          data: seriesData.current,
          type: 'bar',
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: '#00F2FF20' },
            { offset: 1, color: '#00F2FF' },
          ]),
          barWidth: '15%',
        },
        {
          name: '优化后',
          data: seriesData.weekly,
          type: 'bar',
          color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
            { offset: 0, color: '#0EFFB020' },
            { offset: 1, color: '#0EFFB0' },
          ]),
          barWidth: '15%',
        },
      ],
    }

    // notMerge:false 避免重新初始化图表，lazyUpdate:true 延迟更新减少闪动
    barChart.setOption(barGraphOption, { notMerge: false, lazyUpdate: true })

    return () => {
      barChart.dispose()
    }
  }, [seriesData, metricKey])

  return (
    <div className={styles.trafficVolume}>
      {/* <div className={styles.title}>
        <span>交通速度 </span>
      </div> */}
      <div className={styles.contentContainer}>
        <div className={styles.chartContainer}>
          <div
            id='speedbarchart1'
            style={{ width: '100%', height: '320px' }}
          ></div>
        </div>
      </div>
    </div>
  )
}
