import React, { useRef, useEffect, useState } from 'react'
import { ReactComponent as NavIcon } from 'assets/icon/icon-nav.svg';
import './index.scss';
export default function Index() {

    const staticListItems = [{
        name: "事故率",
        index: "10",
    },
    {
        name: "平均速度",
        index: "46",
    },
    {
        name: "流量",
        index: "100",
    },
    {
        name: "密度",
        index: "1000",
    }]
    const [data, setData] = useState(staticListItems);
    const [overall, setOverall] = useState(52);
    const [background, setBackground] = useState({ background: 'linear-gradient(to right, #ff0000 0%, red 100%)' });
    useEffect(() => {
        window.addEventListener('lightTimerChanged', (event) => {
            const key = Object.keys(event.detail)[0];
            const isGreen = event.detail[key].isGreen;
            if (isGreen) {
                setData(
                    [{
                        name: "事故率",
                        index: "10",
                    },
                    {
                        name: "平均速度",
                        index: "46",
                    },
                    {
                        name: "流量",
                        index: "100",
                    },
                    {
                        name: "密度",
                        index: "1000",
                    }]
                );
                setOverall(87);
            } else {
                setData(
                    [{
                        name: "事故率",
                        index: "10",
                    },
                    {
                        name: "平均速度",
                        index: "46",
                    },
                    {
                        name: "流量",
                        index: "100",
                    },
                    {
                        name: "密度",
                        index: "1000",
                    }]
                );
                setOverall(87);
                setBackground({ background: 'linear-gradient(to right, #349ec9 0%, green 100%)' });
            }
        })
    }, [data, overall]);
    const renderList = data.map((item, index) => {
        return (
            <div className="list-item" key={index}>
                <span className="name">{item.name}</span>
                <span className="index">{item.index}</span>
            </div>
        )
    });
    // const scrollContainer = useRef(null);
    // useEffect(() => {
    //     const startAutoScroll = () => {
    //         const container = scrollContainer.current;
    //         const scrollAmount = 2.5; // Adjust for faster/slower scrolling

    //         const interval = setInterval(() => {
    //             // When you've scrolled to the end of the original content, reset to the top
    //             if (container.scrollTop >= (container.scrollHeight / 2)) {
    //                 container.scrollTop = 0; // Set to start without user noticing
    //             } else {
    //                 container.scrollTop += scrollAmount;
    //             }
    //         }, 50); // Adjust the interval for faster/slower scrolling

    //         return () => clearInterval(interval); // Cleanup on component unmount
    //     }

    //     startAutoScroll();
    // }, []);
    return (
        < div className="pedestrain-optimization-container" >
            <div className="title"><span className='svg'><NavIcon /></span><span>路网优化指标</span></div>
            <main className="pedestrian-main">
                <section className="pedestrain-scroll-container">
                    <div className='nav-container'>
                        <span>评价指标</span>
                        <span>分数</span>
                    </div>
                    <div className="list-container">
                        {renderList}
                        {/* {renderList} */}
                    </div>
                </section>
                <section className="pedestrian-index">
                    <span className="number" style={background}>{overall}</span>
                    <span className="description">总体分数</span>
                </section>
            </main>
        </div >
    )
}
