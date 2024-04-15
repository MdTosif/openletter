import { useState } from "react";
import "./envelope.css";
import ExpandIcon from "../../assets/expand-icon";

export default function Envelope({
  body,
  from,
  to,
}: {
  to: string;
  from: string;
  body: string;
}) {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <div className="envelope">
      <div className="back"></div>
      <div className={`letter ${isExpanded ? "expanded" : "overflow-hidden"}`}>
        <div className="text text-primary-content ">
          <div
            className="expand w-6"
            onClick={() => {
              setExpanded((e) => !e);
            }}
          >
            <ExpandIcon className="stroke-primary" />
          </div>
          <div className={`m-4 ${isExpanded && "lg:w-1/2"}`}>
            <p className="text-left"> Dear {to},</p>
            <p>&nbsp;</p>
            <p className="text-left">{body}</p>
            <p>&nbsp;</p>
            <p className="text-left">With love and admiration,</p>
            <p className="text-left">{from}</p>
          </div>
        </div>
      </div>
      <div className="front"></div>
      <div className="top"></div>
      <div className="shadow"></div>
    </div>
  );
}
