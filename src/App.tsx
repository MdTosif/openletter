// import { useState } from 'react'
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import Header from "./components/header";
import Letter from "./pages/letters";
import SignPad from "./components/sign-pad";

const router = createBrowserRouter([
  {
    path: "*",
    element: <Letter />,
  },
  {
    path: "/sign",
    element: <SignPad />,
  },
]);

function App() {
  return (
    <>
      <Header />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
