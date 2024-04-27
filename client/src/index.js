import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import Context from "./components/ContextProvider/Context";
import { BrowserRouter } from "react-router-dom";
//add new
import ContextProvider from "./elements/context/ContextProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Context>
    <ContextProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ContextProvider>
  </Context>
);
