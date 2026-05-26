const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sendEmail = require('../utils/sendMail');

const generateToken = (id) => {
    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
    );
};

// Register User
const registerUser = async (req, res) => {

    const { name, email, password } = req.body;

    try {

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        if (user) {

            // Generate OTP
            const otp = Math.floor(
                100000 + Math.random() * 900000
            ).toString();

            // Save OTP
            user.otp = otp;

            await user.save();

            // Email message
            const message = `Your OTP for registration is: ${otp}`;

            // Send email
            await sendEmail(
                email,
                'Welcome to ShopNest - OTP Verification',
                message
            );

            // Response
            res.status(201).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });

        } else {

            res.status(400).json({
                message: 'Invalid user data'
            });

        }

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server error'
        });

    }

};

// Login User
const LoginUser = async (req, res) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if (
            user &&
            (await bcrypt.compare(password, user.password))
        ) {

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });

        } else {

            res.status(400).json({
                message: 'Invalid email or password'
            });

        }

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server error'
        });

    }

};

// Get All Users
const getUsers = async (req, res) => {

    try {

        const users = await User.find({})
            .select('-password');

        res.json(users);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server error'
        });

    }

};

// Update User Role
const updateUserRole = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.role = req.body.role || (user.role === 'admin' ? 'user' : 'admin');
        await user.save();
        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot delete yourself' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    registerUser,
    LoginUser,
    getUsers,
    updateUserRole,
    deleteUser
};