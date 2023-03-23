import { updatePassword } from "@/api/services/user.service";
import { Button, Form, Image, Input, message } from "antd";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { IResetPassword } from "../../api/interface/form.interface";

const ResetPassword = (): JSX.Element => {
  const router = useRouter();
  const [btnDisabled, setBtnDisabled] = useState(true);

  const [form] = Form.useForm();
  const onValuesChange = () => {
    const formValid =
      !form.isFieldsTouched(true) ||
      form.getFieldsError().filter(({ errors }) => errors.length).length > 0;

    if (!formValid) {
      setBtnDisabled(formValid);
    }
  };

  const onSubmit = (value: IResetPassword) => {
    updatePassword(router.query?.token as string, value)
      .then(() => {
        message.success("Your password is updated");
        Router.push("/sign-in");
      })
      .catch((error) =>
        message.error(error?.response?.message || error.message)
      );
  };

  return (
    <div className="w-[60%] h-[100vh] flex justify-center items-center m-auto">
      <div className="m-auto w-full">
        <div>
          <Image
            src="/logo.png"
            alt="jitera logo"
            className="w-[6rem] h-[1.5rem]"
          />
        </div>
        <div className="mt-14 mb-8">
          <h1 className="text-xl font-bold">パスワード再設定</h1>
        </div>
        <div className="mt-8 mb-8 text-[12px]">
          <p>新しいパスワードを入力してください。</p>
        </div>
        <Form
          name="update_password"
          layout="vertical"
          className="w-full m-auto"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          autoComplete="off"
          onValuesChange={onValuesChange}
        >
          <Form.Item
            label="新しいパスワード"
            name="newPassword"
            rules={[
              {
                required: true,
                message: "パスワードは英数字8文字以上で入力してください",
              },
              {
                pattern: new RegExp("(?=.*[a-z])[a-zA-Z0-9]{8,}"),
                message: "パスワードは英数字8文字以上で入力してください",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="新しいパスワード（確認）"
            name="confirmPassword"
            rules={[
              // validator password with confirm password
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item className="mt-32">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full m-auto"
              style={{
                backgroundColor: btnDisabled ? "#B4C3CA" : "#1890FF",
              }}
              disabled={btnDisabled}
            >
              設定する
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default ResetPassword;
