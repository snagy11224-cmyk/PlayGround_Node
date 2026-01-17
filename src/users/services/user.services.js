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
