import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "./index.css";
import RouterComponent from "./RouterComponent";
import "./i18n";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <RouterComponent />
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);
