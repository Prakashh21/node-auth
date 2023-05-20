const express = require('express');
const rateLimit = require('express-rate-limit');
const app = express()

const port = 5000


require('dotenv').config();


const bodyParser =  require("express").json;
const nodemailer = require('nodemailer');
const { connectMongoDb } = require('./connection');
const User = require('./models/User');
const appRouter = require('./routes/handler');


app.use(bodyParser())
connectMongoDb('mongodb://127.0.0.1:27017/node-auth').then(() => console.log("mongoDb connected !!"))

app.use("/",appRouter)

app.get("/",(req, res) => {
    return res.send("sdjfaskjfjsf")
})

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





async function isUserNotPresent(email) {
    try {
      const user = await User.findOne({ email });
      return !user; // Returns true if user is not found, false otherwise
    } catch (error) {
      // Handle the error
      console.error('Error checking user:', error);
      return false;
    }
  }


  async function isUserNotPresent(email) {
    try {
      const user = await User.findOne({ email });
      return !user; // Returns true if user is not found, false otherwise
    } catch (error) {
      // Handle the error
      console.error('Error checking user:', error);
      return false;
    }
  }

  async function addUserWithOtp(email){
    try {
        // let otp = generateOTP();
        let otp = generateOTP()
        let user = new User({ email });

        // Check if OTP already exists in the user's OTPs array
        while (user.otps.some(otpObj => otpObj.otp === otp)) {
          otp = generateOTP();
        }

        user.otps.push({ otp });
        await user.save();
        console.log('User added successfully with OTP:', otp);
      } catch (error) {
        // Handle the error
        console.error('Error adding user:', error);
      }

  }



app.post('/generateOtp', generateOtpRateLimiter, async (req , res) => {

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

    })



    app.post('/login',(req , res) => {
        const {email , otp} = req.body;



        // if otp is valid we'll create a

    })

app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})