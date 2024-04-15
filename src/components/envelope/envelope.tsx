import { useState } from "react";
import "./envelope.css";
import ExpandIcon from "../../assets/expand-icon";

export default function Envelope() {
  const [isExpanded, setExpanded] = useState(false);
  return (
    <div className="envelope">
      <div className="back"></div>
      <div className={`letter ${isExpanded ?  "expanded": "overflow-hidden" }`}>
        <div className="text">
          <div
            className="expand w-6"
            onClick={() => {
              setExpanded((e) => !e);
            }}
          >
            <ExpandIcon className="stroke-primary" />
          </div>
          Lorem ipsum dolor sit, amet consectetur adipisicing elit. Excepturi
          dicta fuga fugiat possimus eligendi architecto quia aut. Dolorum nihil
          tenetur quisquam nemo molestias accusantium, aspernatur facilis
          placeat cumque dolorem animi!
        </div>
      </div>
      <div className="front"></div>
      <div className="top"></div>
      <div className="shadow"></div>
    </div>
  );
}
