import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './index.module.scss'
import { setAllOptstrategyText } from 'stores/storesNewUI/junctionOptstrategySlice'
import OptGraph from '../OptGraph/OptGraph'
// 展示：路口信控优化策略三段文字
// 文本来自 redux: state.junctionOptstrategy.{previousStr,currentOptr,result}
export default function OptText({ onClose }) {
  const { previousStr, currentStr, result } = useSelector(
    (state) => state.junctionOptstrategy
  )

  const dispatch = useDispatch()
  const [metric, setMetric] = useState('averageThroughput')

  // 在这里监听选择框，如果选择的值发生了变化，通过事件通知外部（不再内置默认数据）

  useEffect(() => {
    const handleJunctionOptstrategyChanged = (event) => {
      console.log('junctionOptstrategyChanged', event.detail)
      dispatch(setAllOptstrategyText(event.detail))
    }

    window.addEventListener(
      'junctionOptstrategyChanged',
      handleJunctionOptstrategyChanged
    )

    return () => {
      window.removeEventListener(
        'junctionOptstrategyChanged',
        handleJunctionOptstrategyChanged
      )
    }
  }, [dispatch])

  // 选择框变化 -> 调用全局 window.optSelectChanged 传递对应数据
  const handleMetricChange = (e) => {
    const value = e.target.value
    setMetric(value)
    // 告知外部当前指标变化，不附带任何默认数据
    if (typeof window !== 'undefined') {
      if (typeof window.optMetricChanged === 'function') {
        window.optMetricChanged({ metric: value })
      } else {
        try {
          const evt = new CustomEvent('optMetricChanged', {
            detail: { metric: value },
          })
          window.dispatchEvent(evt)
        } catch (err) {
          console.warn('optMetricChanged dispatch failed', err)
        }
      }
    }
  }

  // 不再初始化发送任何默认数据，外部将通过事件推送实际数据

  // 支持换行显示（若字符串中包含 \n）
  const renderMultiline = (text) =>
    text.split('\n').map((line, idx) => (
      <span key={idx}>
        {line}
        {idx !== text.split('\n').length - 1 && <br />}
      </span>
    ))

  return (
    <div className={styles.junctionOptstrategy}>
      <header>
        信控优化策略
        <button
          type='button'
          aria-label='关闭'
          className={styles.closeBtn}
          onClick={() => onClose && onClose()}
        >
          ×
        </button>
      </header>

      <main>
        <div className={styles.currentStrategy}>
          <div className={styles.currentStrategyTitle}>
            <span className={styles.dot}></span>
            <span className={styles.text}>当前方案</span>
          </div>
          <div className={styles.content}>{renderMultiline(currentStr)}</div>
        </div>
        <div className={styles.optResult}>
          <div className={styles.optResultTitle}>
            <span className={styles.dot}></span>
            <span className={styles.text}>协调效果跟踪</span>
            <div className={styles.controlItem}>
              <span className={styles.label}>交通指标选择</span>
              <select
                className={styles.selectBox}
                name='metric'
                value={metric}
                onChange={handleMetricChange}
              >
                <option value='averageThroughput'>平均每分钟吞吐量</option>
                <option value='carLine'>车辆排队长度</option>
                <option value='delayTime'>平均延误时间</option>
              </select>
            </div>
          </div>
          <div className={styles.content}>{renderMultiline(result)}</div>
        </div>
      </main>
      <footer>
        <OptGraph></OptGraph>
      </footer>
    </div>
  )
}
