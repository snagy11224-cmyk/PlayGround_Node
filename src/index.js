const express = require("express"); //importing express module
const app = express(); //app is an object returned by express function
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
app.use(express.json()); //to make the app able to parse json data
const port = 4000; //open port --> to communicate with ip address (host)

//in-memory data
let users = [
  {
    email: "salma@salma.salma",
    password: "$2b$10$hashedpasswordhere",
  },
];

//secret keysn for JWT
const ACCESS_SECRET = "mysecretkey";
const REFRESH_SECRET = "myrefreshsecretkey";

/*################################################################################*/

//get endpoint
//req,res are built in express objects
app.get("/message", (req, res) => {
  return res.status(200).json({ message: "Hello from Get request" }); //can set both in one line
});

//post endpoint
app.post("/hello", (req, res) => {
  const name = req.body.name; //getting name from request body
  return res.status(201).json({ message: `Hello ${name}` });
});

/*################################################################################*/

//register endpoint
app.post("/users", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt => # of rounds to hash the password
  const user = { email, password: hashedPassword };
  console.log(user.password);
  users.push(user);
  return res
    .status(201)
    .json({ message: "User Created Successfully!", user: user });
});

//login endpoint
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
  //check if user exists in DB
  const user = users.find((u) => u.email === email);
  if (!user) {
    //return is essential to stop executing rest of the code
    return res.status(401).json({ message: "Invalid credentials" });
  }
  //check if password is correct
  const isCorrectPassword = await bcrypt.compare(password, user.password);
  if (!isCorrectPassword) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  //generate JWT tokens
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  //respond with tokens
  return res.status(200).json({ accessToken, refreshToken });
});

//get my profile endpoint
app.get("/me", async(req, res) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  //to split "Bearer" keyword from the token
  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, ACCESS_SECRET);
    const user = users.find(u => u.email === decoded.email);
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

//refresh token endpoint
app.post("/refresh", async(req, res) => {
  const token = req.body.token;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const user = jwt.verify(token, REFRESH_SECRET);
    const newAccessToken = createAccessToken(user);
    return res.status(200).json({newAccessToken});
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
});

/*################################################################################*/
function createAccessToken(user) {
  return jwt.sign({ email: user.email }, ACCESS_SECRET, { expiresIn: "15m" });
}
function createRefreshToken(user) {
  return jwt.sign({ email: user.email }, REFRESH_SECRET, { expiresIn: "7d" });
}

/*################################################################################*/
//to make the server listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});