import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import App from "./App";
import store from "./store";
import "./css/index.scss"
import './parameterWebsocket';
const root = createRoot(document.getElementById('root'));
root.render(
    <Provider store={store}>
        <App />
    </Provider>
);