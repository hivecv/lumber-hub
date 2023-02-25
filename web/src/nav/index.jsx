import React from 'react';
import {Layout, Menu} from "antd";
import {Link, Outlet, useLocation} from "react-router-dom"
import './nav.css'
import {DATA_PAGE, DEVICES_PAGE, HOME_PAGE} from "../config/paths";

const { Header, Content, Footer } = Layout;
function Index() {
  const location = useLocation();
  const menuItems = [
    {
      key: HOME_PAGE,
      label: <Link to={HOME_PAGE}>Home</Link>
    },
    {
      key: DEVICES_PAGE,
      label: <Link to={DEVICES_PAGE}>Devices</Link>
    },
    {
      key: DATA_PAGE,
      label: <Link to={DATA_PAGE}>Data</Link>
    }
  ]

  console.log(location.pathname, [HOME_PAGE, DATA_PAGE, DEVICES_PAGE])
  return (
    <Layout className="layout">
      <Header>
        <div className="logo"/>
        <div className="title">LumberHub Dashboard</div>
        <Menu theme="dark" mode="horizontal" selectedKeys={[location.pathname]} items={menuItems} />
      </Header>
      <Content>
        <Outlet/>
      </Content>
      <Footer style={{ textAlign: 'center' }}>HiveCV ©2023 Created by HiveCV</Footer>
    </Layout>
  )
}

export default Index;