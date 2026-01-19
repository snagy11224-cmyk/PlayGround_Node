const express = require("express"); 
const userRouter = require("./users/routes");   
const app= express();
app.use(express.json()); 
const port = 4000; 


app.use('/users', userRouter);
//we can call users as a mini router app -- from main express app
// to call user endpoints we will use "/users" as prefix

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
