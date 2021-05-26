const messages = require('../models/message');

let messageController = {};

messageController.saveMessage= async(req,res)=>{
    try {

        const message = new messages(req.body)
        await message.save()
        // sendEmail(req)
        res.status(200).send({ message })
    } catch (error) {
        res.status(400).send({
            "error": error.message
        })
    }
}

messageController.getHistory = async(req,res)=>{
    try{
    console.log(req.body);
    const filter = {
       $and: [
            {
              senderId: req.body.senderId,receiverId: req.body.receiverId
            }
          ]
      };
      let data = await messages.find(filter).lean();
      res.status(200).send(data);
    }
    catch(error){
        res.status(400).send({
            err: error.message
        })
    }
}

module.exports= messageController;