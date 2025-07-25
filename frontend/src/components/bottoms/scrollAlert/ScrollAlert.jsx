import React, { useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import alert from 'assets/image/alert.png'

export default function TrafficRank() {
  // 生成今天内的随机时间
  const generateRandomTimeToday = () => {
    const now = new Date()
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const randomMs = Math.floor(Math.random() * now.getTime() - today.getTime())
    const randomTime = new Date(today.getTime() + randomMs)
    return randomTime.toLocaleTimeString('zh-CN', { hour12: false }).slice(0, 5) // 格式: HH:MM
  }

  const staticListItems = [
    {
      name: '逆行',
      position: 'G60 k987',
      number: '沪A12345',
      status: '极高',
      isAlert: '是',
      isDeal: '否',
      speed: '0',
      time: generateRandomTimeToday(),
    },
    {
      name: '异常停车',
      position: 'G60 k987',
      number: '湘A19B155',
      status: '高',
      isAlert: '是',
      isDeal: '否',
      speed: '20',
      time: generateRandomTimeToday(),
    },
    {
      name: '超高速',
      status: '高',
      position: 'G60 k984',
      number: '湘A91812',
      isAlert: '是',
      isDeal: '否',
      speed: '120',
      time: generateRandomTimeToday(),
    },
    {
      name: '超低速',
      status: '普通',
      position: 'G60 k988',
      number: '湘E6L123',
      isAlert: '否',
      isDeal: '否',
      speed: '10',
      time: generateRandomTimeToday(),
    },
    {
      name: '占用应急车道',
      status: '普通',
      position: 'G60 k985',
      number: '湘A8L877',
      isAlert: '否',
      isDeal: '否',
      speed: '30',
      time: generateRandomTimeToday(),
    },
  ]

  const scrollContainer = useRef(null)
  const [currentItem, setCurrentItem] = useState(null)

  useEffect(() => {
    const startAutoScroll = () => {
      const scrollAmount = 2.5 // Adjust for faster/slower scrolling

      const interval = setInterval(() => {
        const container = scrollContainer.current
        if (container) {
          // When you've scrolled to the end of the original content, reset to the top
          if (container.scrollTop >= container.scrollHeight / 2) {
            container.scrollTop = 0 // Set to start without user noticing
          } else {
            container.scrollTop += scrollAmount
          }
        }
      }, 300) // Adjust the interval for faster/slower scrolling

      return interval
    }

    const intervalId = startAutoScroll()

    const highStatusItems = staticListItems.filter(
      (item) => item.status === '极高' || item.status === '高'
    )

    // 函数：随机选择一个对象
    const getRandomItem = () => {
      const randomIndex = Math.floor(Math.random() * highStatusItems.length)
      return highStatusItems[randomIndex]
    }

    // 设置初始显示的对象
    setCurrentItem(getRandomItem())

    // 每 3 秒钟更新一次显示的对象
    const randomItemIntervalId = setInterval(() => {
      setCurrentItem(getRandomItem())
    }, 3000)

    // 清除定时器
    return () => {
      clearInterval(intervalId)
      clearInterval(randomItemIntervalId)
    }
  }, [])

  const renderList = staticListItems.map((item, index) => {
    return (
      <div className={styles.listItem} key={index}>
        <span className={styles.rank}>{index + 1}</span>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.positionText}>{item.position}</span>
        <span className={styles.number}>{item.number}</span>
        <span
          className={`${styles.isAlert} ${
            item.isAlert === '是' ? styles.alertYes : styles.alertNo
          }`}
        >
          {item.isAlert}
        </span>
        <span
          className={`${styles.isDeal} ${
            item.isDeal === '是' ? styles.dealYes : styles.dealNo
          }`}
        >
          {item.isDeal}
        </span>
        <span className={styles.speed}>{item.speed} km/h</span>
        <span className={styles.time}>{item.time}</span>
        <span
          className={`${styles.status} ${
            item.status.includes('极')
              ? styles.red
              : item.status.includes('高')
              ? styles.yellow
              : styles.green
          }`}
        >
          {item.status}
        </span>
      </div>
    )
  })

  if (!currentItem) {
    return <div>加载中...</div>
  }

  return (
    <div className={styles.trafficViolationContainer}>
      <div className={styles.title}>
        <span>实时告警信息</span>
      </div>
      <div className={styles.emergency}>
        <img className={styles.gif} src={alert} alt='' />
        <span
          className={styles.alertText}
        >{`${currentItem.name}   ${currentItem.position}   ${currentItem.status} `}</span>
      </div>
      <div className={styles.mainContent}>
        <div className={styles.rankContianer}>
          <span>序号</span>
          <span className={styles.violationName}>类型</span>
          <span className={styles.violationPosition}>位置</span>
          <span className={styles.violationNumber}>车牌号</span>
          <span className={styles.violationAlert}>报警</span>
          <span className={styles.violationDeal}>处理</span>
          <span className={styles.violationSpeed}>车速</span>
          <span className={styles.violationTime}>发生时间</span>
          <span>告警级别</span>
        </div>
        <div className={styles.listContainer} ref={scrollContainer}>
          {renderList}
          {/* {renderList} */}
        </div>
      </div>
    </div>
  )
}
