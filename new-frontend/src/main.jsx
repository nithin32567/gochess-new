import ReactDOM from 'react-dom/client';
import { Provider } from "react-redux";

import store from "./redux/store.js";
import App from './App.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./fontawesome/css/all.min.css?v=1.1";
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>,
)
