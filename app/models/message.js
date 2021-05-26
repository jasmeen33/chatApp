const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Types.ObjectId,
        required: true
      },
      receiverId: {
        type: mongoose.Types.ObjectId,
        required: true
      },
      message: {
        type: String
      },
      
      sendDate: {
        type: Date,
        default: Date.now
      }
})

messageModel = mongoose.model('messageModel',messageSchema);
module.exports= messageModel;