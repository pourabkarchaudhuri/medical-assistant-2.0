const express = require("express");
const bodyParser = require("body-parser");
const compression = require("compression");
const morgan = require("morgan");
//env
const dotenv = require("dotenv");
dotenv.config();

//port assignment 3000
const staticPort = 3000
const port = process.env.PORT || staticPort;

// we will create these routes in the future
const routes = require("./routes/diagnosisRoutes");

const app = express();

// middleware to convert our request data into JSON format
app.use(bodyParser.json())
app.use(compression())
app.use(morgan('common'));
// include the userRoutes
app.use("/api/v1", routes);

app.get('/', (req, res)=>
{
    res.send({
      status: 200,
      message: "Online",
      uptime: process.uptime()
    });
})  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});