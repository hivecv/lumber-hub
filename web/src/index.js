import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux'
import store from './redux';
import 'antd/dist/reset.css';
import './index.css';
import {ConfigProvider, theme} from "antd";

const customTheme = {
  token: {
    colorPrimary: '#86695d',
    algorithm: theme.darkAlgorithm,
  },
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider theme={customTheme}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>
);
