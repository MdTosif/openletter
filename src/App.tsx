// import { useState } from 'react'
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Letter from "./pages/letters";
import SignPad from "./components/sign-pad";
import SendLetter from "./pages/send-letter";
import { getCookie } from "./util/cookie";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
  useClerk,
} from "@clerk/clerk-react";

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
  console.log(getCookie("__session"));
  const clerk = useClerk();

  return (
    <>
      <BrowserRouter>
        <Header />
        {clerk.user?.id ? (
          <Routes>
            {router.map((e) => (
              <Route path={e.path} element={e.element}></Route>
            ))}
          </Routes>
        ) : (
          <>
            <div className="grid grid-cols-12 gap-10 justify-center items-center m-24 my-48">
              <h3 className="col-span-12 text-2xl">
                Receive Letter & Send letter with custom signature
              </h3>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="col-span-12 btn w-48 ">sign in</button>
                </SignInButton>
              </SignedOut>
            </div>
          </>
        )}
      </BrowserRouter>
    </>
  );
}

export default App;
