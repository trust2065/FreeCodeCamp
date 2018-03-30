This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).
Run on VSCode
For CodePen version, pls take a look here: https://codepen.io/trust2065/full/VXyKdz/

Steps to integrate DataTables.js

  1.
  install jQuery

  2.
  in terminal 
  yarn add react-jquery-datatables
  $(document).ready(function() {
      //After set data in the table
      $("#userTable").DataTable();
  });

  3.
  import "datatables.net";

  4.
  set id for table
  <table id="userTable" className="table table-striped table-hover">
  </table>

  5.
  import dataTable css
  directly: https://cdn.datatables.net/1.10.16/css/dataTables.bootstrap4.min.css
  import after install: import 'datatables.net-dt/css/jquery.dataTables.css';

  ref: https://datatables.net/examples/styling/bootstrap4

  *Currently the test shows [dataTable css] can't work with [bootstrap4 table-dark], since the bgcolor also set by [dataTable css]
  *不過目前測試結果無法和table-dark同時作用, 因為dataTable會蓋掉table-dark的css
