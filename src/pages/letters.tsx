import { useClerk } from "@clerk/clerk-react";
import { useState, useEffect } from "react";
import Envelope from "../components/envelope/envelope";

const Letter = () => {
  const clerk = useClerk();
  const [activeToken, setActiveToken] = useState<string | null | undefined>();

  useEffect(() => {
    if (clerk.session?.lastActiveToken !== activeToken) {
      setActiveToken(clerk.session?.lastActiveToken?.getRawString());
      fetch("http://localhost:8080/letter", {
        headers: {
          Authorization: clerk.session?.lastActiveToken?.getRawString() || "",
        },
      });
    }
  }, [clerk.session?.lastActiveToken]);
  return (
    <div className="flex flex-wrap gap-4 justify-center">
      <Envelope
        to="Tosif"
        from="Sahir"
        body="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi"
      />
      <Envelope
        to="Tosif"
        from="Sahir"
        body="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi"
      />
      <Envelope
        to="Tosif"
        from="Sahir"
        body="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi"
      />
      <Envelope
        to="Tosif"
        from="Sahir"
        body="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi"
      />
      <Envelope
        to="Tosif"
        from="Sahir"
        body="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi"
      />
      <Envelope
        to="Tosif"
        from="Sahir"
        body="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi"
      />
      <Envelope
        to="Tosif"
        from="Sahir"
        body="Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi"
      />
      {/* <SignPad /> */}
    </div>
  );
};

export default Letter;
