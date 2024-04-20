import { useClerk } from "@clerk/clerk-react";
import Envelope from "../components/envelope/envelope";
import useLetters from "../service/letters";

const Letter = () => {
  const clerk = useClerk();
  const { data, isLoading, error } = useLetters(
    clerk.session?.lastActiveToken?.getRawString() as string,
  );

  if (isLoading || error)
    return (
      <div className="flex justify-between">
        <span className="loading loading-spinner w-1/4 mx-auto"></span>
      </div>
    );

  return (
    <div className="flex flex-wrap gap-4 justify-center">
      {data?.map((e) => (
        <Envelope
          to={e.to}
          from={e.from}
          body={e.message}
          fromName={e.from_name}
        />
      ))}
    </div>
  );
};

export default Letter;
