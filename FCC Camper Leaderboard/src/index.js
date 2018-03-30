import React from "react";
import ReactDOM from "react-dom";
import "./css/index.css";
import Board from "./Components/Board";
import registerServiceWorker from "./registerServiceWorker";

import $ from "jquery";
import "datatables.net";
// window.jQuery = window.$ = $;

$(document).ready(function() {
  const url = "https://fcctop100.herokuapp.com/api/fccusers/top/recent";
  $.getJSON(url, data => {
    // console.log(data[0]);
    let testData = data;
    // console.log(testData);
    ReactDOM.render(
      <Board testData={testData} />,
      document.getElementById("root")
    );
     $("#userTable").DataTable();
  });
});

registerServiceWorker();
