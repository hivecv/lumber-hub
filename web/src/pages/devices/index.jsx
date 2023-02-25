import {Button, Space, Table, Tag} from "antd";
import {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {deleteDevice, devicesSelector, fetchDevices} from "../../redux";
import {Device} from "../../lumber";
import ConfigureDrawer from "./ConfigureDrawer";

function Index() {
  const [currentDevice, setCurrentDevice] = useState(null);
  const dispatch = useDispatch();
  const rawDevices = useSelector(devicesSelector)
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
      render: () => <span>2014-12-24 23:12:00</span>
    }, {
      title: "Status",
      dataIndex: "config_schema",
      key: "status",
      render: (_, item) => <>
        {
          item.hasValidConfig()
            ? <Tag color="green">Configured</Tag>
            : <Tag color="orange">Pending</Tag>
        }

      </>
    }, {
      title: "Action",
      dataIndex: "config_schema",
      key: "action",
      render: (_, item) => <Space size="middle">
        <Button type="link" onClick={() => setCurrentDevice(item)}>
          Configure
        </Button>
        <Button type="link" onClick={() => dispatch(deleteDevice({id: item.deviceId()}))}>
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
      <ConfigureDrawer device={currentDevice} onClose={() => setCurrentDevice(null)}/>
      <Table columns={columns} dataSource={devices} />
    </>
  )
}

export default Index;