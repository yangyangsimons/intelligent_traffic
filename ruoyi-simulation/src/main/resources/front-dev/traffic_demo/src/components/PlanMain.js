import Centre from 'components/Centre';
import TrafficFlow from 'components/container/plan-view/sidebar-left/TrafficFlow/TrafficFlow';
import TrafficJam from 'components/container/plan-view/bottom/TrafficJam/TrafficJam';
import AverageDelay from 'components/container/plan-view/bottom/AverageDelay/AverageDelay';
import TrafficRank from 'components/container/plan-view/bottom/TrafficRank/TrafficRank';
import TopViolation from 'components/container/plan-view/bottom/TopViolation/TopViolation';
import Overview from 'components/container/plan-view/bottom/Overview/Overview';
import ViolationOverview from 'components/container/plan-view/sidebar-right/ViolationOverview/ViolationOverview';
import FunctionIcons from 'components/container/plan-view/sidebar-right/FunctionIcons/FunctionIcons';
import Pedestrain from 'components/container/junction-view/Pedestrain-optimize/index';
import React from 'react';
import '../css/plan-0126.scss';


export default function PlanMain() {

  return (
    <main>
      <div className="leftSide-main">
        {/* <TrafficFlow /> */}
        <TrafficJam />
        <TrafficRank />
        {/* <Overview /> */}
        {/* <AverageDelay /> */}

      </div>
      {/* <Centre /> */}
      <div className="rightSide">
        {/* <ViolationOverview /> */}
        {/* <TrafficRank /> */}
        {/* <TopViolation /> */}

        {/* <FunctionIcons /> */}
        <Overview />
        <AverageDelay />
        {/* <Pedestrain /> */}
      </div>
      <div className='bottomSide'>
        {/* <Overview />
        <TrafficRank />
        <TopViolation />
        <AverageDelay />
        <TrafficJam /> */}
      </div>
    </main>
  );
}
