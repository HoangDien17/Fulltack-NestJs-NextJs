import { Button, Card, message } from "antd";
import Image from "next/image";
import Router from "next/router"
import { getArticleDetail } from "@/api/services/article.service";
import Logout from "../../components/Logout";

const ArticleDetail = (props: any): JSX.Element => {
  const onBack = () => {
    Router.back();
  }

  return (
    props.article && (
      <div className="w-[60%] m-auto mt-6 h-[calc(100vh_-_24px)] flex flex-col">
        <div className="flex-auto">
          <div className="flex justify-between items-center w-full">
            <div>
              <Image
                src="/logo.png"
                alt="jitera logo"
                width={96}
                height={24}
              />
            </div>
            <Logout />
          </div>
          <div className="content">
            <Card rootClassName="flex items-center justify-between mt-4 mb-4 px-0" bodyStyle={{ padding: '0 !important' }} style={{ width: "100%", borderStyle: "none" }}>
              <div>
                <h1 className="font-bold leading-6">{props.article.title}</h1>
                <p>{props.article.description}</p>
                <p className="text-[15px] text-[#001F2F]">{props.article.created_at as any}</p>
              </div>
            </Card>
          </div>
        </div>
        <div className="footer mb-6 w-full flex justify-center">
          <Button className="text-[#1890FF]" onClick={onBack}>戻る</Button>
        </div>
      </div>
    )
  );
};

export default ArticleDetail;

export const getServerSideProps = async (context: any) => {
  if (!context.req?.cookies?.token) {
    return {
      redirect: {
        destination: "/sign-in",
        permanent: false,
      },
    };
  }

  const page = +context.query.page || 1;
  try {
    const { data } = await getArticleDetail(page, context.req?.cookies?.token);
    return {
      props: { article: data },
    };
  } catch (error) {
    
  }
};

