import {Button, Col, Drawer, Form, Input, Row, Space} from 'antd';
import _ from 'lodash';

const ConfigureDrawer = ({device, onClose}) => {
  const [form] = Form.useForm();
  const schema = device ? device.schema : {}
  const fields = Object.keys(schema)
  const chunks = _.chunk(fields, 2)

  const submit = () => {
    form.validateFields()
      .then(values => {
        console.log("SUBMIT", values)
      })
      .catch(() => {})
  }
  return (
    <>
      <Drawer
        title="Configure the device"
        width={600}
        onClose={onClose}
        open={!!device}
        bodyStyle={{
          paddingBottom: 80,
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={submit} type="primary">
              Submit
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form} hideRequiredMark>
          {
            chunks.map((chunk, key) => (
              <Row gutter={16} key={key}>
                {
                  chunk.map(field => (
                    <Col key={field} span={12}>
                      <Form.Item
                        name={field}
                        label={_.capitalize(field)}
                        rules={[
                          {
                            required: true,
                            message: `Please fill out the ${field} field`,
                          },
                        ]}
                      >
                        <Input type={schema[field]} />
                      </Form.Item>
                    </Col>
                  ))
                }
              </Row>
            ))
          }
        </Form>
      </Drawer>
    </>
  );
};
export default ConfigureDrawer;