import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

//sign up controller
export const signup = async (req, res) => {
    try {
        const { fullName, email, password, confirmPassword } = req.body;

        // Validate required fields
        if (!fullName || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        // Check if passwords match
        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match'
            });
        }

        // Password strength validation
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters long'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create user
        const user = await User.create({
            fullName,
            email,
            password
        });

        // Send response
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Signup error:', error);

        // Handle mongoose validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: messages[0]
            });
        }

        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later'
        });
    }
};

//login controller
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password'
            });
        }

        // Find user by email and include password field
        const user = await User.findOne({ email }).select('+password');

        // Check if user exists
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user account is active
        if (user.status === 'inactive') {
            return res.status(403).json({
                success: false,
                message: 'Your account has been deactivated. Please contact administrator.'
            });
        }

        // Compare password
        const isPasswordMatch = await user.comparePassword(password);

        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login timestamp
        await user.updateLastLogin();

        // Generate token
        const token = generateToken(user._id);

        // Send response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later'
        });
    }
};
