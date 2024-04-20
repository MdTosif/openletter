import useSWR from "swr";
import getConfig from "../config/config";
import { getCookie } from "../util/cookie";

const useLetters = (token: string) => {
  const host = getConfig().host;
  const url = `${host}/letter`;
  const fetcher = async (url: string) =>
    (
      await fetch(url, {
        headers: {
          Authorization: getCookie("__session"),
        },
      })
    ).json();
  return useSWR<
    {
      ID: 20;
      from: string;
      from_name: string;
      message: string;
      to: string;
    }[]
  >(url + "?" + token[0], fetcher);
};

export default useLetters;
