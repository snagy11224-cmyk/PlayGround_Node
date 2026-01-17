const bcrypt = require("bcrypt");

exports.hashPassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 10);   
  return hashedPassword;
}       

exports.comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
}   