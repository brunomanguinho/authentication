require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

//mongoose-encryption - Level 2 of security
//const encrypt = require("mongoose-encryption");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

const secret = process.env.SECRET;

//mongoose-encryption - Level 2 of security
//userSchema.plugin(encrypt, {secret: secret, encryptedFields: ["password"]});

const User = new mongoose.model("User", userSchema);


app.get("/", function(req, res){
  res.render("home");
});

app.get("/register", function(req, res){
  res.render("register");
});

app.get("/login", function(req, res){
  res.render("login");
});

app.post("/register", function(req, res){
  const user = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });

  user.save(function(err){
    if (err){
      console.log(err);
    } else {
        res.render("secrets");
    }
  });
});

app.post("/login", function(req, res){
  const username = req.body.username;
  const password = md5(req.body.password);

  User.findOne({email: username}, function(err, foundUser){
    if (err){
      console.log(err);
    } else{
      console.log(this.email);
      if ( (foundUser) && (foundUser.password === password) ){
        res.render("secrets")
      }
    }
  })
});






app.listen(3000, function(){
  console.log("Server is listening on port 3000...");
})
