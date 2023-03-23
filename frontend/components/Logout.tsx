import Router from "next/router";
import { deleteCookie } from "cookies-next";
import Image from "next/image";

const Logout = () => {
  const onClick = () => {
    deleteCookie("token");
    deleteCookie("reFreshToken");
    Router.push("/sign-in");
  };
  return (
    <div onClick={onClick}>
      <Image
        src="/Frame_4013.png"
        alt="logout logo"
        width={36}
        height={36}
        className="cursor-pointer"
      />
    </div>
  );
};

export default Logout;
