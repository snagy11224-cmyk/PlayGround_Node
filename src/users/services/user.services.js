const userRepo=require("../repositories/user.repository");
const {hashPassword,comparePassword}=require("../utils/hash");
const {createAccessToken,createRefreshToken,verifyRefreshToken,verifyAccessToken}=require("../utils/jwt");

//register user
exports.registerUser=async(email,password)=>{
    const exists=userRepo.findEmail(email);
    if(exists){
        throw new Error("User already exists");
    }

    const hashedPassword=await hashPassword(password);
    return userRepo.create(email,hashedPassword);
}

//login user
exports.loginUser = async (email, password) => {
  const user = userRepo.findEmail(email);
  if (!user) {
    throw new Error("Invalid credentials");
  }

  const isCorrect = await comparePassword(password, user.password);
  if (!isCorrect) {
    throw new Error("Invalid credentials");
  }

  return {
    accessToken: createAccessToken(user),
    refreshToken: createRefreshToken(user),
  };
};

//get my profile
exports.getProfile = async (decodedUser) => {
  const user = userRepo.findEmail(decodedUser.email);
  if (!user) {
    throw new Error("User not found");
  }
  return user;
};


