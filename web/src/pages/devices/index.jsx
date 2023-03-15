import {Button, Space, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as timeago from 'timeago.js';
import {addAction, deleteDevice, devicesSelector, fetchDevices} from "../../redux";
import {Device} from "../../lumber";
import ConfigureDrawer from "./ConfigureDrawer";
import LogsDrawer from "./LogsDrawer";
import LiveViewModal from "./LiveViewModal";

function Index() {
  const [configureDevice, setConfigureDevice] = useState(null);
  const [logsDevice, setLogsDevice] = useState(null);
  const [liveStreamDevice, setLiveStreamDevice] = useState(null);
  const dispatch = useDispatch();
  const rawDevices = useSelector(devicesSelector);
  const devices = rawDevices.map(raw => new Device(raw));

  const columns = [{
      title: "Device No.",
      dataIndex: "config_schema",
      key: "no",
      render: (_, item) => <span>{item.deviceId()}</span>
    }, {
      title: "Last active",
      dataIndex: "config_schema",
      key: "last_active",
      render: (_, item) => <span>{timeago.format(item.lastActive())}</span>
    }, {
      title: "Status",
      dataIndex: "config_schema",
      key: "status",
      render: (_, item) => <>
        {
          item.hasValidConfig()
            ? <Tag color="green">Configured</Tag>
            : <Tag color="orange">Needs Config</Tag>
        }
        {
          item.isActive()
            ? <Tag color="green">Active</Tag>
            : <Tag color="red">Inactive</Tag>
        }
      </>
    }, {
      title: "Action",
      dataIndex: "config_schema",
      key: "action",
      render: (_, item) => <Space size="middle">
        <Button type="link" onClick={() => setConfigureDevice(item)}>
          Configure
        </Button>
        <Button type="link" onClick={() => setLogsDevice(item)}>
          View logs
        </Button>
        <Button disabled={!item.isActive()} type="link" onClick={() => {dispatch(addAction(item.startLiveStreamAction())); setLiveStreamDevice(item);}}>
          Live view
        </Button>
        <Button type="link" onClick={() => dispatch(deleteDevice({id: item.deviceId()}))}>
          Delete
        </Button>
      </Space>
    },
  ]

  useEffect(() => {
    dispatch(fetchDevices())
    const intervalId = setInterval(() => {
      dispatch(fetchDevices())
    }, 5000)

    return () => clearInterval(intervalId); //This is important

  }, [])

  return (
    <>
      <ConfigureDrawer device={configureDevice} onClose={() => setConfigureDevice(null)}/>
      <LogsDrawer device={logsDevice} onClose={() => setLogsDevice(null)}/>
      <LiveViewModal device={liveStreamDevice} onClose={() => setLiveStreamDevice(null)}/>
      <Table columns={columns} dataSource={devices} />
    </>
  )
}

export default Index;