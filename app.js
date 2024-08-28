const express = require("express");
const userRouter = require("./routes/userRouter.js");
const cookieParser = require("cookie-parser")
const cors = require('cors')
const app = express();

require('dotenv').config();

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: 'http://localhost:5000',
  credentials: true
}));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`run on ${PORT}`);
});

app.use("/user", userRouter);