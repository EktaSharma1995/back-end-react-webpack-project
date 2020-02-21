var url = "mongodb://localhost:27017/DB";
const mongoose = require("mongoose");

let connection = mongoose.createConnection(
  url,
  { useNewUrlParser: true },
  error => {
    if (!error) {
      console.log("Sucess");
    } else {
      console.log("Error");
    }
  }
);
