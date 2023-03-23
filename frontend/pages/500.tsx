import { Button } from "antd";
import Image from "next/image";
import router from "next/router";

const InternalServicePage = () => {
  const onBack = () => {
    router.back()
  }
  return (
    <div className="bg-[#001F2F] w-[60%] h-screen m-auto text-white relative">
      <div className="m-auto w-full absolute mt-24">
        <div className="mb-14 w-full">
          <Image
            src="/logo (1).png"
            width={96}
            height={24}
            alt="jitera logo"
            className="m-auto"
          />
        </div>
        <div className="w-full">
          <Image
            src="/Group_500.png"
            alt="error logo"
            width={96}
            height={24}
            className="m-auto"
          />
        </div>
        <div className="mt-8 mb-8 text-center w-[60%] m-auto">
          <h1 className="text-xl font-bold">指定されたページは表示できません</h1>
        </div>
        <div className="text-center w-[80%] m-auto">
          <p className="text-sm">申し訳ございません。アクセスしようとしたページは表示できませんでした。</p>

        </div>
        <div className="mt-8 w-full flex justify-center">
          <Button size="large" className="text-[#9FE1FF] border-[#9FE1FF] m-auto w-24" onClick={onBack}>戻る</Button>
        </div>
      </div>

    </div>
  );
};

export default InternalServicePage;
