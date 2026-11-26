import React from "react";
import { createRoot } from "react-dom/client";
import { LoanApp } from "./LoanApp";
import "./style.css";
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <LoanApp />
  </React.StrictMode>,
);
