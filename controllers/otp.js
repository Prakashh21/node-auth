const randomOtpGenerator = require("../lib/lib");
const nodemailer = require("nodemailer");
const { User } = require("../models/User");

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

const addUserWithOtp = async (email) => {
    try {
        // let otp = generateOTP();
        let otp = randomOtpGenerator()
        let user = new User({ email });

        // Check if OTP already exists in the user's OTPs array

        user.otps.push({ otp });
        await user.save();
        console.log('User added successfully with OTP:', otp);
      } catch (error) {
        // Handle the error
        console.error('Error adding user:', error);
        // res.send("error occured while adding the user to the database")
      }

}


const addOtptoExistingUser = async (email) => {

    const user = await User.findOne({ email });
    let otp = randomOtpGenerator()
    let duplicateOtp = false;



    // console.log("user otps --> ", user.otps)



    user.otps.map(data => {
      if(data.otp === otp){
        console.log("duplicate otp detected")
        duplicateOtp = true
        otp = randomOtpGenerator()
        user.otps.push({otp})
      }
    })

    if(!duplicateOtp){
      console.log("no duplicate otp detected , the first time generated otp pushed");
      user.otps.push({otp});
    }

    user.otps.map(data => console.log(data.timestamp))

    // console.log("data.now() ---> ", Date.now() )


    await user.save();

}


const generateOtp = async (req , res) => {

  const { email } = req.body;
  console.log("logging body -->", email);
  const notPresent = await isUserNotPresent(email)

      if (notPresent) {
       await addUserWithOtp(email);
        res.send("user email and otp successfully added in the database");
      } else {
        console.log("User is already present in the database");
        // add user's otp to the otp array
        await addOtptoExistingUser(email);
        res.send("user was already present, so only otp was added");
      }
    }


  const loginHandler = async (req , res) => {
    const {email,otp} = req.body;
    console.log("email and otp", email , otp);

    const user = await User.findOne({email});

    user.otps.map(data => console.log(data.otp === otp))
    // console.log(user.otps)

    if(!user){
      return res.status(404).json({"message":"oops this user doesnot exists in the database "});
   }

   let otpMatched = false; // Flag to track OTP match

      user.otps.map(data => {
        if(data.otp === otp){
          const currentTime = new Date();
          const currentFormattedDate = currentTime.toISOString();

          const timeDifferenceInMs = Math.abs(currentFormattedDate - data.otp.timestamp)
          const minutesDifference = Math.floor(timeDifferenceInMs / (1000 * 60));
          if(minutesDifference > 5){
            res.send("oops your otp has been expired")
          }else{
            // res.send("yay correct otp matched")
            otpMatched = true;
          }
        }
      })

      if (otpMatched) {
        res.send("Yay, correct OTP matched.");
      } else {
        res.send({ "message": "Oops, you sent a wrong OTP." });
      }





  }


  // const loginHandler = async (req, res) => {
  //   const { email, otp } = req.body;
  //   console.log("email and otp", email, otp);

  //   const user = await User.findOne({ email });

  //   user.otps.map(data => console.log(data.otp === otp));
  //   // console.log(user.otps)

  //   if (!user) {
  //     return res.status(404).json({ "message": "Oops, this user does not exist in the database." });
  //   }

  //   let otpMatched = false; // Flag to track OTP match

  //   user.otps.forEach(data => {
  //     if (data.otp === otp) {
  //       const currentTime = new Date();
  //       const currentFormattedDate = currentTime.toISOString();

  //       const timeDifferenceInMs = Math.abs(currentTime - data.timestamp);
  //       const minutesDifference = Math.floor(timeDifferenceInMs / (1000 * 60));
  //       if (minutesDifference > 5) {
  //         res.send("Oops, your OTP has expired.");
  //       } else {
  //         otpMatched = true; // Set the flag to indicate OTP match
  //       }
  //     }
  //   });

  //   if (otpMatched) {
  //     res.send("Yay, correct OTP matched.");
  //   } else {
  //     res.send({ "message": "Oops, you sent a wrong OTP." });
  //   }

  //   console.log("else block");
  // };





module.exports = {
    generateOtp,
    loginHandler
}




    // const mailOptions = {
    //     from: "whileforifelsedowhile@gmail.com",
    //     to: email,
    //     subject: "otp",
    //     text: `here is your otp -- ${otp.toString()} `
    // }

    // transporter.sendMail(mailOptions)
    //     .then(() => {
    //         res.json({
    //             message: "SUCCESS",
    //             message: "Message sent successfully"
    //         })
    //     })
    //     .catch((error) => {
    //         console.log(error)
    //         res.json({status: "FAILED", message: "An error occurred"});
    //     })