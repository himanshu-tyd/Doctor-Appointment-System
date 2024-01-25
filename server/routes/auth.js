const express = require('express');
const router = express.Router();

require('../database/connection');
const User=require('../models/user-schema')

router.get('/', (req, res) => {
    res.send('Hello from router js');
});

/* Using Async await */

router.post('/signup', async (req, res) => { 
    const { name, email, work, password, cpassword } = req.body;

    if(!name || !email || !work || !password || !cpassword){
   res.status(422).json({error:"please enter all details"});
}else if(password!=cpassword){
   res.status(422).json({error:"password does not match"})
}

    try {

    const userExits=await User.findOne({email:email});
    
    if(userExits){
        res.json({error:`Email already Exits`})
    }
     const user=new User({name,email,work,password,cpassword})


        const userSave=await user.save();
        
        if(userSave){
            res.status(201).json({message:`Data save succesfully`})
        }else{
            res.status(500).json({messsage:`failed`})
        }
        
    } catch (error) {
        console.log(error)
    }




/* Using Promised */


// router.post('/signup',(req, res) => { 
//     const { name, email, work, password, cpassword } = req.body;

//     if(!name || !email || !work || !password || !cpassword){
//         res.status(422).json({error:"please enter all details"});
//     }else if(password!=cpassword){
//         res.status(422).json({error:"password does not match"})
//     }

//     User.findOne({email:email}).then((userExits)=>{
//         if(userExits){
//             res.json({error:"Email already exits"})
//         }
//         const user=new User({name,email,work,password,cpassword})

//         user.save().then(()=>{
//             res.status(201).json({message:"Data save succesfully"})
//         }).catch((e)=>res.status(500).json({error:"failed"}))
//     }).catch((e)=>console.log(e));



    // Additional logic for signup if needed
    // ...

    // If everything is okay, send a success respons
});

module.exports = router;
