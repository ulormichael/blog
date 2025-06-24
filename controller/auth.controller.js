const Auth = require("../model/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const signup = async(req,res) => {
    const { email, password, name } = req.body;
    // let email = req.body.email;
    // let password = req.body.password;
    // let name = req.body.name;
    if (!email || !password || !name) {
        return res.status(400).json({ message: "Fill in the details" });
    }

    const useremail = await Auth.findOne({ email });
    if (useremail) {
        return res.status(400).json({ message: "Email already exists"});
    }

    const hashedPassword = await bcrypt.hashSync(password, 10);
    const newAuth = new Auth({
        name,
        password: hashedPassword,
        email,
    });

    try {
        await newAuth.save();
        return res.status(200).json({ message: "Sign up successful" });
    } catch (err) {
        return res.status(500).json({ message: "Error signing up", error: err.message});
    }
}

const signin = async(req,res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Fill in all fields" });
    }
            
    const userAuth = await Auth.findOne({ email });
    console.log(userAuth);

    if (!userAuth) {
        return res.status(404).json({ message: "User not found" });
    }
        
    const isPasswordValid = await bcrypt.compare(password, userAuth.password);
    if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid password" });
    }    
    const token = jwt.sign({ id: userAuth._id, name: userAuth.name }, process.env.SECRET); // Replace 'secret' with a real secret
res.cookie('access_token', token, { // Set the token in a cookie
    httpOnly: true, // Make the cookie accessible only by the web server
    // sameSite: 'None', //  Allow cross-site cookies (for development, be cautious in production)
    // secure: true,   //  Ensure the cookie is only sent over HTTPS (for production)
    path: '/',       //  Set the cookie path to be accessible across the entire site
    })
    return res.status(200).json({ message: "signin successfully" });
}

module.exports = {
    signup,
    signin
}
