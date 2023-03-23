import { useState } from "react";
import { Image, Input, message } from "antd";
import { signUp } from "../api/services/user.service";
import Router from "next/router";
import Link from "next/link";
import { Form, Button } from "antd";
import { IFormSignUp } from "../api/interface/form.interface";
import { setCookie } from "cookies-next";

const SignUp = (): JSX.Element => {
  const [form] = Form.useForm();
  const [btnDisabled, setBtnDisabled] = useState(true);

  const onFinish = (value: IFormSignUp) => {
    signUp(value)
      .then(({ data }) => {
        Router.push("/sign-up-confirmation");
        setCookie("token", data.accessToken);
        setCookie("reFreshToken", data.refreshToken);
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

  const onValuesChange = () => {
    const hasErrors =
      !form.isFieldsTouched(true) ||
      form.getFieldsError().filter(({ errors }) => errors.length).length > 0;
    if (!hasErrors) {
      setBtnDisabled(hasErrors);
    }
  };

  return (
    <div className="w-[60%] h-full m-auto">
      <div className="mt-28">
        <div>
          <Image
            src="/logo.png"
            alt="jitera logo"
            className="w-[6rem] h-[1.5rem]"
          />
        </div>
        <div className="mt-8 mb-8">
          <h1 className="text-xl font-bold">アカウント登録</h1>
        </div>
        <Form
          name="basic"
          layout="vertical"
          className="w-full m-auto"
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <div>
            <div className="flex justify-between mb-5">
              <div className="w-[49%] h-16">
                <Form.Item
                  label="姓"
                  name="firstName"
                  rules={[
                    { required: true, message: "姓は必須です" },
                    { max: 20 },
                  ]}
                >
                  <Input placeholder="例：山田" />
                </Form.Item>
              </div>
              <div className="w-[49%] h-16">
                <Form.Item
                  label="名"
                  name="lastName"
                  rules={[
                    { required: true, message: "名は必須です" },
                    { max: 20 },
                  ]}
                >
                  <Input name="lastName" placeholder="例：太郎" />
                </Form.Item>
              </div>
            </div>
            <div className="mt-5 mb-5 h-16">
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
                <Input name="email" placeholder="例：welcome@jitera.com" />
              </Form.Item>
            </div>
            <div className="mt-5 h-16">
              <Form.Item
                label="パスワード"
                name="password"
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
                <Input.Password name="password" placeholder="半角英数字" />
              </Form.Item>
            </div>
          </div>
          <div className="mt-[100px] m-auto w-full flex justify-center align-center">
            <Form.Item className="mt-32">
              <Button
                htmlType="submit"
                className="w-full m-auto"
                style={{
                  backgroundColor: btnDisabled ? "#B4C3CA" : "#1890FF",
                }}
                disabled={btnDisabled}
              >
                はじめる
              </Button>
            </Form.Item>
          </div>
        </Form>
        <div className="mt-2 text-center w-full leading-[14px]">
          <Link href="/sign-in" className="underline">
            ログインはこちら
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
