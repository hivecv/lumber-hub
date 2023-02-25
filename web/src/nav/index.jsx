import React from 'react';
import {Layout, Menu} from "antd";
import {Link, Outlet, useLocation} from "react-router-dom"
import './nav.css'
import {DATA_PAGE, DEVICES_PAGE, HOME_PAGE, LOGIN_PAGE, REGISTER_PAGE} from "../config/paths";
import {useDispatch, useSelector} from "react-redux";
import {authTokenSelector, updateAuth} from "../redux";
import {remove} from "../redux/localstorage";

const { Header, Content, Footer } = Layout;
function Index() {
  const location = useLocation();
  const dispatch = useDispatch();
  const token = useSelector(authTokenSelector);
  const logout = () => {
    dispatch(updateAuth({token: null}));
    remove("auth_token")
  }
  const menuItems = token
    ? [{
        key: HOME_PAGE,
        label: <Link to={HOME_PAGE}>Home</Link>
      }, {
        key: DEVICES_PAGE,
        label: <Link to={DEVICES_PAGE}>Devices</Link>
      }, {
        key: DATA_PAGE,
        label: <Link to={DATA_PAGE}>Data</Link>
      }, {
        key: "logout",
        label: <span onClick={logout}>Logout</span>
      }]
    : [{
        key: LOGIN_PAGE,
        label: <Link to={LOGIN_PAGE}>Login</Link>
      }, {
        key: REGISTER_PAGE,
        label: <Link to={REGISTER_PAGE}>Register</Link>
      }]

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