const {User} = require('../models/user')
// const auth= require('../middleware/auth')
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'jasmeen.33k@gmail.com',
      pass: 'Jazz1234'
    }
  });
const userController = () => {

    return {
        index(req, res) {
            res.status(200).send({ "name": "manish kumar" })
        },
        async register(req, res) {
            console.log(req.body)

            try {

                const user = new User(req.body)
                // sendEmail(req)
                await user.save()
                let mailOptions={
                    from: 'jasmeen.33k@gmail.com',
                    to: req.body.email,
                    subject: 'welcome '+req.body.name,
                    text: 'welcome to our chat system'
                };
                transporter.sendMail(mailOptions, function(error, info){
                    if (error) {
                    console.log(error);
                    } else {
                    console.log('Email sent: ' + info.response);
                    }
                });
                res.status(200).send({ user:user.getHide() })
            } catch (error) {
                res.status(400).send({
                    "error": error.message
                })
            }

        },
        async login(req, res) {
            try {
                // console.log(req.body)
                const user = await User.findByCredentials(req.body.email, req.body.password)
                user.status = 1
                const token = await user.genToken();
                res.status(200).send({ user:user.getHide(),token })

            } catch (error) {
                res.status(400).send({
                    "error": error.message
                })
            }


        },
        profile(req,res){
            const user = new User(req.user)
            res.send(user.getHide())
        },
        async logout(data){
          try {
            const user = await User.updateOne({_id:data.id},{
                $set: {
                    status:0
                }})

            return user
          } catch (error) {
           return( error.message);   
          }
        },
        async allUser()
        {
            try {
                const allUsers =await User.find({}).select('name email').exec()
                
                // console.log(allUsers)
                return allUsers
            } catch (error) {
                return error.message
            }
        }
    }
}


module.exports = userController
