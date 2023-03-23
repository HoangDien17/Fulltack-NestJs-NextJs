import { IArticle, IArticleListProps } from "@/api/interface/article.interface";
import { getArticles } from "@/api/services/article.service";
import { Card, message, Pagination, Typography } from "antd";
import Image from "next/image";
import Router from "next/router";
import { useState } from "react";
import Logout from "../components/Logout";

const { Meta } = Card;

const ArticleList = (props: IArticleListProps): JSX.Element => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  const onChange = (currentPage: number) => {
    setCurrentPage(currentPage);
    Router.push(`/?page=${currentPage}&take=${pageSize}`);
  };

  const onChangeDetail = (id: number) => {
    Router.push(`/article-detail/${id}`);
  };

  return (
    <div className="w-[60%] m-auto mt-6 h-[calc(100vh_-_24px)] flex flex-col">
      {props.articles && props.articles.length > 0 ? (
        <>
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
              {props.articles.map((article: IArticle) => (
                <Card
                  key={article.id}
                  rootClassName="flex items-center justify-between mt-4 mb-4 cursor-pointer"
                  style={{ width: "100%", borderColor: "#BED6E3" }}
                  onClick={() => onChangeDetail(article.id)}
                >
                  <div>
                    <Meta title={article.title} />
                    <Typography.Paragraph ellipsis={{ rows: 2 }}>
                      {article.description}
                    </Typography.Paragraph>
                    <p className="text-[10px] text-[#001F2F]">
                      {article.created_at as any}
                    </p>
                  </div>
                  <span className="text-[#1890FF]">{">"}</span>
                </Card>
              ))}
            </div>
          </div>
          <div className="footer mb-6 w-full flex justify-center">
            <Pagination
              size="default"
              current={currentPage}
              total={props.paginate.total}
              pageSize={pageSize}
              responsive={true}
              onChange={(current) => onChange(current)}
            />
          </div>
        </>
      ) : (
        <h1 className="font-bold flex justify-center m-auto">No result</h1>
      )}
    </div>
  );
};

export default ArticleList;

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
  const take = +context.query.take || 10;
  const { data } = await getArticles(page, take, context.req?.cookies?.token);
  return {
    props: { articles: data.articles, paginate: data.paginate },
  };
};
