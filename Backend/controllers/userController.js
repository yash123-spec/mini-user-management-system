// Get current user's profile
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({ success: true, user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later' });
    }
};

// Update current user's profile (fullName, password)
export const updateMe = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('+password');
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { fullName, currentPassword, newPassword } = req.body;
        if (fullName) user.fullName = fullName;

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ success: false, message: 'Current password required to set new password' });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ success: false, message: 'Current password is incorrect' });
            }
            user.password = newPassword;
        }

        await user.save();
        res.status(200).json({ success: true, message: 'Profile updated successfully', user: { fullName: user.fullName, email: user.email, role: user.role, status: user.status } });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ success: false, message: 'Server error. Please try again later' });
    }
};
import User from '../models/User.js';

//get all users with pagination
export const getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Get total count for pagination
        const totalUsers = await User.countDocuments();

        // Get users with pagination
        const users = await User.find()
            .select('-password')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        res.status(200).json({
            success: true,
            users,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalUsers / limit),
                totalUsers,
                usersPerPage: limit
            }
        });
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later'
        });
    }
};

//activate user account
export const activateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.status === 'active') {
            return res.status(400).json({
                success: false,
                message: 'User is already active'
            });
        }

        user.status = 'active';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User activated successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Activate user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later'
        });
    }
};

//deactivate user account
export const deactivateUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.status === 'inactive') {
            return res.status(400).json({
                success: false,
                message: 'User is already inactive'
            });
        }

        // Prevent admin from deactivating themselves
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: 'You cannot deactivate your own account'
            });
        }

        user.status = 'inactive';
        await user.save();

        res.status(200).json({
            success: true,
            message: 'User deactivated successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    } catch (error) {
        console.error('Deactivate user error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error. Please try again later'
        });
    }
};
