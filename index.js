const express = require("express"); //importing express module
const app = express(); //app is an object returned by express function
const bcrypt = require("bcrypt"); 
const jwt = require("jsonwebtoken");
app.use(express.json()); //to make the app able to parse json data
const port = 4000; //open port --> to communicate with ip address (host)


//in-memory data
let users = [   
    { email: "salma@salma.salma", password: "1234" }
]

//secret keysn for JWT
const ACCESS_SECRET="mysecretkey";
const REFRESH_SECRET="myrefreshsecretkey";


/*################################################################################*/

//get endpoint
//req,res are built in express objects
app.get("/message", (req, res) => {
  res.status(200).json({ message: "Hello from Get request" }); //can set both in one line
});

//post endpoint
app.post("/hello", (req, res) => {
const name=req.body.name;  //getting name from request body
res.status(201).json({ message: `Hello ${name}` });
});

/*################################################################################*/

//register endpoint
app.post("/users", async (req, res) => {
  const { email,password } = req.body;    
  const hashedPassword = await bcrypt.hash(password, 10); //10 is the salt => # of rounds to hash the password
  const user={email,password:hashedPassword};
  console.log(user.password);
  users.push({user});  
  res.status(201).json({ message: "User Created Successfully!", user: user });
});

//login endpoint
app.post("/users/login", async (req, res) => {
  const { email, password } = req.body;
   //check ifn user exists in DB
   const user = users.find((u) => u.email === email);
    if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    //check if password is correct
    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    //generate JWT tokens
    const accessToken = createAceessToken(user);
    const refreshToken = createRefreshToken(user);
});

/*################################################################################*/
function createAceessToken(user){
    return jwt.sign({email:user.email},ACCESS_SECRET,{expiresIn:"15m"});
}
function createRefreshToken(user){
    return jwt.sign({email:user.email},REFRESH_SECRET,{expiresIn:"7d"});
}

/*################################################################################*/
//to make the server listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
