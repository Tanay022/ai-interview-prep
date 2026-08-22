const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const BlacklistedTokens = require('../models/blacklistmodel')

const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 24 * 60 * 60 * 1000 // 1 day, matches JWT expiry
}

// function for creating(register) a new user ------->

const createUser = async (req, res) => {

    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: "username, email and password are all required" })
        }
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" })
        }

        const isUserAlreadyExist = await User.findOne({
            $or: [{ username }, { email }]
        })
        if (isUserAlreadyExist) {
            return res.status(400).json({ message: "Account already exists with this username or email" })
        }
        // creating(inserting new user)
        const hash = await bcrypt.hash(password, 10);
        const user = await User.create({
            username, email, password: hash
        })
        // creating jwt token on registration---->
        const token = jwt.sign({
            id: user._id,     //payload
            username: user.username
        },
            process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, cookieOptions)  // storing token in a cookie
        res.status(201).json({
            message: "User Registration Successfull",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }

    catch (err) {
        console.log(err);
        return res.status(500).json({ message: err.message })
    }
}


//---------- function for registration user completed-------//



// function for checking login info------->
const userlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" })
        }

        const user = await User.findOne({ email })
        if (!user) { return res.status(400).json({ message: "Invalid email or password" }) } //user not in database
        const isValidpasssword = await bcrypt.compare(password, user.password)
        if (!isValidpasssword) { return res.status(400).json({ message: "Invalid email or password" }) } // wrong password

        // creating jwt token on login---->
        const token = jwt.sign({
            id: user._id,     //payload
            username: user.username
        },
            process.env.JWT_SECRET, { expiresIn: "1d" })

        res.cookie("token", token, cookieOptions)  // storing token in a cookie

        return res.status(200).json({
            message: "User Login Successfull",
            user: {
                _id: user._id,
                username: user.username,
                email: user.email
            }
        })
    }

    catch (err) {
        res.status(500).json({ message: err.message })
    }
} //-------function for login completed-----------//



// function for logout--------->
const userlogout = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (token) {
            await BlacklistedTokens.create({ token })
        }
        res.clearCookie("token");
        res.status(200).json({ message: "User Logged Out Successfully" })
    }

    catch (err) {
        res.status(500).json({ message: err.message })
    }
} // -------function for logout completed----------//


// creating a function for getting current logged in user detail

async function getMe(req, res) {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        res.status(200).json({
            message: "User details fetch successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        })
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


module.exports = { createUser, userlogin, userlogout, getMe }