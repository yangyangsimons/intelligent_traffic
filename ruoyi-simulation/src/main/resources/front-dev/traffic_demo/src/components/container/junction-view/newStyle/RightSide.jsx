import React from 'react';
import styles from './css/rightSide.module.scss';
import LightControl from './LightControl';
import JunctionInfo from './JunctionInfo';
import ControlStrategy from './ControlStrategy';
import TimeProgress from './TimeProgress';
export default function rightSide() {

    return (
        <section className={styles.rightSide}>
            <JunctionInfo />
            <ControlStrategy />
            <LightControl />
            <TimeProgress />
        </section >

    )
}
