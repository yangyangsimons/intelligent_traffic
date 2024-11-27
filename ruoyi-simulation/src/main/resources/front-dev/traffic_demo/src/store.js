import { configureStore } from "@reduxjs/toolkit";
import animationReducer from "./stores/animationSlice";
import lightTimerReducer from "./stores/lightTimerSlice";
import infoReducer from "./stores/trafficInfoSlice";
import junctionReducer from "./stores/junctionInfoSlice";
import rankReducer from "./stores/TrafficJunctionRankSlice";
import junctionControlReducer from "./stores/junctionControlSlice";
import parameterReducer from "./stores/parameterSlice";
import ControlModuleReducer from "./stores/digitalTwin/controlModuleSlice";
import JamIndexReducer from "./stores/digitalTwin/jamIndexSlice";
import analysisReducer from "./stores/digitalTwin/analysisSlice";
import OptimiseOverviewReducer from "./stores/digitalTwin/optimiseOverviewSlice";
import wholeIndexReducer from "./stores/digitalTwin/wholeIndexSlice";
import signalRoadReducer from "./stores/digitalTwin/signalRoadSlice";
import signalJunctionReducer from "./stores/digitalTwin/signalJunctionSlice";
import scrollAlertReducer from "./stores/digitalTwin/scrollAlertSlice";
const store = configureStore({
    reducer: {
        animation: animationReducer,
        lightTimer: lightTimerReducer,
        trafficInfo: infoReducer,
        junctionInfo: junctionReducer,
        trafficRank: rankReducer,
        junctionControl: junctionControlReducer,
        parameters: parameterReducer,
        controlModule: ControlModuleReducer,
        jamIndex: JamIndexReducer,
        analysis: analysisReducer,
        optimiseOverview: OptimiseOverviewReducer,
        wholeIndex: wholeIndexReducer,
        signalRoad: signalRoadReducer,
        signalJunction: signalJunctionReducer,
        scrollAlert: scrollAlertReducer,
    },
});

export default store;