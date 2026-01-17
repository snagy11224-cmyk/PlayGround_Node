const userService = require("../services/user.services.js");


exports.register = async (req, res) => {
  const { email, password } = req.body;             
    try {   
        const user = await userService.registerUser(email, password);
        res.status(201).json({ message: "User registered successfully", email: user.email });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
