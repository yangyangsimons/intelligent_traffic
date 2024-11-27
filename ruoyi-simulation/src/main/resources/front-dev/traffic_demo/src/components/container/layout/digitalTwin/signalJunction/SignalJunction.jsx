// SignalJunction.js

import React, { useEffect, useState, useRef } from 'react';
import styles from '../css/signalJunction.module.scss';
import { ReactComponent as UP } from 'assets/icon/icon-up.svg';
import { ReactComponent as DOWN } from 'assets/icon/icon-down.svg';
import { useSelector, useDispatch } from 'react-redux';
import { setListItems } from 'stores/digitalTwin/signalJunctionSlice';

export default function SignalJunction() {
    const dispatch = useDispatch();

    // Get listItems from Redux store
    const listItems = useSelector((state) => state.signalJunction.listItems);

    // State to store listItems with changes
    const [listItemsWithChanges, setListItemsWithChanges] = useState([]);

    // useRef to store previous listItems for comparison
    const prevListItemsRef = useRef([]);

    // Event listener to update listItems in Redux
    useEffect(() => {
        const handleSignalJunctionDataChanged = (event) => {
            console.log('SignalJunction Data Changed:', event.detail);
            dispatch(setListItems(event.detail));
        };

        window.addEventListener('signalJunctionDataChanged', handleSignalJunctionDataChanged);

        return () => {
            window.removeEventListener('signalJunctionDataChanged', handleSignalJunctionDataChanged);
        };
    }, [dispatch]);

    // Compute indexChange and trendChange when listItems changes
    useEffect(() => {
        const prevListItems = prevListItemsRef.current;
        const newListItemsWithChanges = listItems.map((item) => {
            const prevItem = prevListItems.find((prev) => prev.name === item.name);
            let indexChange = 0;
            let trendChange = 0;
            if (prevItem) {
                indexChange = item.index - prevItem.index;
                trendChange = item.trend - prevItem.trend;
            }
            return {
                ...item,
                indexChange,
                trendChange,
            };
        });
        setListItemsWithChanges(newListItemsWithChanges);
        prevListItemsRef.current = listItems;
    }, [listItems]);

    const renderList = listItemsWithChanges.map((item, index) => {
        return (
            <div className={styles.listItem} key={index}>
                <span className={styles.street}>{item.name}</span>
                <span className={styles.name}>{item.index.toFixed(2)}</span>
                <span className={styles.trend}>
                    {item.trend.toFixed(2)}%
                    {item.trendChange > 0 ? <UP /> : <DOWN />}
                </span>
            </div>
        );
    });

    return (
        <div className={styles.trafficRank}>
            <div className={styles.title}>
                <span>信控路口</span>
            </div>
            <div className={styles.rankContainer}>
                <span>路段名称</span>
                <span className={styles.street}>拥堵指数</span>
                <span>拥堵趋势</span>
            </div>
            <div className={styles.listContainer}>
                {renderList}
            </div>
        </div>
    );
}