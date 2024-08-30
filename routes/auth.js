const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");


//importing a hashing function
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var fetchuser = require('../middleware/fetchuser');
const JWT_SECRET = "vivekisgoodguy";

//create a User using:POST "/api/auth/" no authentication required
router.post('/createuser',
  [
    body("name").isLength({ min: 3 }),
    body("email").isEmail(),
    body("password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    //if errors return bad request 
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({success, errors: errors.array() });
    } 
    //check whether the user email already exist or notes
    try{
    let user = await User.findOne({ email: req.body.email});
    if (user){
      return res.status(400).json({success,error:"Email Already existed"})
    }
    const salt = await bcrypt.genSalt(10);
    const secPassword = await bcrypt.hash(req.body.password, salt);
    //create a new user
    user = await User.create({
      name: req.body.name,

      password: secPassword,
      email: req.body.email,
    });
    const data ={
      user:{
        id:user.id
      }
    }

    const authtoken = jwt.sign(data,JWT_SECRET);
    
      //.then((user) => res.json(user))
      //.catch((err) => {
      //  console.log(err);
      //  res.json({ error: "please enter a valid email", message: err.message });
      
    //res.json({'Nice':"nice"})
    success = true;
    res.json({ success,authtoken })
   //res.json(user);
  }
  //catch errors
  catch(error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
} );


//Authenticate a user using POST "/api/auth/login".no login required

router.post('/login',
  [
    
    body("email","Enter a valid email").isEmail(),
    body("password","password cannot be blank").exists(),
  ],async(req, res) => {
    let success = false;

    //if errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {email, password}= req.body;
    try {
      let user = await User.findOne({ email});
      if (!user) {
        return res.status(400).json({ errors:"please try to login with correct credentials"});
      }

      const passwordCompare = await bcrypt.compare(password,user.password)
      if (!passwordCompare) {
        success = false;
        return res.status(400).json({success, error:"please try to login with correct credentials"})
      }
      const data = {
        user:{
          id: user.id
        }
      }
      const authtoken = jwt.sign(data,JWT_SECRET);
      success = true;
      res.json({success,authtoken})
      
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server Error");
      
    }
  }
)
 
//Route 3 :Get loggedin User Details using:POST "/api/auth/getuser" //login required
router.post('/getuser',fetchuser,async(req, res)=>{
  
 try {
     const UserId = req.user.id;
    const user = await User.findById(UserId).select("-password")
    res.send(user)
 }
  catch (error) {
  console.error(error.message);
  res.status(500).send("Internal server Error");
 }

})


module.exports = router;
  
