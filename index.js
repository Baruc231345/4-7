const express = require("express");
const db = require("./routes/db-config");
const app = express();
const bodyParser = require("body-parser");
const cookie = require("cookie-parser");
const PORT = process.env.PORT || 3005;
const cors = require('cors');

app.use(bodyParser.urlencoded({extended:true}))
app.get("/editUserView/css/editUserView.css", (req, res) => {
    res.sendFile(__dirname + "/public/css/editUserView.css");
  });

app.use(bodyParser.urlencoded({extended:true}))
app.get("/ejsrasa/css/rasa.css", (req, res) => {
    res.sendFile(__dirname + "/public/css/rasa.css");
  });

app.use(bodyParser.urlencoded({extended:true}))
app.get("/rasaview/css/rasa_view.css", (req, res) => {
    res.sendFile(__dirname + "/public/css/rasa_view.css");
  });

app.use(bodyParser.urlencoded({extended:true}))
app.get("/rasaview/css/rasa_view.js", (req, res) => {
    res.sendFile(__dirname + "/public/js/rasa_view.js");
  });


app.get("/dashboardRegular/css/dashboard1.css", (req, res) => {
  res.sendFile(__dirname + "/public/css/dashboard1.css");
  });

app.get("/dashboardRegular/js/dashboard1.js", (req, res) => {
  res.sendFile(__dirname + "/public/js/dashboard1.js");
  });

  
app.use("/js", express.static(__dirname + "/public/js"))
app.use("/css", express.static(__dirname + "/public/css"))
app.set("view engine" , "ejs")
app.set("views" , "./views")
app.use(cookie())
app.use(express.json())
db.connect((err)=>{
    if(err)throw err;
    console.log("database connected");
})

app.use("/", require("./routes/pages"));
app.use("/api", require("./controllers/auth")); 
app.listen(PORT);




    
