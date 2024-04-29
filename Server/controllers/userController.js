const User=require("../model/userModel");
const brcrypt=require("bcrypt");
const register =async(req,res,next)=>{
   try{
      const {username,email,password}=req.body;
      const usernameCheck=await User.findOne({username});
      if(usernameCheck)
        res.json({msg:"Username already used", status:false});
      const emailCheck= await User.findOne({email});
      if(emailCheck)
        res.json({msg:"Email already used", status:false});
      const hashedPassword=await brcrypt.hash(password,10);
      const user=await User.create({
        email,
        username,
        password:hashedPassword,
      });
      delete user.password;
     
      return res.json({status:true,user});
   }
   catch(ex){
    next(ex);
   }
     
}

const login=async(req,res,next)=>{
    try{
   const {username , password}=req.body;
   const user=await User.findOne({username});
   if(!user)
    return  res.json({msg:"Incorrect username or password" , status:false});
  
  const isPasswordValid=await brcrypt.compare(password,user.password);
   
  if(!isPasswordValid)
  return  res.json({msg:"Incorrect username or password" , status:false});
   delete user.password;
   return res.json({status:true,user});
}
catch(ex){
    next(ex);
}
}
const setAvatar=async(req,res,next)=>{
  try{
     const userId=req.params.id;
     const avatarImage=req.body.image;
     const userData=await User.findByIdAndUpdate(userId,{
    isAvatarImageSet:true,
    avatarImage:avatarImage,
     }, {new:true})   ;
     
    return res.json({isSet:userData.isAvatarImageSet,image:userData.avatarImage})
  }
  catch(ex){
    next(ex);
  }
}
const getAllUsers=async(req,res,next)=>{
  try{
     const userId=req.params.id;
     const users=await User.find({_id:{$ne:userId}}).select([
      "email",
      "_id",
      "avatarImage",
      "username",
       
     ]);
     
     return res.json(users);
  }
  catch(ex){
    next(ex);
  }
}

module.exports.login=login;
module.exports.register= register;
module.exports.setAvatar= setAvatar;
module.exports.getAllUsers= getAllUsers;