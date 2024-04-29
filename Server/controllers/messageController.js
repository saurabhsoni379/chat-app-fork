const { Mongoose } = require('mongoose');
const msgModel=require('../model/msgModel')
module.exports.addMessage=async(req,res,next)=>{
    try{
        const {from ,to,message,time}=req.body;
       
        const data=await msgModel.create({
            message:{text:message},
            users:[from,to],
            sender:from,
            time:time,
        });
        if(data)return res.json({msg:"succesfully added to the database"});
        return res.json({msg:"Failed to add msg"})
    }
    catch(ex){
        next(ex);
    }
}
module.exports.getAllMessage=async(req,res,next)=>{
    try{
        
        const from =req.query.from;
        const to=req.query.to;
        const messages=await msgModel.find({
            users:{
                $all:[from,to]
            }
        }).sort({updatedAt:1});
         
        const projectMessage=messages.map((msg)=>{
            return {
                fromSelf:msg.sender.toString() === from,
                message:msg.message.text,
                 time:msg.time,
            }
        })
      
        return res.json(projectMessage);  
    }
    catch(ex){
        next(ex);
    }
    

}
