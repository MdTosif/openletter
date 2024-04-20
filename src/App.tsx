// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Letter from "./pages/letters";
import SignPad from "./components/sign-pad";
import SendLetter from "./pages/send-letter";

const router = [
  {
    path: "*",
    element: <Letter />,
  },
  {
    path: "/send",
    element: <SendLetter />,
  },
  {
    path: "/sign",
    element: <SignPad />,
  },
];

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          {router.map((e) => (
            <Route path={e.path} element={e.element}></Route>
          ))}
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
