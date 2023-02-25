import {Button, Space, Table, Tag} from "antd";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {devicesSelector, fetchDevices} from "../../redux";
import {Device} from "../../lumber";

function Index() {
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
      render: () => <Space size="middle">
        <a>Configure</a>
        <a>Delete</a>
      </Space>
    },
  ]

  useEffect(() => {
    dispatch(fetchDevices())
  }, [])
  console.log(devices)
  return (
    <Table columns={columns} dataSource={devices} />
  )
}

export default Index;