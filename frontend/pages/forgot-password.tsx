import { forgotPassword } from "@/api/services/user.service";
import { Button, Form, Input, message } from "antd";
import { useState } from "react";
import Router from "next/router";
import Image from "next/image";

const ResetPassword = (): JSX.Element => {
  const [email, setEmail] = useState<string>("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onSubmit = async () => {
    forgotPassword({ email })
      .then(() => {
        Router.push("/reset-password-confirmation");
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Router.push('/404')
        }
        if (error.response.status === 500) {
          Router.push('/500')
        }
        message.error(error?.response?.data?.message || error.message);
      }
      );
  };

  return (
    <div className="w-[60%] h-[100vh] flex justify-center items-center m-auto">
      <div className="m-auto">
        <div>
          <Image
            src="/logo.png"
            alt="jitera logo"
            className="w-[6rem] h-[1.5rem]"
          />
        </div>
        <div className="mt-14 mb-8">
          <h1 className="text-xl font-bold">パスワードをお忘れの方</h1>
        </div>
        <div className="mt-8 mb-8 text-[12px]">
          <p>
            会員登録時に登録されたメールアドレスを入力ください。パスワード再設定ページへのメールをお送りいたします。
          </p>
        </div>
        <Form
          name="forgot_password"
          layout="vertical"
          className="w-full m-auto"
          initialValues={{ remember: true }}
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            label="メールアドレス"
            name="email"
            rules={[
              {
                required: true,
                type: "email",
                message: "有効なメールアドレスを入力してください",
              },
            ]}
          >
            <Input onChange={onChange} />
          </Form.Item>
          <Form.Item className="mt-32">
            <Button
              type="primary"
              htmlType="submit"
              className="w-full m-auto"
              style={{ backgroundColor: !!email ? "#1890FF" : "#B4C3CA" }}
              disabled={!email}
            >
              メールを送信
            </Button>
          </Form.Item>
        </Form>
        <div className="text-center w-full text-[14px]">
          <p className="underline">戻る</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
