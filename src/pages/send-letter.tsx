import { useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";

const SendLetter = () => {
  const clerk = useClerk();
  const [searchParams] = useSearchParams();
  const [to, setTo] = useState<string | undefined | null>(
    searchParams.get("to"),
  );
  const [message, setMessage] = useState<string>("");

  return (
    <>
      <form
        className="grid grid-cols-12 gap-4 m-4"
        onSubmit={async (e) => {
          e.preventDefault();
          const res = await fetch("http://localhost:8080/letter", {
            headers: {
              Authorization:
                clerk.session?.lastActiveToken?.getRawString() || "",
            },
            body: JSON.stringify({
              to,
              message,
            }),
            method: "post",
          });
          const json = res.json();
          console.log(json);
        }}
      >
        <h3 className="col-span-12 text-2xl">Send Letter</h3>
        {!clerk.user?.id && (
          <label className="input col-span-6 input-bordered flex items-center gap-2">
            <span className="text-primary">Name</span>
            <input
              type="text"
              className="grow"
              placeholder="Daisy"
              name="from_name"
            />
          </label>
        )}
        {!searchParams.get("to") && (
          <label className="input col-span-6 input-bordered flex items-center gap-2">
            <span className="text-primary">To</span>
            <input
              type="text"
              className="grow"
              placeholder="Daisy"
              name="to"
              onChange={(e) => setTo(e.target.value)}
              value={to || ""}
            />
          </label>
        )}
        <textarea
          className="col-span-12 textarea textarea-bordered"
          placeholder="Letter body"
          rows={10}
          name="message"
          onChange={(e) => setMessage(e.target.value)}
          value={message}
        />
        <button type="submit" className="btn">
          Send
        </button>
      </form>
    </>
  );
};
export default SendLetter;
