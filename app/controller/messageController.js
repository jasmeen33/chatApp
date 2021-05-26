const messages = require('../models/message');
const mongoose = require('mongoose')
const cron = require('node-cron')

cron.schedule('* 23 * * *',()=>{
    messages.remove({}).then(()=>{
        console.log("delete the messages at 12pm successfully")
    }).catch((error)=>{
        console.log(error)
    })
})
let messageController = {};

messageController.saveMessage = async (data) => {
    try {

        const cId = [data.receiver, data.sender].sort().join('.')
        const message = new messages({
            sender: data.sender,
            receiver: data.receiver,
            conversationId: cId,
            message: data.message
        })
        await message.save()
        return(message);
    } catch (error) {
        return({
            "error": error.message
        })
    }
}

messageController.getHistory = async (data) => {
    try {

        let msg = await messages.find({
            $and: [
                {
                    sender: {
                        $in: [data.sender, data.receiver]
                    },
                    receiver: {
                        $in: [data.sender, data.receiver]
                    }
                }
            ]
        }).lean();

        return msg;
    }
    catch (error) {
        return ({
            err: error.message
        })
    }
}

messageController.lastMessages = async (id) => {
     messages.aggregate([
        {
            $match: {
                $or:[
                    {'sender':new mongoose.Types.ObjectId(id)},{'receiver':new mongoose.Types.ObjectId(id)}
                ]
            }
        },
        {
            $sort:{date:-1}
        },
        {
            $group:{
                _id:"$conversationId",
                sender:{$first: "$sender"},
                receiver:{$first: "$receiver"},
                message:{$first: "$message"},
                date:{$first: "$date"}
            }
        }
        ]
    ).exec((err,result)=>{
        if(err){ return({error:err.message})}
        else{
            return(result);
        }
    })
    
}

module.exports = messageController;
