import {Button, Card, Col, Row} from "antd";
import {useNavigate} from "react-router-dom";
import {DATA_PAGE, DEVICES_PAGE} from "../../config/paths";
import './Home.css';
import device from "./device.jpg";
import data from "./data.jpg";

function Index() {
  const navigate = useNavigate()

  return (
    <Row gutter={16}>
      <Col sm={24} md={12}>
        <Card cover={<img alt="devices" onClick={() => navigate(DEVICES_PAGE)} src={device}/>} bordered={false}>
          Provide required configuration and verify device status
        </Card>
      </Col>
      <Col sm={24} md={12}>
        <Card cover={<img alt="data" onClick={() => navigate(DATA_PAGE)} src={data}/>} bordered={false}>
          See collected data and interact with it
        </Card>
      </Col>
    </Row>
  )
}

export default Index;