import Users from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const registerUser = async(req, res) => {
    try {
        const { name, email, password, isAdmin = false } = req.body;

        // Check if user already exists
        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        // Hash the password

        const salt = bcrypt.genSaltSync(12)
        const hashedpassword = await bcrypt.hash(password, salt);

        //create new user

        const newUser = new Users({
            name,
            email,
            password: hashedpassword,
            isAdmin
        });
        await newUser.save();
        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, isAdmin: newUser.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        //send the token to client

        res.status(201).json({
            message: 'User registered successfully',
            success: true,
            token
        });


        
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            success: false,
            error: error.message
        })
        
    }
}

export const loginUser = async(req, res) => {
    try {
        const {email,password} = req.body;
        // Check if user exists
        const user = await Users.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }
        // Generate JWT token
        const token = jwt.sign(
            { id: user._id, email: user.email, isAdmin: user.isAdmin },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );
        // Send the token to client
        res.status(200).json({
            message: `Welcome back, ${user.name}!`,
            success: true,
            token
        });
    } catch (error) {
        res.status(500).json({
            message: 'Server error',
            success: false,
            error: error.message
        })
    }
}

export const logoutUser = async(req, res) => {
    try {
        res.clearCookie('token');
        res.status(200).json({
            message: 'User logged out successfully',
            success: true
        })
    }
        catch (error) { 
            res.status(500).json({
                message: 'Server error',
                success: false, 
                error: error.message
            })
        }
}
