const randomOtpGenerator = () => Math.floor(Math.pow(10, 8-1) + Math.random() * 9 * Math.pow(10, 8-1));


module.exports = randomOtpGenerator