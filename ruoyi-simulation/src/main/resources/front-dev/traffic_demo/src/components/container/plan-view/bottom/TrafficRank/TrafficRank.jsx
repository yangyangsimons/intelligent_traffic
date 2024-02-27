import React, { useEffect, useRef, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { setInfo } from 'stores/TrafficJunctionRankSlice';

import './index.scss'
export default function TrafficRank() {
    const rank = useSelector((state) => state.trafficRank.trafficJunctions);

    const dispatch = useDispatch();

    const [renderList, setRenderList] = useState([]);
    console.log(rank);
    useEffect(() => {
        const handleTrafficRankChange = (event) => {
            const newTrafficJunctions = event.detail; // Assuming this is an array of junction objects.
            dispatch(setInfo(newTrafficJunctions));
        };
        window.addEventListener('trafficJunctionRankChanged', handleTrafficRankChange);
        const updatedRenderList = rank.map((item, index = 0) => {
            return (
                <div className="list-item" key={index}>
                    <span className="rank">{index + 1}</span>
                    <span className="name">{item.name}</span>
                    <span className={"status " + ((item.status.includes("拥堵")) ? "red" : (item.status.includes("畅通")) ? "green" : "")}>{item.status}</span>
                </div >
            )
        });
        setRenderList(updatedRenderList);
    }, [rank, dispatch]);
    // pedestrain optimization list


    return (
        <div className="traffic-rank">
            <div className="title">
                <span>辖区拥堵排名</span>
            </div>
            <div className="rank-container">
                <span>排名</span>
                <span className='street'>街道名称</span>
                <span>拥堵情况</span>
            </div>
            <div className="list-container" >
                {renderList}
                {/* {renderList} */}
            </div>
        </div>
    )
}
