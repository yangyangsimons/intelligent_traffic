import React, { useEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import styles from './index.module.scss'
import btnDetails from 'assets/image/btn-details.png'
import { setAllTexts } from 'stores/storesNewUI/junctionOptSlice'
import OptText from 'components/rights/OptText/OptText'
// 展示型组件：数据来自 junctionOpt slice
export default function JunctionOpt() {
  //控制OptText是否需要显示,点击details的按钮才显示和隐藏
  const [showOptText, setShowOptText] = useState(false)
  const toggleOptText = () => {
    setShowOptText(!showOptText)
  }
  const { previousPlanText, currentPlanText, optimizeResultText } = useSelector(
    (state) => state.junctionOpt
  )
  const dispatch = useDispatch()

  useEffect(() => {
    const handleJunctionOptChanged = (event) => {
      console.log('junctionOptChanged', event.detail)
      dispatch(setAllTexts(event.detail))
    }

    window.addEventListener('junctionOptChanged', handleJunctionOptChanged)

    return () => {
      window.removeEventListener('junctionOptChanged', handleJunctionOptChanged)
    }
  }, [dispatch])

  return (
    <div className={styles.junctionOptstrategy}>
      <header className={styles.title} onClick={toggleOptText}>
        <span>信控优化策略</span>
        <img className={styles.details} src={btnDetails} alt='' />
      </header>
      <main>
        <div className={styles.preStrategy}>
          <div className={styles.preStrategyTitle}>
            <span className={styles.dot}></span>
            <span className={styles.text}>原有配时方案</span>
          </div>
          <div className={styles.content}>{previousPlanText}</div>
        </div>
        <div className={styles.currentStrategy}>
          <div className={styles.currentStrategyTitle}>
            <span className={styles.dot}></span>
            <span className={styles.text}>当前绿波方案</span>
          </div>
          <div className={styles.content}>
            {currentPlanText.split('\n').map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        </div>
        <div className={styles.optResult}>
          <div className={styles.optResultTitle}>
            <span className={styles.dot}></span>
            <span className={styles.text}>绿波优化效果</span>
          </div>
          <div className={styles.content}>{optimizeResultText}</div>
        </div>
      </main>
      {showOptText && <OptText onClose={() => setShowOptText(false)} />}
    </div>
  )
}
