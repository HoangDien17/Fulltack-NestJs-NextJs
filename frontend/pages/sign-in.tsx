import { useState } from "react";
import { Input, message, Form, Button, Image } from "antd";
import { signIn } from "../api/services/user.service";
import { IFormSignIn } from "../api/interface/form.interface";
import Router from "next/router";
import Link from "next/link";
import { setCookie } from "cookies-next";

const SignIn = (): JSX.Element => {
  const [form] = Form.useForm();
  const [btnDisabled, setBtnDisabled] = useState(true);

  const onFinish = (value: IFormSignIn) => {
    signIn(value)
      .then(({ data }) => {
        setCookie("token", data.accessToken);
        setCookie("reFreshToken", data.refreshToken);
        Router.push("/");
      })
      .catch((error) => {
        if (error.response.status === 404) {
          Router.push('/404')
        }
        if (error.response.status === 500) {
          Router.push('/500')
        }
        message.error(error?.response?.data?.message || error.message);
      })
  };

  const onValuesChange = () => {
    const formValid =
      !form.isFieldsTouched(true) ||
      form.getFieldsError().filter(({ errors }) => errors.length).length > 0;
    if (!formValid) {
      setBtnDisabled(formValid);
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
          <h1 className="text-xl font-bold">ログイン</h1>
        </div>
        <Form
          name="sign_in"
          layout="vertical"
          className="w-full m-auto"
          form={form}
          onFinish={onFinish}
          onValuesChange={onValuesChange}
        >
          <div>
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
                  {
                    max: 20,
                    message: 'Email must be less than 20 characters'
                  }
                ]}
              >
                <Input placeholder="例：welcome@jitera.com" />
              </Form.Item>
            </div>
            <div className="mt-5 h-16">
              <Form.Item
                label="パスワード"
                name="password"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.Password name="password" placeholder="半角英数字" />
              </Form.Item>
            </div>
          </div>
          <div className="mt-[100px] m-auto w-full flex justify-center align-center">
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
          </div>
        </Form>
        <div className="mt-2 text-center w-full leading-[14px]">
          <Link href="/forgot-password" className="underline">
            パスワードをお忘れの方
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

export const getServerSideProps = async (context: any) => {
  if (context.req?.cookies?.token) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {}
  }
};
