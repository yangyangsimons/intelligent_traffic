import React from 'react';
import Centre from './Centre.js';
// import LeftSlider from './container/junction-view/sidebar-left';
// import RightSlider from './container/junction-view/sidebar-right';
import LeftSide from 'components/container/junction-view/newStyle/LeftSide.jsx';
import RightSide from 'components/container/junction-view/newStyle/RightSide.jsx';
import '../css/junction.scss';
export default function JunctionMain() {
    return (
        <main>
            <div className="leftSide">
                {/* <LeftSlider /> */}
                <LeftSide />
            </div>
            {/*<Centre />*/}
            <div className="rightSide">
                <RightSide />
                {/* <RightSlider /> */}
            </div>
        </main>
    )
}
