import {Button, Space, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import * as timeago from 'timeago.js';
import {deleteDevice, devicesSelector, fetchDevices} from "../../redux";
import {Device} from "../../lumber";
import ConfigureDrawer from "./ConfigureDrawer";
import LogsDrawer from "./LogsDrawer";

function Index() {
  const [configureDevice, setConfigureDevice] = useState(null);
  const [logsDevice, setLogsDevice] = useState(null);
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
        <Button type="link" onClick={() => dispatch(deleteDevice({id: item.deviceUUID()}))}>
          Delete
        </Button>
      </Space>
    },
  ]

  useEffect(() => {
    dispatch(fetchDevices())
  }, [])

  return (
    <>
      <ConfigureDrawer device={configureDevice} onClose={() => setConfigureDevice(null)}/>
      <LogsDrawer device={logsDevice} onClose={() => setLogsDevice(null)}/>
      <Table columns={columns} dataSource={devices} />
    </>
  )
}

export default Index;