import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'

import btnDetails from 'assets/image/btn-example.png'
import { useSelector, useDispatch } from 'react-redux'
import OptText from 'components/rights/OptText/OptText'
import {
  setGreenSettingList,
  clearGreenSetting,
} from 'stores/storesNewUI/greenSettingSlice'
import { setVideoShow } from 'stores/storesNewUI/videoShowSlice'
export default function GreenSetting() {
  const dispatch = useDispatch()
  const listItems = useSelector((state) => state.greenSetting?.listItems || [])
  const scrollContainer = useRef(null)
  //控制OptText是否需要显示,点击details的按钮才显示和隐藏
  const [showOptText, setShowOptText] = useState(false)
  const toggleOptText = () => {
    setShowOptText(!showOptText)
  }
  //控制视频显示隐藏
  const videoShow = useSelector((state) => state.videoShow.videoShow)
  const handleVideoToggle = () => {
    dispatch(setVideoShow(!videoShow))
  }
  useEffect(() => {
    const handleUpdate = (event) => {
      const detail = event.detail
      console.log('greenSettingDataChanged detail =>', detail)
      if (Array.isArray(detail)) {
        // Replace entire list
        dispatch(setGreenSettingList(detail))
        console.log('greenSetting list replaced')
      } else {
        console.warn('Unsupported greenSetting payload:', detail)
      }
    }

    window.addEventListener('greenSettingDataChanged', handleUpdate)

    return () => {
      window.removeEventListener('greenSettingDataChanged', handleUpdate)
    }
  }, [dispatch])

  // Helper: check if text contains the character '绿'
  const hasGreen = (val) => typeof val === 'string' && val.includes('绿')

  const getStatusClass = (status) => {
    if (!status || typeof status !== 'string') return styles.green
    if (status.includes('极')) return styles.red
    if (status.includes('高')) return styles.yellow
    return styles.green
  }

  const renderList = listItems.map((item, index) => {
    return (
      <div className={styles.listItem} key={index}>
        <span className={styles.rank}>{index + 1}</span>
        <span className={styles.name}>{item?.name ?? '—'}</span>
        <span className={styles.positionText}>{item?.direction ?? '—'}</span>
        <span
          className={[styles.number, hasGreen(item?.phase1) ? styles.green : '']
            .filter(Boolean)
            .join(' ')}
        >
          {item?.phase1 ?? '—'}
        </span>
        <span
          className={[styles.alert, hasGreen(item?.phase2) ? styles.green : '']
            .filter(Boolean)
            .join(' ')}
        >
          {item?.phase2 ?? '—'}
        </span>
        <span
          className={[styles.deal, hasGreen(item?.phase3) ? styles.green : '']
            .filter(Boolean)
            .join(' ')}
        >
          {item?.phase3 ?? '—'}
        </span>
        <span
          className={[styles.speed, hasGreen(item?.phase4) ? styles.green : '']
            .filter(Boolean)
            .join(' ')}
        >
          {item?.phase4 ?? '—'}
        </span>
        <span className={styles.time}>{item?.diff ?? '—'}</span>
      </div>
    )
  })

  return (
    <div className={styles.trafficViolationContainer}>
      <div className={styles.title} onClick={handleVideoToggle}>
        <span>绿波道路设置</span>
        <img className={styles.details} src={btnDetails} alt='' />
      </div>

      <div className={styles.mainContent}>
        <div className={styles.rankContianer}>
          <span>序号</span>
          <span className={styles.violationName}>绿波路口</span>
          <span className={styles.violationPosition}>绿波通行方向</span>
          <span className={styles.violationNumber}>阶段一</span>
          <span className={styles.violationAlert}>阶段二</span>
          <span className={styles.violationDeal}>阶段三</span>
          <span className={styles.violationSpeed}>阶段四</span>
          <span className={styles.violationTime}>与上一个路口相位差</span>
        </div>
        <div className={styles.listContainer} ref={scrollContainer}>
          {renderList}
        </div>
      </div>
      {showOptText && <OptText onClose={() => setShowOptText(false)} />}
    </div>
  )
}
