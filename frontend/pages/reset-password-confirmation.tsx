import { Image } from "antd";

const ResetPasswordCompletion = (): JSX.Element => {

  return (
    <div className="w-[60%] h-[100vh] flex justify-center items-center m-auto">
      <div className="m-auto">
        <div>
          <Image src="/logo.png" alt="jitera logo" className="w-[100px] h-[1.5rem] m-auto" />
        </div>
        <div className="mt-[126.73px]">
          <Image src="/email_logo.png" alt="email logo" className="w-[100px] h-[100px] m-auto" />
        </div>
        <div className="mt-14 text-center h-[117px]">
          <p className="text-[28px] font-bold">Your email has been sent to</p>
        </div>
        <div className="mt-5 text-[12px] font-customer text-center">
          <p>We&#39; ve sent you an email with links to the password reset page</p>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordCompletion;