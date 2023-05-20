const User = require("../models/User");
const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.AUTH_EMAIL, // Replace with your Gmail email address
      pass: process.env.AUTH_PASS // Replace with your Gmail password
    }
  });

transporter.verify((error, success) => {
    if(error){
        console.log(error);
    }else{
        console.log("Ready for messages")
        console.log("success value",success)
    }
})



const generateOTP = async (req , res) => {

    // if user exists in database  , we'll create a 8 digit otp and push it into the otp array for the user
    //

    // if user doesnot exist , we'll create a new user and create otp and push it into the otp array


    const {email} = req.body;


    isUserNotPresent(email)
    .then(notPresent => {
        if(notPresent){
            addUserWithOtp(email)
        }else {
            console.log("User is already present in database")
            // add user's otp to the otp array
        }
    })
    .catch(error => {
        console.log("Error:",error)
    })


    const mailOptions = {
        from: "whileforifelsedowhile@gmail.com",
        to: email,
        subject: "otp",
        text: `here is your otp -- ${otp.toString()} `
    }

    transporter.sendMail(mailOptions)
        .then(() => {
            res.json({
                message: "SUCCESS",
                message: "Message sent successfully"
            })
        })
        .catch((error) => {
            console.log(error)
            res.json({status: "FAILED", message: "An error occurred"});
        })

    }



module.exports = {
    generateOtp
}