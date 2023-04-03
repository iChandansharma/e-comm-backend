const express = require('express')
// const mongoose=require('mongoose');// it is getting imported from config
require('./db/config')
const User = require('./db/User')
const product = require("./db/Product")
const cors = require('cors')
const Product = require('./db/Product')
const app = express()
app.use(express.json())
app.use(cors())


app.get('/', (req, resp) => {
  resp.send('app is working')

})
//don't uncomment the following code it may will not allow to work next post code.
// app.post('/register', (req, resp) => { 

//   resp.send(req.body)
// })

app.post("/register", async (req, resp) => {

  let user = new User(req.body)

  let result = await user.save();
  result = result.toObject();
  delete result.password
  resp.send(result)
  // console.log(req.body)
})
app.post("/login", async (req, resp) => {
  // console.log(req.body);
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");
    if (user) {
      resp.send(user);
    }
    else {
      resp.send({ result: 'No user found' })
    }
  }
  else {
    resp.send({ result: "Some fields are missing or user not found" })
  }


})

// const connectDB=async ()=>{
//     mongoose.connect('mongodb://127.0.0.1:27017/e-comm');
//     const productSchema=new mongoose.Schema({});
//     const product=mongoose.model('product',productSchema);
//     const data=await product.find();
//     console.log(data);
// }
// connectDB();

app.post("/add-product", async (req, resp) => {
  let product = new Product(req.body);
  let result = await product.save();
  resp.send(result);
})

app.get("/products", async (req, resp) => {
  let products = await Product.find();
  if (products.length > 0) {
    resp.send(products)
  }
  else {
    resp.send({ result: "No Products found" })
  }
})
app.delete("/product/:id", async (req, resp) => {
  // resp.send("working fine")
  const result = await Product.deleteOne({ _id: req.params.id })
  resp.send(result)

})
app.get("/product/:id", async (req, resp) => {
  let result = await Product.findOne({ _id: req.params.id });
  if (result) {
    resp.send(result)
  }
  else {
    resp.send({ result: "No record found." })
  }
})

app.put("/product/:id", async (req, resp) => {
  let result = await Product.updateOne(
    { _id: req.params.id },
    {
      $set: req.body
    })
  resp.send(result)
})
app.get("/search/:key", async (req, resp) => {
  let result = await Product.find({
    "$or": [
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { category: { $regex: req.params.key } }
    ]
  });
  resp.send(result)
})

app.listen(5000)
