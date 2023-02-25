import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import store from './redux';
import 'antd/dist/reset.css';
import './index.css';
import {ConfigProvider, theme} from "antd";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import routes from "./config/routes";

const customTheme = {
  token: {
    colorPrimary: '#1db68b',
    algorithm: theme.darkAlgorithm,
  },
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ConfigProvider theme={customTheme}>
    <Provider store={store}>
      <RouterProvider router={createBrowserRouter(routes)}/>
    </Provider>
  </ConfigProvider>
);
