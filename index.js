//Require modules:
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
var bodyParser = require("body-parser");

//Module Imports:
const Product = require("./models/products");

//View engine has been set:
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(methodOverride("_method"));
//------------------------------------------------------------------
// TODO: Variable Declaration Section:

//------------------------------------------------------------------
//Connect mongoDB
mongoose
  .connect("mongodb://localhost:27017/shopMart")
  .then(() => {
    console.log("CONNECTION OPENED ✅");
  })
  .catch((error) => {
    console.log("OH NO ERROR ❌", error);
  });

//TODO: ROUTS:
app.get("/", async (req, res) => {
  let products = await Product.find({});
  res.render("product/products", { products });
});

app.get("/add", (req, res) => {
  res.render("product/add");
});

app.post("/add", async (req, res) => {
  let newProduct = new Product(req.body);
  await newProduct.save();

  res.redirect("http://localhost:3000/product/");
});

app.get("/product/:id", async (req, res) => {
  const { id } = req.params;
  const product_data = await Product.findById(id);

  res.render("product/individualProd", { product_data });
});

app.get("/product", async (req, res) => {
  let products = await Product.find({});
  res.render("product/products", { products });
});

app.get("/product/update/:id", async (req, res) => {
  const { id } = req.params;
  let products = await Product.findById(id);
  res.render("product/update", { products });
});

app.put("/product/update/:id", async (req, res) => {
  const { id } = req.params;
  let products = await Product.findByIdAndUpdate(id, req.body, {
    runValidators: true,
    new: true,
  });
  res.redirect(`/product/${products.id}`);
});

app.delete("/product/update/:id", async (req, res) => {
  const { id } = req.params;
  let products = await Product.findByIdAndDelete(id);

  res.redirect("/product/");
});

//Port Listen:
app.listen("3000", () => {
  console.log("https://localhost:3000/🚦");
});
