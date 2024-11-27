import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from '../css/optimiseOverview.module.scss';
import { ReactComponent as UP } from 'assets/icon/icon-up.svg';
import { ReactComponent as DOWN } from 'assets/icon/icon-down.svg';
import { ReactComponent as TriangleIcon } from 'assets/icon/icon-triangle.svg';
import { setOptimiseOverview } from 'stores/digitalTwin/optimiseOverviewSlice';

export default function OptimiseOverview() {
    const dispatch = useDispatch();

    // Get data from Redux store
    const averageDelay = useSelector((state) => state.optimiseOverview.averageDelay);
    const congestionMileage = useSelector((state) => state.optimiseOverview.congestionMileage);
    const averageSpeed = useSelector((state) => state.optimiseOverview.averageSpeed);

    // Direction states
    const [delayDirection, setDelayDirection] = useState('down');
    const [mileageDirection, setMileageDirection] = useState('down');
    const [speedDirection, setSpeedDirection] = useState('up');

    // Refs to keep track of previous values
    const prevAverageDelayRef = useRef(averageDelay);
    const prevCongestionMileageRef = useRef(congestionMileage);
    const prevAverageSpeedRef = useRef(averageSpeed);

    useEffect(() => {
        const handleOptimiseOverviewChanged = (event) => {
            console.log('OptimiseOverview Changed:', event.detail);
            dispatch(setOptimiseOverview(event.detail));
        };

        window.addEventListener('optimiseOverviewChanged', handleOptimiseOverviewChanged);

        return () => {
            window.removeEventListener('optimiseOverviewChanged', handleOptimiseOverviewChanged);
        };
    }, [dispatch]);

    useEffect(() => {
        // Compare averageDelay
        if (averageDelay > prevAverageDelayRef.current) {
            setDelayDirection('up');
        } else if (averageDelay < prevAverageDelayRef.current) {
            setDelayDirection('down');
        }
        prevAverageDelayRef.current = averageDelay;

        // Compare congestionMileage
        if (congestionMileage > prevCongestionMileageRef.current) {
            setMileageDirection('up');
        } else if (congestionMileage < prevCongestionMileageRef.current) {
            setMileageDirection('down');
        }
        prevCongestionMileageRef.current = congestionMileage;

        // Compare averageSpeed
        if (averageSpeed > prevAverageSpeedRef.current) {
            setSpeedDirection('up');
        } else if (averageSpeed < prevAverageSpeedRef.current) {
            setSpeedDirection('down');
        }
        prevAverageSpeedRef.current = averageSpeed;
    }, [averageDelay, congestionMileage, averageSpeed]);

    return (
        <div className={styles.optimise}>
            <div className={styles.title}>信号优化总览</div>
            <header className={styles.header}>
                <span>
                    <TriangleIcon />
                    优化效果
                </span>
                <div className={styles.buttonGroup}>
                    <button className={styles.activeBtn}>自动优化</button>
                    <button className={styles.button}>人工优化</button>
                </div>
            </header>
            <div className={styles.optimiseContainer}>
                <div className={styles.item}>
                    <span className={styles.number}>
                        {averageDelay} min {delayDirection === 'up' ? <UP /> : <DOWN />}
                    </span>
                    <span className={styles.text}>平均延误</span>
                </div>
                <div className={styles.item}>
                    <span className={styles.number}>
                        {congestionMileage}% {mileageDirection === 'up' ? <UP /> : <DOWN />}
                    </span>
                    <span className={styles.text}>拥堵里程</span>
                </div>
                <div className={styles.item}>
                    <span className={styles.number}>
                        {averageSpeed}% {speedDirection === 'up' ? <UP /> : <DOWN />}
                    </span>
                    <span className={styles.text}>平均速度</span>
                </div>
            </div>
        </div>
    );
}