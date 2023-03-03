import {Button, Drawer, Space} from 'antd';
import {useDispatch, useSelector} from "react-redux";
import {fetchLogs, logsSelector} from "../../redux";
import {useEffect} from "react";
import './LogsDrawer.css';

function formatDate(ts) {
  const dt = new Date(ts * 1000)
  const padL = (nr, len = 2, chr = `0`) => `${nr}`.padStart(2, chr);

  return `${
      padL(dt.getMonth()+1)}/${
      padL(dt.getDate())}/${
      dt.getFullYear()} ${
      padL(dt.getHours())}:${
      padL(dt.getMinutes())}:${
      padL(dt.getSeconds())}`;
}

const LogsDrawer = ({device, onClose}) => {
  const dispatch = useDispatch();
  const logs = useSelector(logsSelector);

  const refresh = () => {
    if(device && device.deviceUUID) {
      dispatch(fetchLogs(device.deviceUUID()))
    }
  }

  useEffect(refresh, [device])

  return (
    <>
      <Drawer
        title="Device logs"
        width={600}
        onClose={onClose}
        open={!!device}
        bodyStyle={{
          padding: 0,
        }}
        extra={
          <Space>
            <Button onClick={refresh}>
              Refresh
            </Button>
            <Button onClick={onClose} type="primary">Close</Button>
          </Space>
        }
      >
        <div className="code-block">
          {logs.map(log => <p>[{formatDate(log.created)}] <b>{log.msg}</b></p>)}
        </div>
      </Drawer>
    </>
  );
};
export default LogsDrawer;