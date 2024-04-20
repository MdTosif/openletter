import useSWR from "swr";

const useLetters = (token: string) => {
  const url = "http://localhost:8080/letter";
  const fetcher = async (url: string) =>
    (
      await fetch(url, {
        headers: {
          Authorization: token,
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
  >(url, fetcher);
};

export default useLetters;
