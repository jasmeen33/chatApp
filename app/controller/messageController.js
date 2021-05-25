const messages = require('../models/message');
const mongoose = require('mongoose')
let messageController = {};

messageController.saveMessage = async (data) => {
    try {

        const cId = data.sender + data.receiver
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

messageController.lastMessages = async (req,res) => {
    console.log(req.body.id)
     messages.aggregate([
        {
            $match: {
                or:[
                    {'sender':new mongoose.Types.ObjectId(req.body.id)},{'receiver':new mongoose.Types.ObjectId(req.body.id)}
                ]
            }
        },
        // {
        //     $sort:{date:-1}
        // },
        // {
        //     $group:{
        //         _id:"$conversationId",
        //         sender:{$first: "$sender"},
        //         receiver:{$first: "$receiver"},
        //         message:{$first: "$message"},
        //         date:{$first: "$date"}
        //     }
        // }
        ]
    ).exec((err,result)=>{
        if(err){ res.status(400).send(err.message)}
        else{
            res.status(200).send(result);
        }
    })
    
}

module.exports = messageController;