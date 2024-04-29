const express = require("express");
const app = express();
const path = require("path");
require("./db/conn");
const port = process.env.PORT || 3002;

//hosting static website
const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views"); //contains filepath for hbs

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs"); //telling the express about hbs
app.set("views", template_path); //setting views path to template_path

//render hbs files
app.get("/", async (req, res) => {
  res.render("index");
});

app.get("/register", async (req, res) => {
  res.render("register");
});

app.get("/recover", async (req, res) => {
  res.render("recover");
});

app.use("/", require("./routes/form"));

app.listen(port, (req, res) => {
  console.log(`Connection succesful at port ${port}`);
});
