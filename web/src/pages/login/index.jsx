import {Button, Form, Input} from "antd";
import {useDispatch} from "react-redux";
import {login} from "../../redux";
import {useNavigate} from "react-router-dom";
import {HOME_PAGE} from "../../config/paths";
import {save} from "../../redux/localstorage";

function Index() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const onFinish = (values) => {
    dispatch(login({
      ...values,
      callback: data => {
        save("auth_token", data.access_token)
        navigate(HOME_PAGE);
      }
    }));
  };
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <div className="site-layout-content">
      <Form
        name="basic"
        labelCol={{
          span: 4,
        }}
        wrapperCol={{
          span: 18,
        }}
        style={{
          width: "75%",
        }}
        initialValues={{
          remember: true,
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: 'email',
              message: 'Please input your email!',
            },
          ]}
        >
          <Input/>
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your password!',
            },
          ]}
        >
          <Input.Password/>
        </Form.Item>

        <Form.Item
          wrapperCol={{
            span: 24,
          }}
        >
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default Index;