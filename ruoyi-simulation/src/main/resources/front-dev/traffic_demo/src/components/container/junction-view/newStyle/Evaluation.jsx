import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './css/evaluation.module.scss';
import { setEvaluationData } from 'stores/junctionLight/evaluationSlice';

export default function Evaluation() {
  const dispatch = useDispatch();
  const { peakHourFlow, twelveHourFlow, position, content } = useSelector((state) => state.evaluation);

  useEffect(() => {
    const handleEvaluationDataChanged = (event) => {
      console.log('Evaluation Data Changed:', event.detail);
      // event.detail应为{ peakHourFlow: number, twelveHourFlow: number, position: string, content: string }
      dispatch(setEvaluationData(event.detail));
    };

    window.addEventListener('evaluationDataChanged', handleEvaluationDataChanged);

    return () => {
      window.removeEventListener('evaluationDataChanged', handleEvaluationDataChanged);
    };
  }, [dispatch]);

  return (
    <div className={styles.evaluation}>
      <div className={styles.title}>
        <span>效果评价</span>
      </div>
      <div className={styles.dataContainer}>
        <span className={styles.onRoadCar}>拥堵指数<span className={styles.number}>{peakHourFlow}</span> 车次/时</span>
        <span className={styles.capacity}>12小时流量 <span className={styles.number}>{twelveHourFlow}</span> 车次</span>
      </div>
      <div className={styles.optimiseRecord}>
        <span className={styles.recordTitle}>优化记录</span>
        <div className={styles.recordContainer}>
          <span className={styles.rank}></span>
          <div className={styles.contentContainer}>
            <span className={styles.position}>位置：{position}</span>
            <span className={styles.content}>详情：{content}</span>
          </div>
        </div>
      </div>
    </div>
  );
}