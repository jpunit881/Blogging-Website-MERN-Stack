const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

// REGISTER
router.post("/register",async (req, res) => {
    try{
        const salt = await bcrypt.genSalt(10);
        const hashedPass = await bcrypt.hash(req.body.password, salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
        }); 
        const user = await  newUser.save();
        res.status(200).json(user);
    }catch(err){
        res.status(500).json(err);
    }
});


// LOGIN
router.post("/login", async (req, res) => {
    try{
        const email = await User.findOne({ email:req.body.email });
        if(!email){
            return res.status(400).json("Wrong Credentials!");
        }

        const validated = await bcrypt.compare(req.body.password, email.password);
        if (!validated) {
            return res.status(400).json("Wrong Credentials!");
        }

        const {password, ...others} = email._doc;

        res.status(200).json(others);

    } catch (err){
        res.status(500).json(err);
    }
})


module.exports = router;