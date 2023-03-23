import axios from "axios";

const callApi = ({ url = "", method = "GET", data = {}, token = "" }) => {
  const axiosClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json;charset=UTF-8'
    },
  });
  return axiosClient({
    url,
    method,
    data,
  });
};

export function getArticleDetail(id: number, accessToken: string) {
  return callApi({ url: `/articles/${id}`, token: accessToken });
}

export function getArticles(page: number, take: number, accessToken: string) {
  return callApi({ url: `/articles?page=${page || 1}&take=${take || 5}`, token: accessToken });
}
