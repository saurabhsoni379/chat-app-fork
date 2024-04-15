const mongoose =require('mongoose');

const messageSchema=new mongoose.Schema(
 {message:{
   text:{
     type:String,
    required:true,
 }
}
,

 users:[String],
 sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Users",
    required:true,
 } 
 ,
   time:{
      type:String,
      required:true,
   }

 
  }
 ,
 {
    timestamps: true
    }
 
   
);

module.exports=mongoose.model('message',messageSchema);