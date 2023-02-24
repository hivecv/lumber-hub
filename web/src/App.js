import './App.css';
import {useDispatch, useSelector} from "react-redux";
import {Button, Card, Col, Layout, Row} from "antd";
import device from './device.jpg';
import data from './data.jpg';

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
        <Row gutter={16}>
          <Col span={12}>
            <Card cover={<img alt="devices" src={device}/>} bordered={false}>
              Provide required configuration and verify device status
            </Card>
          </Col>
          <Col span={12}>
            <Card cover={<img alt="data" src={data}/>} bordered={false}>
              See collected data and interact with it
            </Card>
          </Col>
        </Row>
      </Content>
      <Footer style={{ textAlign: 'center' }}>HiveCV ©2023 Created by HiveCV</Footer>
    </Layout>
  );
}

export default App;
