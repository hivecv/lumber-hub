import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {Layout} from "antd";

const { Header, Content, Footer } = Layout;

function App() {
  const appState = useSelector(state => state.app)
  return (
    <Layout className="layout">
      <Header>
        <div className="logo"/>
        <div>LumberHub Dashboard</div>
      </Header>
      <Content className="content">
        <div className="site-layout-content">
          Welcome to LumberHub!
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>HiveCV ©2023 Created by HiveCV</Footer>
    </Layout>
  );
}

export default App;
