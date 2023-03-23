export interface IArticle {
  id: number;
  title: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface IGetArticles {
  articles: IArticle[];
  paginate: {
    page: number;
    total: number;
    totalPage: number;
  };
}
