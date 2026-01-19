const userService = require("../services/user.services");


exports.register = async (req, res) => {
  const { email, password } = req.body;             
    try {   
        const user = await userService.registerUser(email, password);
        res.status(201).json({ message: "User registered successfully", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}   


exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const tokens = await userService.loginUser(email, password);
    res.status(200).json(tokens);
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await userService.getProfile(req.user);
    res.status(200).json({ email: user.email });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};


