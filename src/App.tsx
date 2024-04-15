// import { useState } from 'react'
import "./App.css";
import SignPad from "./components/sign-pad";
// import Envelope from "./components/envelope/envelope";

function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div className="flex flex-wrap gap-4 justify-center">
        {/* <Envelope />
        <Envelope />
        <Envelope />
        <Envelope />
        <Envelope />
        <Envelope />
        <Envelope /> */}
        <SignPad/>
      </div>
    </>
  );
}

export default App;
